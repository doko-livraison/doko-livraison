import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { missionsAPI } from '../../services/api';
import { colors } from '../../utils/colors';

export default function ProofDeliveryScreen({ route, navigation }: any) {
  const { missionId } = route.params;
  const [photo, setPhoto] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la caméra est nécessaire.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert('Photo requise', 'Veuillez prendre une photo de la livraison.');
      return;
    }
    if (!signed) {
      Alert.alert('Signature requise', 'Le client doit signer avant de valider.');
      return;
    }
    setLoading(true);
    try {
      await missionsAPI.submitProof(missionId, {
        proofPhotoUrl: photo,
        signatureUrl: 'signed',
      });
      Alert.alert('Livraison déposée !', 'Le client va recevoir une notification pour valider.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de déposer la preuve');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Preuve de livraison</Text>
      <Text style={styles.subtitle}>Documentez la livraison pour déclencher le paiement</Text>

      {/* Photo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📸 Photo de livraison</Text>
        {photo ? (
          <View>
            <Image source={{ uri: photo }} style={styles.preview} />
            <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto}>
              <Text style={styles.retakeText}>Reprendre une photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Text style={styles.photoBtnIcon}>📷</Text>
              <Text style={styles.photoBtnText}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.photoBtn, styles.photoBtnSecondary]} onPress={pickFromGallery}>
              <Text style={styles.photoBtnIcon}>🖼️</Text>
              <Text style={styles.photoBtnText}>Depuis la galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Signature */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✍️ Signature du client</Text>
        <TouchableOpacity
          style={[styles.signatureBox, signed && styles.signatureBoxSigned]}
          onPress={() => setSigned(true)}
        >
          {signed ? (
            <Text style={styles.signedText}>✅ Client a signé</Text>
          ) : (
            <Text style={styles.signaturePrompt}>Appuyez ici pour que le client signe sur l'écran</Text>
          )}
        </TouchableOpacity>
        {signed && (
          <TouchableOpacity onPress={() => setSigned(false)}>
            <Text style={styles.resetSign}>Réinitialiser la signature</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Récapitulatif */}
      <View style={styles.checkList}>
        <Text style={[styles.checkItem, photo && styles.checkItemDone]}>
          {photo ? '✅' : '⬜'} Photo prise
        </Text>
        <Text style={[styles.checkItem, signed && styles.checkItemDone]}>
          {signed ? '✅' : '⬜'} Signature obtenue
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, (!photo || !signed) && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading || !photo || !signed}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.submitText}>Confirmer la livraison</Text>
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
  section: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 12 },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1, backgroundColor: colors.primary, borderRadius: 12,
    padding: 16, alignItems: 'center', gap: 8,
  },
  photoBtnSecondary: { backgroundColor: colors.background, borderWidth: 2, borderColor: colors.primary },
  photoBtnIcon: { fontSize: 28 },
  photoBtnText: { color: colors.white, fontWeight: '700', fontSize: 13, textAlign: 'center' },
  preview: { width: '100%', height: 200, borderRadius: 12 },
  retakeBtn: { marginTop: 10, padding: 10, alignItems: 'center' },
  retakeText: { color: colors.primary, fontWeight: '600' },
  signatureBox: {
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: 12, height: 100, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  signatureBoxSigned: { borderColor: colors.success, borderStyle: 'solid', backgroundColor: '#f0fff8' },
  signaturePrompt: { color: colors.textMuted, textAlign: 'center', fontSize: 14 },
  signedText: { fontSize: 16, fontWeight: '700', color: colors.success },
  resetSign: { textAlign: 'center', color: colors.danger, marginTop: 8, fontSize: 13 },
  checkList: { marginBottom: 20, gap: 8 },
  checkItem: { fontSize: 15, color: colors.textMuted },
  checkItemDone: { color: colors.success, fontWeight: '600' },
  submitBtn: {
    backgroundColor: colors.accent, borderRadius: 14,
    padding: 18, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
});
