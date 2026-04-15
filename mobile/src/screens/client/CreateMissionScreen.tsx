import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { missionsAPI } from '../../services/api';
import { colors } from '../../utils/colors';

const DELIVERY_TYPES = [
  { key: 'colis', label: 'Colis', icon: '📦' },
  { key: 'meubles', label: 'Meubles', icon: '🛋️' },
  { key: 'electromenager', label: 'Électroménager', icon: '🏠' },
  { key: 'materiaux', label: 'Matériaux', icon: '🧱' },
  { key: 'marchandises', label: 'Marchandises', icon: '🏭' },
  { key: 'documents', label: 'Documents', icon: '📄' },
  { key: 'demenagement', label: 'Déménagement', icon: '🚛' },
];

const WEIGHT_RANGES = [
  'Moins de 20 kg',
  '20 à 100 kg',
  '100 à 500 kg',
  'Plus de 500 kg',
];

export default function CreateMissionScreen({ navigation, route }: any) {
  const initialType = route.params?.deliveryType || '';
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [form, setForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    description: '',
    estimatedWeightKg: '',
    weightRange: '',
    needsHandling: false,
    hasStairs: false,
    noElevator: false,
    fragile: false,
    multipleHelpers: false,
    floorNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleType = (key: string) => {
    setSelectedTypes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Type requis', 'Sélectionnez au moins un type de livraison.');
      return;
    }
    if (!form.pickupAddress || !form.deliveryAddress) {
      Alert.alert('Adresses requises', 'Renseignez les adresses de départ et d\'arrivée.');
      return;
    }
    setLoading(true);
    try {
      await missionsAPI.create({
        deliveryType: selectedTypes[0],
        deliveryTypes: selectedTypes,
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress,
        description: form.description || (form.weightRange ? `Poids : ${form.weightRange}` : ''),
        estimatedWeightKg: form.estimatedWeightKg ? parseFloat(form.estimatedWeightKg) : undefined,
        needsHandling: form.needsHandling,
        hasStairs: form.hasStairs,
        noElevator: form.noElevator,
        fragile: form.fragile,
        multipleHelpers: form.multipleHelpers,
        floorNumber: form.floorNumber ? parseInt(form.floorNumber) : undefined,
      });
      Alert.alert(
        '✅ Demande envoyée !',
        'Votre demande a bien été transmise aux transporteurs disponibles. Vous serez notifié dès qu\'un transporteur accepte.',
        [{ text: 'Voir mes missions', onPress: () => navigation.navigate('Mes missions') }],
      );
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de créer la mission');
    } finally {
      setLoading(false);
    }
  };

  const selectedLabels = selectedTypes
    .map(k => DELIVERY_TYPES.find(t => t.key === k)?.label)
    .filter(Boolean)
    .join(' + ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header avec navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbStep}>Accueil</Text>
          <Text style={styles.breadcrumbSep}> › </Text>
          <Text style={styles.breadcrumbActive}>Nouvelle demande</Text>
        </View>
      </View>

      <Text style={styles.title}>Nouvelle demande</Text>
      <Text style={styles.subtitle}>Renseignez les détails de votre transport</Text>

      {/* Types — sélection multiple */}
      <Text style={styles.label}>
        Type(s) de livraison <Text style={styles.labelHint}>(sélection multiple possible)</Text>
      </Text>
      {selectedTypes.length > 0 && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓ {selectedLabels}</Text>
        </View>
      )}
      <View style={styles.typeGrid}>
        {DELIVERY_TYPES.map(t => {
          const active = selectedTypes.includes(t.key);
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, active && styles.typeChipActive]}
              onPress={() => toggleType(t.key)}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeText, active && styles.typeTextActive]}>{t.label}</Text>
              {active && <Text style={styles.typeCheck}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Adresses */}
      <Text style={styles.label}>Adresse de départ *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 12 rue de la Paix, Cayenne"
        placeholderTextColor={colors.textMuted}
        value={form.pickupAddress}
        onChangeText={v => update('pickupAddress', v)}
      />

      <Text style={styles.label}>Adresse de livraison *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 45 avenue Victor Hugo, Saint-Laurent"
        placeholderTextColor={colors.textMuted}
        value={form.deliveryAddress}
        onChangeText={v => update('deliveryAddress', v)}
      />

      <Text style={styles.label}>Description (optionnel)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Décrivez votre besoin, précisions utiles..."
        placeholderTextColor={colors.textMuted}
        value={form.description}
        onChangeText={v => update('description', v)}
        multiline
        numberOfLines={3}
      />

      {/* Poids */}
      <Text style={styles.label}>Poids estimé (kg)</Text>
      <Text style={styles.labelHint}>Ex : 10 kg, 50 kg, 200 kg</Text>
      <View style={styles.weightRangeRow}>
        {WEIGHT_RANGES.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.weightChip, form.weightRange === r && styles.weightChipActive]}
            onPress={() => update('weightRange', form.weightRange === r ? '' : r)}
          >
            <Text style={[styles.weightChipText, form.weightRange === r && styles.weightChipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Ou saisir un poids exact, ex : 75 kg"
        placeholderTextColor={colors.textMuted}
        value={form.estimatedWeightKg}
        onChangeText={v => update('estimatedWeightKg', v)}
        keyboardType="numeric"
      />

      {/* Contraintes */}
      <Text style={styles.sectionTitle}>Contraintes</Text>
      {[
        { key: 'needsHandling', label: '💪 Manutention nécessaire' },
        { key: 'hasStairs', label: '🪜 Escaliers' },
        { key: 'noElevator', label: '🚫 Pas d\'ascenseur' },
        { key: 'fragile', label: '⚠️ Objet fragile' },
        { key: 'multipleHelpers', label: '👥 Plusieurs intervenants' },
      ].map(({ key, label }) => (
        <View key={key} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{label}</Text>
          <Switch
            value={form[key as keyof typeof form] as boolean}
            onValueChange={v => update(key, v)}
            trackColor={{ true: colors.primary }}
          />
        </View>
      ))}

      {form.hasStairs && (
        <>
          <Text style={styles.label}>Étage</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : 3"
            placeholderTextColor={colors.textMuted}
            value={form.floorNumber}
            onChangeText={v => update('floorNumber', v)}
            keyboardType="numeric"
          />
        </>
      )}

      {/* Bouton envoi */}
      <TouchableOpacity
        style={[styles.button, (selectedTypes.length === 0 || loading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || selectedTypes.length === 0}
      >
        {loading
          ? <ActivityIndicator color={colors.primary} />
          : <Text style={styles.buttonText}>📤 Envoyer la demande</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 40 },

  header: { backgroundColor: colors.primary, padding: 20, paddingTop: 55, paddingBottom: 16 },
  backBtn: { marginBottom: 8 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' },
  breadcrumb: { flexDirection: 'row', alignItems: 'center' },
  breadcrumbStep: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  breadcrumbSep: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  breadcrumbActive: { color: colors.accent, fontSize: 12, fontWeight: '700' },

  title: { fontSize: 24, fontWeight: '900', color: colors.textDark, margin: 20, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginHorizontal: 20, marginBottom: 16 },

  label: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginHorizontal: 20, marginTop: 14, marginBottom: 4 },
  labelHint: { fontSize: 12, color: colors.textMuted, fontWeight: '400', marginHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textDark, margin: 20, marginBottom: 8 },

  selectedBadge: {
    marginHorizontal: 20, marginBottom: 8, backgroundColor: '#E8F0FF',
    borderRadius: 8, padding: 8,
  },
  selectedBadgeText: { color: colors.primary, fontWeight: '700', fontSize: 13 },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 8, marginBottom: 8 },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#ddd', backgroundColor: '#fafafa',
  },
  typeChipActive: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  typeIcon: { fontSize: 16 },
  typeText: { color: '#666', fontWeight: '600', fontSize: 13 },
  typeTextActive: { color: colors.primary },
  typeCheck: { color: colors.primary, fontWeight: '900', fontSize: 13 },

  input: {
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    padding: 14, fontSize: 15, backgroundColor: '#fafafa',
    marginHorizontal: 20, marginBottom: 4,
  },
  textArea: { height: 90, textAlignVertical: 'top' },

  weightRangeRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  weightChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ddd',
  },
  weightChipActive: { borderColor: colors.accent, backgroundColor: '#FFF8E1' },
  weightChipText: { fontSize: 12, color: '#666', fontWeight: '600' },
  weightChipTextActive: { color: '#B8860B', fontWeight: '700' },

  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, marginHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  switchLabel: { fontSize: 15, color: '#333', flex: 1 },

  button: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 18, alignItems: 'center', margin: 20, marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', marginBottom: 10 },
  cancelText: { color: colors.textMuted, fontSize: 14 },
});
