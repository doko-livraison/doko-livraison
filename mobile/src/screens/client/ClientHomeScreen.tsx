import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
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

export default function ClientHomeScreen({ navigation }: any) {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.firstName} 👋</Text>
        <Text style={styles.subtitle}>Que souhaitez-vous livrer ?</Text>
      </View>

      <View style={styles.grid}>
        {DELIVERY_TYPES.map(type => (
          <TouchableOpacity
            key={type.key}
            style={styles.card}
            onPress={() => navigation.navigate('CreateMission', { deliveryType: type.key })}
          >
            <Text style={styles.cardIcon}>{type.icon}</Text>
            <Text style={styles.cardLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate('CreateMission', {})}
      >
        <Text style={styles.ctaText}>+ Nouvelle demande</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 24, paddingTop: 60 },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.white },
  subtitle: { fontSize: 15, color: colors.accent, marginTop: 4, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  card: {
    width: '47%', backgroundColor: colors.white, borderRadius: 16,
    padding: 20, alignItems: 'center', gap: 8,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
    borderBottomWidth: 3, borderBottomColor: colors.accent,
  },
  cardIcon: { fontSize: 32 },
  cardLabel: { fontSize: 14, fontWeight: '700', color: colors.textDark, textAlign: 'center' },
  ctaButton: {
    margin: 16, backgroundColor: colors.accent, borderRadius: 16,
    padding: 18, alignItems: 'center',
  },
  ctaText: { color: colors.primary, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});
