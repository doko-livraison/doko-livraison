import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { missionsAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  accepted: { label: 'Acceptée', color: '#3B82F6' },
  in_progress: { label: 'En cours', color: '#8B5CF6' },
  delivered: { label: 'Livré - en attente validation', color: '#F59E0B' },
  validated: { label: 'Validée ✓', color: '#10B981' },
};

export default function TransporterMissionsScreen({ navigation }: any) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await missionsAPI.getTransporterMissions();
      setMissions(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const submitProof = (missionId: string) => {
    navigation.navigate('ProofDelivery', { missionId });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#1A3A8C" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes livraisons</Text>
      <FlatList
        data={missions}
        keyExtractor={(item: any) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucune livraison acceptée</Text>}
        renderItem={({ item }: any) => {
          const s = STATUS_LABELS[item.status] || { label: item.status, color: '#999' };
          return (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.type}>{item.deliveryType}</Text>
                <View style={[styles.badge, { backgroundColor: s.color + '20' }]}>
                  <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                </View>
              </View>
              <Text style={styles.address}>📍 {item.pickupAddress}</Text>
              <Text style={styles.address}>🏁 {item.deliveryAddress}</Text>
              {item.status === 'accepted' && (
                <TouchableOpacity style={styles.proofBtn} onPress={() => submitProof(item.id)}>
                  <Text style={styles.proofText}>📸 Déposer preuve de livraison</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 24, paddingTop: 60, backgroundColor: '#fff', color: '#1a1a1a' },
  card: {
    backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  type: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', textTransform: 'capitalize' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  address: { fontSize: 14, color: '#555', marginTop: 4 },
  proofBtn: {
    backgroundColor: '#1A3A8C', borderRadius: 12, padding: 12,
    alignItems: 'center', marginTop: 12,
  },
  proofText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 16 },
});
