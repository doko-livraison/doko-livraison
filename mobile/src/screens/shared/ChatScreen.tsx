import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { messagesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../utils/colors';
import { getSocket } from '../../services/socket';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export default function ChatScreen({ route, navigation }: any) {
  const { missionId, otherName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    const socket = getSocket();
    socket.emit('joinRoom', { missionId });
    socket.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => { socket.off('newMessage'); };
  }, []);

  const loadMessages = async () => {
    try {
      const res = await messagesAPI.getByMission(missionId);
      setMessages(res.data);
    } catch {}
    setLoading(false);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 200);
  };

  const send = async () => {
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    try {
      await messagesAPI.send(missionId, content);
    } catch {}
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherName || 'Chat'}</Text>
      </View>

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const mine = item.senderId === user?.id;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
                {item.content}
              </Text>
              <Text style={styles.bubbleTime}>
                {new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.primary, padding: 16, paddingTop: 55,
  },
  backText: { color: colors.white, fontSize: 22, fontWeight: '700' },
  headerTitle: { color: colors.white, fontSize: 17, fontWeight: '700' },
  list: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: '75%', borderRadius: 16, padding: 12,
  },
  bubbleMine: {
    backgroundColor: colors.primary, alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.white, alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15 },
  bubbleTextMine: { color: colors.white },
  bubbleTextOther: { color: colors.textDark },
  bubbleTime: { fontSize: 10, color: 'rgba(150,150,150,0.8)', marginTop: 4, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15,
    color: colors.textDark, maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: colors.primary, width: 44, height: 44,
    borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  sendIcon: { color: colors.white, fontSize: 16 },
});
