import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { transportersAPI } from '../../services/api';

export default function TransporterProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transportersAPI.getMe()
      .then(res => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async () => {
    try {
      const updated = await transportersAPI.updateAvailability(!profile.isAvailable);
      setProfile(updated.data);
    } catch {}
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#1A3A8C" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.role}>Transporteur</Text>
      </View>

      {!profile && (
        <TouchableOpacity
          style={styles.setupBtn}
          onPress={() => navigation.navigate('TransporterProfileSetup')}
        >
          <Text style={styles.setupText}>⚙️ Configurer mon profil transporteur</Text>
        </TouchableOpacity>
      )}

      {profile && (
        <>
          {/* Statut profil */}
          <View style={[styles.statusBanner, profile.isVerified ? styles.statusVerified : styles.statusPending]}>
            <Text style={styles.statusText}>
              {profile.isVerified ? '✅ Profil vérifié — Vous pouvez recevoir des missions' : '⏳ Profil en attente de vérification'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mon profil transporteur</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Véhicule</Text>
              <Text style={styles.infoValue}>{profile.vehicleType}</Text>
            </View>
            {profile.licensePlate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Immatriculation</Text>
                <Text style={styles.infoValue}>{profile.licensePlate}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Charge max</Text>
              <Text style={styles.infoValue}>{profile.maxLoadKg} kg</Text>
            </View>
            {profile.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Missions effectuées</Text>
              <Text style={styles.infoValue}>{profile.totalMissions}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Note</Text>
              <Text style={styles.infoValue}>⭐ {profile.rating?.toFixed(1) || '—'}</Text>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.infoLabel}>🟢 Disponible pour des missions</Text>
              <Switch value={profile.isAvailable} onValueChange={toggleAvailability} trackColor={{ true: '#10B981' }} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.setupBtn}
            onPress={() => navigation.navigate('TransporterProfileSetup')}
          >
            <Text style={styles.setupText}>✏️ Modifier mon profil</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1A3A8C', padding: 32, paddingTop: 60, alignItems: 'center' },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 14, color: '#FFD4C2', marginTop: 4 },
  section: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  infoLabel: { fontSize: 15, color: '#666' },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  logoutBtn: { margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  setupBtn: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#F5C200', borderRadius: 14, padding: 16, alignItems: 'center' },
  setupText: { color: '#1A3A8C', fontWeight: '700', fontSize: 15 },
  statusBanner: { margin: 16, borderRadius: 12, padding: 12 },
  statusVerified: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
