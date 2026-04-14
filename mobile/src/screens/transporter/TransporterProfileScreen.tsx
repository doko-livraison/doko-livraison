import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { transportersAPI } from '../../services/api';

export default function TransporterProfileScreen() {
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

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.role}>Transporteur</Text>
      </View>

      {profile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon profil</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Véhicule</Text>
            <Text style={styles.infoValue}>{profile.vehicleType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Charge max</Text>
            <Text style={styles.infoValue}>{profile.maxLoadKg} kg</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Missions</Text>
            <Text style={styles.infoValue}>{profile.totalMissions}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Note</Text>
            <Text style={styles.infoValue}>⭐ {profile.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.infoLabel}>Disponible</Text>
            <Switch value={profile.isAvailable} onValueChange={toggleAvailability} trackColor={{ true: '#10B981' }} />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF6B35', padding: 32, paddingTop: 60, alignItems: 'center' },
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
});
