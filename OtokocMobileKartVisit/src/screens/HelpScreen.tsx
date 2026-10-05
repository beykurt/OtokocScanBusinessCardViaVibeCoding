import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from '../components/Header';
import { ListCard } from '../components/ListCard';
import { colors, spacing } from '../theme';

type Props = { onBack: () => void };

export function HelpScreen({ onBack }: Props) {
  return (
    <View style={styles.screen}>
      <Header title="Nasıl Çalışır?" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>Üç adımda kartvizit rehberinizde.</Text>
        <ListCard icon="camera" title="1. Kartviziti çekin" subtitle="Kartı turuncu çerçeveye hizalayıp deklanşöre basın." />
        <ListCard icon="cpu" title="2. Bilgiler okunur" subtitle="Yapay zekâ ad, unvan, şirket, telefon, e-posta ve adresi ayırır." />
        <ListCard icon="edit-3" title="3. Kontrol edin" subtitle="Okunan bilgileri gözden geçirip gerekirse düzeltin." />
        <ListCard icon="user-plus" title="4. Rehbere kaydedin" subtitle="Tek dokunuşla kişi Apple Kişiler uygulamasına eklenir." />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  lead: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
