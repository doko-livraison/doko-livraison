import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../utils/colors';

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
      <Text style={styles.title}>CRÉER UN{'\n'}COMPTE</Text>
      <View style={styles.accentBar} />

      <TextInput style={styles.input} placeholder="Prénom *" placeholderTextColor="rgba(255,255,255,0.4)" value={form.firstName} onChangeText={v => update('firstName', v)} />
      <TextInput style={styles.input} placeholder="Nom *" placeholderTextColor="rgba(255,255,255,0.4)" value={form.lastName} onChangeText={v => update('lastName', v)} />
      <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="rgba(255,255,255,0.4)" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Téléphone" placeholderTextColor="rgba(255,255,255,0.4)" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Mot de passe *" placeholderTextColor="rgba(255,255,255,0.4)" value={form.password} onChangeText={v => update('password', v)} secureTextEntry />

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
  container: { flex: 1, backgroundColor: colors.primary },
  content: { padding: 28, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: colors.white, marginBottom: 8, letterSpacing: 2 },
  accentBar: { height: 4, width: 50, backgroundColor: colors.accent, borderRadius: 2, marginBottom: 24 },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 14,
    padding: 16, fontSize: 15, marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.1)', color: colors.white,
  },
  label: { fontSize: 15, fontWeight: '700', color: colors.accent, marginBottom: 8, marginTop: 4, letterSpacing: 1 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1, padding: 14, borderRadius: 14, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  roleBtnActive: { borderColor: colors.accent, backgroundColor: 'rgba(245,194,0,0.15)' },
  roleText: { fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  roleTextActive: { color: colors.accent },
  button: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 17, alignItems: 'center', marginBottom: 16, marginTop: 4,
  },
  buttonText: { color: colors.primary, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  link: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14 },
});
