import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { transporterAPI } from '../../services/api';
import { colors } from '../../utils/colors';

const VEHICLE_TYPES = ['moto', 'voiture', 'camionnette', 'camion', 'plateau'];

export default function TransporterProfileSetupScreen({ navigation }: any) {
  const [vehicleType, setVehicleType] = useState('camionnette');
  const [licensePlate, setLicensePlate] = useState('');
  const [maxWeightKg, setMaxWeightKg] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!licensePlate || !maxWeightKg || !phone) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await transporterAPI.createProfile({
        vehicleType,
        licensePlate,
        maxWeightKg: parseFloat(maxWeightKg),
        phone,
      });
      Alert.alert('Profil créé !', 'Votre profil transporteur est actif.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de créer le profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profil Transporteur</Text>
      <Text style={styles.subtitle}>Complétez votre profil pour recevoir des missions</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Type de véhicule</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={vehicleType}
            onValueChange={(v) => setVehicleType(v)}
            style={styles.picker}
          >
            {VEHICLE_TYPES.map((v) => (
              <Picker.Item key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} value={v} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Immatriculation</Text>
        <TextInput
          style={styles.input}
          placeholder="AA-123-BB"
          placeholderTextColor={colors.textMuted}
          value={licensePlate}
          onChangeText={setLicensePlate}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Charge max (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="1000"
          placeholderTextColor={colors.textMuted}
          value={maxWeightKg}
          onChangeText={setMaxWeightKg}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="+594 6 94 XX XX XX"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.btnText}>Enregistrer le profil</Text>
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
  section: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textDark, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    padding: 14, fontSize: 15, color: colors.textDark,
  },
  pickerWrapper: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, overflow: 'hidden',
  },
  picker: { color: colors.textDark },
  btn: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 18, alignItems: 'center',
  },
  btnText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
});
