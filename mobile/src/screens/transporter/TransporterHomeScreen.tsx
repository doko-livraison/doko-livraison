import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl, Switch,
} from 'react-native';
import { missionsAPI, transportersAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../utils/colors';

const TYPE_ICONS: Record<string, string> = {
  colis: '📦', meubles: '🛋️', electromenager: '🏠',
  materiaux: '🧱', marchandises: '🏭', documents: '📄', demenagement: '🚛',
};

export default function TransporterHomeScreen({ navigation }: any) {
  const { user } = useAuth();
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
      Alert.alert('✅ Mission acceptée !', 'La mission est dans "Mes livraisons". Le client est notifié.', [
        { text: 'Voir mes livraisons', onPress: () => navigation.navigate('Mes livraisons') },
      ]);
      load();
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible d\'accepter');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={styles.container}>
      {/* Header Doko */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Bonjour, {user?.firstName} 👋</Text>
            <Text style={styles.headerSub}>Tableau de bord transporteur</Text>
          </View>
          <View style={styles.availBadge}>
            <View style={[styles.availDot, { backgroundColor: available ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.availText, { color: available ? '#10B981' : '#EF4444' }]}>
              {available ? 'Disponible' : 'Indisponible'}
            </Text>
          </View>
        </View>

        {/* Toggle disponibilité */}
        <View style={styles.availRow}>
          <Text style={styles.availLabel}>
            {available ? '🟢 Je suis disponible pour des missions' : '🔴 Je ne reçois pas de missions'}
          </Text>
          <Switch
            value={available}
            onValueChange={toggleAvailability}
            trackColor={{ true: '#10B981', false: '#ccc' }}
            thumbColor={available ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{missions.length}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={[styles.statBox, { borderColor: colors.accent }]}>
          <Text style={[styles.statNum, { color: '#B8860B' }]}>🚛</Text>
          <Text style={styles.statLabel}>Mes missions</Text>
        </View>
        <TouchableOpacity
          style={[styles.statBox, { borderColor: '#8B5CF6' }]}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.statNum}>👤</Text>
          <Text style={styles.statLabel}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Liste missions */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>📋 Missions disponibles</Text>
        <TouchableOpacity onPress={load}>
          <Text style={styles.refreshText}>↻ Actualiser</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={missions}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🕐</Text>
            <Text style={styles.emptyTitle}>Aucune mission disponible</Text>
            <Text style={styles.emptyText}>
              {available
                ? 'Tirez vers le bas pour actualiser. Les nouvelles demandes apparaissent ici.'
                : 'Activez votre disponibilité pour recevoir des missions.'}
            </Text>
          </View>
        }
        renderItem={({ item }: any) => {
          const icon = TYPE_ICONS[item.deliveryType] || '📦';
          const types = item.deliveryTypes?.length > 1
            ? item.deliveryTypes.map((t: string) => TYPE_ICONS[t] || '📦').join(' ')
            : icon;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{types}</Text>
                <Text style={styles.cardType}>
                  {item.deliveryTypes?.join(' + ') || item.deliveryType}
                </Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NOUVEAU</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.addressRow}>
                  <Text style={styles.addressIcon}>📍</Text>
                  <Text style={styles.addressText}>{item.pickupAddress}</Text>
                </View>
                <View style={styles.addressArrow}><Text style={styles.arrowText}>↓</Text></View>
                <View style={styles.addressRow}>
                  <Text style={styles.addressIcon}>🏁</Text>
                  <Text style={styles.addressText}>{item.deliveryAddress}</Text>
                </View>
              </View>

              <View style={styles.cardTags}>
                {item.estimatedWeightKg && (
                  <View style={styles.tag}><Text style={styles.tagText}>⚖️ {item.estimatedWeightKg} kg</Text></View>
                )}
                {item.needsHandling && <View style={styles.tag}><Text style={styles.tagText}>💪 Manutention</Text></View>}
                {item.fragile && <View style={styles.tag}><Text style={styles.tagText}>⚠️ Fragile</Text></View>}
                {item.hasStairs && <View style={styles.tag}><Text style={styles.tagText}>🪜 Escaliers</Text></View>}
                {item.multipleHelpers && <View style={styles.tag}><Text style={styles.tagText}>👥 Plusieurs intervenants</Text></View>}
              </View>

              {item.description ? (
                <Text style={styles.desc}>💬 {item.description}</Text>
              ) : null}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => acceptMission(item.id)}
                >
                  <Text style={styles.acceptText}>✅ Accepter la mission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => navigation.navigate('MissionDetail', { mission: item })}
                >
                  <Text style={styles.detailText}>Détails</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.primary, padding: 20, paddingTop: 55, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerGreeting: { fontSize: 20, fontWeight: '900', color: colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  availBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { fontSize: 12, fontWeight: '700' },
  availRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 },
  availLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', flex: 1 },

  statsRow: { flexDirection: 'row', gap: 10, padding: 14 },
  statBox: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  statNum: { fontSize: 22, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 8 },
  listTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  refreshText: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  card: { backgroundColor: colors.white, marginHorizontal: 12, marginBottom: 12, borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardIcon: { fontSize: 22 },
  cardType: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.textDark, textTransform: 'capitalize' },
  newBadge: { backgroundColor: '#DCFCE7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  newBadgeText: { fontSize: 10, fontWeight: '800', color: '#16A34A' },

  cardBody: { backgroundColor: colors.background, borderRadius: 10, padding: 12, marginBottom: 10 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressIcon: { fontSize: 14 },
  addressText: { fontSize: 13, color: colors.textDark, flex: 1 },
  addressArrow: { alignItems: 'center', marginVertical: 4 },
  arrowText: { color: colors.textMuted, fontSize: 16 },

  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  desc: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginBottom: 10 },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  acceptBtn: { flex: 2, backgroundColor: colors.primary, borderRadius: 10, padding: 13, alignItems: 'center' },
  acceptText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  detailBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 13, alignItems: 'center' },
  detailText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },

  emptyBox: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.textDark, marginBottom: 8 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
