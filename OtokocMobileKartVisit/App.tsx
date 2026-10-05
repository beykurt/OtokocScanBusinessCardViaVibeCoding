import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelpScreen } from './src/screens/HelpScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { SuccessScreen } from './src/screens/SuccessScreen';
import { demoCard } from './src/services/cardScanner';
import { saveToContacts } from './src/services/contactsService';
import { BusinessCard, ScanResult } from './src/types';

// Uygulama tek bir akıştan oluştuğu için ekranlar basit bir durum değişkeniyle yönetiliyor
type Screen =
  | { name: 'home' }
  | { name: 'help' }
  | { name: 'scan' }
  | { name: 'review'; result: ScanResult }
  | { name: 'success'; card: BusinessCard };

// Yalnızca web önizlemesi: sunum ekran görüntüleri için ?screen=help|review|success|recent ile açılır
function webPreview(): { screen: Screen; recent: BusinessCard[] } {
  const home = { screen: { name: 'home' } as Screen, recent: [] };
  if (Platform.OS !== 'web' || typeof window === 'undefined') return home;
  const name = new URLSearchParams(window.location.search).get('screen');
  const asset = require('./assets/sample-card.png');
  const photoUri: string = typeof asset === 'string' ? asset : (asset.uri ?? asset.default);
  if (name === 'review') return { ...home, screen: { name: 'review', result: { card: demoCard, photoUri } } };
  if (name === 'success') return { ...home, screen: { name: 'success', card: demoCard } };
  if (name === 'help') return { ...home, screen: { name: 'help' } };
  if (name === 'recent') return { ...home, recent: [demoCard] };
  return home;
}

const preview = webPreview();

export default function App() {
  const [screen, setScreen] = useState<Screen>(preview.screen);
  const [recent, setRecent] = useState<BusinessCard[]>(preview.recent);

  const goHome = () => setScreen({ name: 'home' });
  const goScan = () => setScreen({ name: 'scan' });

  async function save(card: BusinessCard) {
    try {
      const outcome = Platform.OS === 'web' ? 'saved' : await saveToContacts(card);
      if (outcome === 'denied') {
        Alert.alert('Rehber izni gerekli', 'Kişi eklemek için Ayarlar > Otokoç Mobile Kart Visit > Kişiler iznini açın.', [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Ayarları Aç', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      setRecent((list) => [card, ...list]);
      setScreen({ name: 'success', card });
    } catch (e) {
      Alert.alert('Kaydedilemedi', e instanceof Error ? e.message : 'Kişi rehbere eklenemedi.');
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen.name === 'home' && <HomeScreen recent={recent} onScan={goScan} onHelp={() => setScreen({ name: 'help' })} />}
      {screen.name === 'help' && <HelpScreen onBack={goHome} />}
      {screen.name === 'scan' && <ScanScreen onBack={goHome} onScanned={(result) => setScreen({ name: 'review', result })} />}
      {screen.name === 'review' && <ReviewScreen result={screen.result} onBack={goHome} onRescan={goScan} onSave={save} />}
      {screen.name === 'success' && <SuccessScreen card={screen.card} onScanAnother={goScan} onHome={goHome} />}
    </SafeAreaProvider>
  );
}
