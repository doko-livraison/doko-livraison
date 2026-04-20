import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { authAPI } from '../../services/api';
import { colors } from '../../utils/colors';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim());
      Alert.alert(
        'Email envoyé',
        'Si ce compte existe, vous recevrez un code de réinitialisation.',
        [{ text: 'OK', onPress: () => setStep('reset') }],
      );
    } catch {
      setStep('reset');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!token || !password) {
      Alert.alert('Champs requis', 'Renseignez le code et le nouveau mot de passe.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', 'Minimum 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      Alert.alert('Succès', 'Mot de passe réinitialisé.', [
        { text: 'Se connecter', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mot de passe oublié</Text>

      {step === 'request' ? (
        <>
          <Text style={styles.subtitle}>Entrez votre email pour recevoir un code de réinitialisation.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.btn} onPress={handleRequest} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.btnText}>Envoyer le code</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('reset')}>
            <Text style={styles.link}>J'ai déjà un code →</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Entrez le code reçu et votre nouveau mot de passe.</Text>
          <TextInput
            style={styles.input}
            placeholder="Code de réinitialisation"
            placeholderTextColor={colors.textMuted}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.btnText}>Réinitialiser</Text>}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  content: { padding: 28, paddingTop: 70, flexGrow: 1 },
  back: { marginBottom: 20 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '900', color: colors.white, marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 24, lineHeight: 20 },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 14,
    padding: 16, fontSize: 16, backgroundColor: 'rgba(255,255,255,0.1)',
    color: colors.white, marginBottom: 14,
  },
  btn: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 17, alignItems: 'center', marginTop: 4,
  },
  btnText: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  link: { textAlign: 'center', color: colors.accent, marginTop: 16, fontWeight: '600' },
});
