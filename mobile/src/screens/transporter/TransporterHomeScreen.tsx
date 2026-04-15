import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl, Switch,
} from 'react-native';
import { missionsAPI, transportersAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function TransporterHomeScreen({ navigation }: any) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [available, setAvailable] = useState(true);

  const load = async () => {
    try {
      const res = await missionsAPI.getPending();
      setMissions(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const toggleAvailability = async (val: boolean) => {
    setAvailable(val);
    try { await transportersAPI.updateAvailability(val); } catch {}
  };

  const acceptMission = async (id: string) => {
    try {
      await missionsAPI.accept(id);
      Alert.alert('Mission acceptée !', 'Vous pouvez consulter votre mission dans "Mes livraisons".');
      load();
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible d\'accepter');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#1A3A8C" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Missions disponibles</Text>
        <View style={styles.availRow}>
          <Text style={styles.availLabel}>{available ? 'Disponible' : 'Indisponible'}</Text>
          <Switch value={available} onValueChange={toggleAvailability} trackColor={{ true: '#10B981' }} />
        </View>
      </View>
      <FlatList
        data={missions}
        keyExtractor={(item: any) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucune mission disponible</Text>}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.type}>{item.deliveryType}</Text>
              {item.needsHandling && <Text style={styles.tag}>🏋️ Manutention</Text>}
              {item.fragile && <Text style={styles.tag}>⚠️ Fragile</Text>}
              {item.hasStairs && <Text style={styles.tag}>🪜 Escaliers</Text>}
            </View>
            <Text style={styles.address}>📍 {item.pickupAddress}</Text>
            <Text style={styles.address}>🏁 {item.deliveryAddress}</Text>
            {item.estimatedWeightKg && <Text style={styles.info}>⚖️ ~{item.estimatedWeightKg} kg</Text>}
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptMission(item.id)}>
              <Text style={styles.acceptText}>Accepter cette mission</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  availRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  availLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  card: {
    backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10, alignItems: 'center' },
  type: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', textTransform: 'capitalize' },
  tag: { fontSize: 12, backgroundColor: '#FFF3EF', color: '#1A3A8C', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  address: { fontSize: 14, color: '#555', marginTop: 4 },
  info: { fontSize: 13, color: '#888', marginTop: 6 },
  desc: { fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' },
  acceptBtn: {
    backgroundColor: '#1A3A8C', borderRadius: 12, padding: 14,
    alignItems: 'center', marginTop: 14,
  },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 16 },
});
