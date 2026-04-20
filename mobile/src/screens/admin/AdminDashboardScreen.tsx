import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { adminAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../utils/colors';

interface Stats {
  totalUsers: number;
  totalMissions: number;
  pendingMissions: number;
  totalRevenue: number;
}

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'missions' | 'users'>('missions');
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const [statsRes, missionsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getMissions(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setMissions(missionsRes.data);
      setUsers(usersRes.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handleSuspendUser = (userId: string, name: string) => {
    Alert.alert(`Suspendre ${name} ?`, 'Cette action désactivera le compte.', [
      { text: 'Annuler' },
      {
        text: 'Suspendre', style: 'destructive', onPress: async () => {
          try { await adminAPI.suspendUser(userId); load(); } catch {}
        },
      },
    ]);
  };

  const handleCancelMission = (missionId: string) => {
    Alert.alert('Annuler la mission ?', 'La mission sera marquée annulée.', [
      { text: 'Non' },
      {
        text: 'Oui', style: 'destructive', onPress: async () => {
          try { await adminAPI.cancelMission(missionId); load(); } catch {}
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {/* Stats */}
        {stats && (
          <View style={styles.statsGrid}>
            <StatCard label="Utilisateurs" value={stats.totalUsers} color={colors.primary} />
            <StatCard label="Missions" value={stats.totalMissions} color="#8B5CF6" />
            <StatCard label="En attente" value={stats.pendingMissions} color="#F59E0B" />
            <StatCard label="Revenus €" value={`${stats.totalRevenue?.toFixed(0) || 0}`} color={colors.success} />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'missions' && styles.tabActive]}
            onPress={() => setTab('missions')}
          >
            <Text style={[styles.tabText, tab === 'missions' && styles.tabTextActive]}>Missions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'users' && styles.tabActive]}
            onPress={() => setTab('users')}
          >
            <Text style={[styles.tabText, tab === 'users' && styles.tabTextActive]}>Utilisateurs</Text>
          </TouchableOpacity>
        </View>

        {tab === 'missions' ? (
          missions.length === 0 ? (
            <Text style={styles.empty}>Aucune mission</Text>
          ) : (
            (missions as any[]).map((m: any) => (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{m.deliveryType}</Text>
                  <Text style={[styles.badge, { color: m.status === 'pending' ? '#F59E0B' : colors.primary }]}>
                    {m.status}
                  </Text>
                </View>
                <Text style={styles.cardSub}>
                  {m.client?.firstName} {m.client?.lastName}
                </Text>
                <Text style={styles.cardSub}>📍 {m.pickupAddress}</Text>
                {m.status === 'pending' && (
                  <TouchableOpacity style={styles.dangerBtn} onPress={() => handleCancelMission(m.id)}>
                    <Text style={styles.dangerText}>Annuler</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )
        ) : (
          users.length === 0 ? (
            <Text style={styles.empty}>Aucun utilisateur</Text>
          ) : (
            (users as any[]).map((u: any) => (
              <View key={u.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{u.firstName} {u.lastName}</Text>
                  <Text style={[styles.badge, { color: u.role === 'admin' ? '#8B5CF6' : colors.primary }]}>
                    {u.role}
                  </Text>
                </View>
                <Text style={styles.cardSub}>{u.email}</Text>
                {!u.isActive && <Text style={{ color: colors.danger, fontSize: 12 }}>Compte suspendu</Text>}
                {u.role !== 'admin' && u.isActive && (
                  <TouchableOpacity style={styles.dangerBtn} onPress={() => handleSuspendUser(u.id, u.firstName)}>
                    <Text style={styles.dangerText}>Suspendre</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, padding: 20, paddingTop: 55,
  },
  headerTitle: { color: colors.white, fontSize: 22, fontWeight: '900' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12,
  },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: colors.white, borderRadius: 12,
    padding: 14, borderTopWidth: 3, alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  tabs: { flexDirection: 'row', margin: 12, backgroundColor: colors.white, borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: colors.white },
  card: {
    backgroundColor: colors.white, marginHorizontal: 12, marginBottom: 10,
    borderRadius: 14, padding: 14,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  badge: { fontSize: 12, fontWeight: '700' },
  cardSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  dangerBtn: {
    marginTop: 10, borderWidth: 1, borderColor: colors.danger,
    borderRadius: 8, padding: 8, alignItems: 'center',
  },
  dangerText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
