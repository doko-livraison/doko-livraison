import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF6B35', padding: 24, paddingTop: 60 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#FFD4C2', marginTop: 4 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12,
  },
  card: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16,
    padding: 20, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardIcon: { fontSize: 32 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  ctaButton: {
    margin: 16, backgroundColor: '#FF6B35', borderRadius: 16,
    padding: 18, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
