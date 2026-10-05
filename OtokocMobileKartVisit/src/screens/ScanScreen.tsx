import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { describeError, scanBusinessCard } from '../services/cardScanner';
import { colors, radius, spacing } from '../theme';
import { ScanResult } from '../types';

type Props = {
  onBack: () => void;
  onScanned: (result: ScanResult) => void;
};

export function ScanScreen({ onBack, onScanned }: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function capture() {
    try {
      setError(null);
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.9, shutterSound: false });
      if (!photo) return;
      setPhotoUri(photo.uri);
      const card = await scanBusinessCard(photo.uri);
      onScanned({ card, photoUri: photo.uri });
    } catch (e) {
      setError(describeError(e));
    }
  }

  function retry() {
    setPhotoUri(null);
    setError(null);
  }

  if (!permission) {
    return <View style={styles.dark} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.screen}>
        <Header title="Kartvizit Tara" onBack={onBack} />
        <View style={styles.permission}>
          <Feather name="camera-off" size={48} color={colors.primary} />
          <Text style={styles.permissionTitle}>Kamera izni gerekli</Text>
          <Text style={styles.permissionText}>Kartviziti okuyabilmek için kameranıza erişmemiz gerekiyor.</Text>
          <PrimaryButton title="İzin Ver" icon="check" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  // Fotoğraf çekildi: okuma sürüyor veya hata oluştu
  if (photoUri) {
    return (
      <View style={styles.screen}>
        <Header title="Kartvizit Okunuyor" onBack={onBack} />
        <View style={styles.processing}>
          <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
          {error ? (
            <>
              <Feather name="alert-circle" size={40} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
              <PrimaryButton title="Tekrar Çek" icon="refresh-cw" onPress={retry} />
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.processingTitle}>Kartvizit okunuyor…</Text>
              <Text style={styles.processingText}>Yapay zekâ ad, unvan, telefon ve e-posta bilgilerini çıkarıyor.</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.dark}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />
      <View style={[styles.overlay, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.topBar}>
          <Pressable style={styles.roundButton} onPress={onBack} hitSlop={8}>
            <Feather name="x" size={24} color={colors.white} />
          </Pressable>
          <Text style={styles.topTitle}>Kartvizit Tara</Text>
          <Pressable style={styles.roundButton} onPress={() => setTorch((t) => !t)} hitSlop={8}>
            <Feather name={torch ? 'zap' : 'zap-off'} size={22} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.frameArea}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
          <Text style={styles.hint}>Kartviziti çerçevenin içine hizalayın</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.shutter, pressed && { opacity: 0.7 }]} onPress={capture}>
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

const CORNER = 28;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  dark: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: spacing.md },
  topTitle: { color: colors.white, fontSize: 18, fontWeight: '700' },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameArea: { width: '100%', alignItems: 'center' },
  frame: { width: '86%', aspectRatio: 1.75, borderRadius: radius.card },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: colors.primary },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radius.card },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radius.card },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radius.card },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radius.card },
  hint: {
    marginTop: spacing.md,
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.primary },
  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  permissionText: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  processing: { flex: 1, alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  preview: { width: '100%', aspectRatio: 1.75, borderRadius: radius.card, marginBottom: spacing.md, backgroundColor: colors.border },
  processingTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  processingText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  errorText: { fontSize: 15, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
});
