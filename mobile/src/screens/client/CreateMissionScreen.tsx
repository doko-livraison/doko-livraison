import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { missionsAPI } from '../../services/api';

const DELIVERY_TYPES = ['colis', 'meubles', 'electromenager', 'materiaux', 'marchandises', 'documents', 'demenagement'];

export default function CreateMissionScreen({ navigation, route }: any) {
  const [form, setForm] = useState({
    deliveryType: route.params?.deliveryType || 'colis',
    pickupAddress: '',
    deliveryAddress: '',
    description: '',
    estimatedWeightKg: '',
    needsHandling: false,
    hasStairs: false,
    noElevator: false,
    fragile: false,
    multipleHelpers: false,
    floorNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.pickupAddress || !form.deliveryAddress) {
      Alert.alert('Erreur', 'Adresses de départ et d\'arrivée obligatoires');
      return;
    }
    setLoading(true);
    try {
      await missionsAPI.create({
        ...form,
        estimatedWeightKg: form.estimatedWeightKg ? parseFloat(form.estimatedWeightKg) : undefined,
        floorNumber: form.floorNumber ? parseInt(form.floorNumber) : undefined,
      });
      Alert.alert('Succès', 'Demande envoyée ! Les transporteurs vont être notifiés.', [
        { text: 'OK', onPress: () => navigation.navigate('Mes missions') },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de créer la mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nouvelle demande</Text>

      <Text style={styles.label}>Type de livraison</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
        {DELIVERY_TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.typeChip, form.deliveryType === t && styles.typeChipActive]}
            onPress={() => update('deliveryType', t)}
          >
            <Text style={[styles.typeText, form.deliveryType === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Adresse de départ *</Text>
      <TextInput style={styles.input} placeholder="Ex: 12 rue de la Paix, Paris" value={form.pickupAddress} onChangeText={v => update('pickupAddress', v)} />

      <Text style={styles.label}>Adresse de livraison *</Text>
      <TextInput style={styles.input} placeholder="Ex: 45 avenue Victor Hugo, Lyon" value={form.deliveryAddress} onChangeText={v => update('deliveryAddress', v)} />

      <Text style={styles.label}>Description (optionnel)</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Décrivez votre besoin..." value={form.description} onChangeText={v => update('description', v)} multiline numberOfLines={3} />

      <Text style={styles.label}>Poids estimé (kg)</Text>
      <TextInput style={styles.input} placeholder="Ex: 50" value={form.estimatedWeightKg} onChangeText={v => update('estimatedWeightKg', v)} keyboardType="numeric" />

      <Text style={styles.sectionTitle}>Contraintes</Text>
      {[
        { key: 'needsHandling', label: 'Manutention nécessaire' },
        { key: 'hasStairs', label: 'Escaliers' },
        { key: 'noElevator', label: 'Pas d\'ascenseur' },
        { key: 'fragile', label: 'Objet fragile' },
        { key: 'multipleHelpers', label: 'Plusieurs intervenants' },
      ].map(({ key, label }) => (
        <View key={key} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{label}</Text>
          <Switch
            value={form[key as keyof typeof form] as boolean}
            onValueChange={v => update(key, v)}
            trackColor={{ true: '#1A3A8C' }}
          />
        </View>
      ))}

      {form.hasStairs && (
        <>
          <Text style={styles.label}>Étage</Text>
          <TextInput style={styles.input} placeholder="Ex: 3" value={form.floorNumber} onChangeText={v => update('floorNumber', v)} keyboardType="numeric" />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Envoyer la demande</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 20, marginBottom: 8 },
  typeRow: { marginBottom: 8 },
  typeChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ddd', marginRight: 8,
  },
  typeChipActive: { borderColor: '#1A3A8C', backgroundColor: '#FFF3EF' },
  typeText: { color: '#666', fontWeight: '500', textTransform: 'capitalize' },
  typeTextActive: { color: '#1A3A8C' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, fontSize: 15, backgroundColor: '#f9f9f9',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  switchLabel: { fontSize: 15, color: '#333' },
  button: {
    backgroundColor: '#1A3A8C', borderRadius: 14,
    padding: 18, alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
