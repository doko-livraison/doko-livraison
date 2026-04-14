import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { missionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MissionDetailScreen({ route, navigation }: any) {
  const { mission } = route.params;
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  const handleValidate = async () => {
    try {
      await missionsAPI.validate(mission.id);
      Alert.alert('Mission validée !', 'Le paiement final va être déclenché.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message);
    }
  };

  const handleCancel = () => {
    Alert.alert('Annuler ?', 'Confirmer l\'annulation de cette mission ?', [
      { text: 'Non' },
      {
        text: 'Oui, annuler', style: 'destructive', onPress: async () => {
          try {
            await missionsAPI.cancel(mission.id);
            navigation.goBack();
          } catch {}
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{mission.deliveryType}</Text>

      <View style={styles.card}>
        <Row label="Statut" value={mission.status} />
        <Row label="Départ" value={mission.pickupAddress} />
        <Row label="Arrivée" value={mission.deliveryAddress} />
        {mission.estimatedWeightKg && <Row label="Poids estimé" value={`${mission.estimatedWeightKg} kg`} />}
        {mission.description && <Row label="Description" value={mission.description} />}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contraintes</Text>
        {mission.needsHandling && <Text style={styles.constraint}>✓ Manutention</Text>}
        {mission.hasStairs && <Text style={styles.constraint}>✓ Escaliers (étage {mission.floorNumber})</Text>}
        {mission.noElevator && <Text style={styles.constraint}>✓ Pas d'ascenseur</Text>}
        {mission.fragile && <Text style={styles.constraint}>✓ Objet fragile</Text>}
        {mission.multipleHelpers && <Text style={styles.constraint}>✓ Plusieurs intervenants</Text>}
      </View>

      {mission.transporter && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transporteur</Text>
          <Row label="Nom" value={`${mission.transporter.user?.firstName} ${mission.transporter.user?.lastName}`} />
          <Row label="Véhicule" value={mission.transporter.vehicleType} />
          <Row label="Note" value={`⭐ ${mission.transporter.rating?.toFixed(1)}`} />
        </View>
      )}

      {isClient && mission.status === 'delivered' && (
        <TouchableOpacity style={styles.validateBtn} onPress={handleValidate}>
          <Text style={styles.validateText}>✓ Valider la livraison</Text>
        </TouchableOpacity>
      )}

      {mission.status === 'pending' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Annuler la mission</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: '#FF6B35', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20, textTransform: 'capitalize' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { fontSize: 14, color: '#888', flex: 1 },
  rowValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500', flex: 2, textAlign: 'right' },
  constraint: { fontSize: 14, color: '#555', paddingVertical: 4 },
  validateBtn: { backgroundColor: '#10B981', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  validateText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444', marginTop: 8 },
  cancelText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
});
