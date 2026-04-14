import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', role: 'client',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    const { firstName, lastName, email, password } = form;
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Inscription impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput style={styles.input} placeholder="Prénom *" value={form.firstName} onChangeText={v => update('firstName', v)} />
      <TextInput style={styles.input} placeholder="Nom *" value={form.lastName} onChangeText={v => update('lastName', v)} />
      <TextInput style={styles.input} placeholder="Email *" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Téléphone" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Mot de passe *" value={form.password} onChangeText={v => update('password', v)} secureTextEntry />

      <Text style={styles.label}>Je suis :</Text>
      <View style={styles.roleRow}>
        {['client', 'transporter'].map(role => (
          <TouchableOpacity
            key={role}
            style={[styles.roleBtn, form.role === role && styles.roleBtnActive]}
            onPress={() => update('role', role)}
          >
            <Text style={[styles.roleText, form.role === role && styles.roleTextActive]}>
              {role === 'client' ? 'Client' : 'Transporteur'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 16, fontSize: 16, marginBottom: 12, backgroundColor: '#f9f9f9',
  },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 4 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1, padding: 14, borderRadius: 12, borderWidth: 2,
    borderColor: '#ddd', alignItems: 'center',
  },
  roleBtnActive: { borderColor: '#FF6B35', backgroundColor: '#FFF3EF' },
  roleText: { fontSize: 15, color: '#666', fontWeight: '600' },
  roleTextActive: { color: '#FF6B35' },
  button: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#FF6B35' },
});
