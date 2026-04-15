import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, Alert, ActivityIndicator, Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../utils/colors';

const logoImage = require('../../../assets/logo.png');

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoMain}>DOKO</Text>
          <View style={styles.logoAccentBar} />
          <Text style={styles.logoSub}>LIVRAISON</Text>
        </View>
        <Text style={styles.tagline}>Rapide · Fiable · Sécurisé</Text>
        <Text style={styles.region}>Guyane</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Pas encore de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLogo}>
        <Image
          source={logoImage}
          style={styles.bottomLogoImage}
          resizeMode="contain"
          onError={() => {}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.primary },
  container: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 12 },
  logoMain: { fontSize: 56, fontWeight: '900', color: colors.white, letterSpacing: 6 },
  logoAccentBar: { height: 4, width: 80, backgroundColor: colors.accent, borderRadius: 2, marginVertical: 4 },
  logoSub: { fontSize: 20, fontWeight: '700', color: colors.accent, letterSpacing: 8 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  form: { gap: 14 },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 14,
    padding: 16, fontSize: 16, backgroundColor: 'rgba(255,255,255,0.1)',
    color: colors.white,
  },
  button: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 17, alignItems: 'center', marginTop: 4,
  },
  buttonText: { color: colors.primary, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  link: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 14 },
  linkBold: { color: colors.accent, fontWeight: '700' },
  region: { fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 4, marginTop: 6, textTransform: 'uppercase' },
  bottomLogo: { alignItems: 'center', marginTop: 24 },
  bottomLogoImage: { width: 120, height: 120 },
});
