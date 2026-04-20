import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { reviewsAPI } from '../../services/api';
import { colors } from '../../utils/colors';

export default function ReviewScreen({ route, navigation }: any) {
  const { missionId, transporterId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Note requise', 'Veuillez attribuer une note.');
      return;
    }
    setLoading(true);
    try {
      await reviewsAPI.submit({ missionId, transporterId, rating, comment });
      Alert.alert('Avis envoyé !', 'Merci pour votre retour.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible d\'envoyer l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Évaluer le transporteur</Text>
      <Text style={styles.subtitle}>Votre avis aide la communauté Doko</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note globale</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity key={s} onPress={() => setRating(s)}>
              <Text style={[styles.star, s <= rating && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingLabel}>
          {rating === 0 ? 'Appuyez pour noter' : ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent !'][rating]}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commentaire (optionnel)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Décrivez votre expérience..."
          placeholderTextColor={colors.textMuted}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, rating === 0 && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading || rating === 0}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.btnText}>Envoyer l'avis</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '900', color: colors.textDark, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  section: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark, marginBottom: 12 },
  stars: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  star: { fontSize: 40, color: colors.border },
  starActive: { color: colors.accent },
  ratingLabel: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  textArea: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    padding: 14, fontSize: 15, color: colors.textDark, minHeight: 100,
  },
  btn: { backgroundColor: colors.accent, borderRadius: 14, padding: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
});
