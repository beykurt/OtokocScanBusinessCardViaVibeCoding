import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from '../components/Header';
import { ListCard } from '../components/ListCard';
import { OtokocLogo } from '../components/OtokocLogo';
import { isDemoMode } from '../services/cardScanner';
import { colors, radius, shadow, spacing } from '../theme';
import { BusinessCard } from '../types';

type Props = {
  recent: BusinessCard[];
  onScan: () => void;
  onHelp: () => void;
};

export function HomeScreen({ recent, onScan, onHelp }: Props) {
  return (
    <View style={styles.screen}>
      <Header title="Otokoç Mobile Kart Visit" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <OtokocLogo width={96} />
          <View style={styles.accent} />
          <Text style={styles.bannerTitle}>Kartvizitleri saniyeler içinde rehberinize ekleyin</Text>
          <Text style={styles.bannerText}>Kartı kameraya gösterin, bilgiler otomatik okunsun ve Kişiler uygulamasına kaydedilsin.</Text>
        </View>

        {isDemoMode ? (
          <View style={styles.demo}>
            <Feather name="info" size={16} color={colors.primaryDark} />
            <Text style={styles.demoText}>Demo modu: API anahtarı tanımlı değil, örnek veri kullanılıyor.</Text>
          </View>
        ) : null}

        <ListCard icon="camera" title="Kartvizit Tara" subtitle="Kamerayla kartviziti okutmak için tıklayınız" onPress={onScan} />
        <ListCard icon="help-circle" title="Nasıl Çalışır?" subtitle="Uygulamanın adımlarını görmek için tıklayınız" onPress={onHelp} />

        <Text style={styles.section}>Son Eklenenler</Text>
        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="users" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>Henüz kişi eklenmedi.</Text>
          </View>
        ) : (
          recent.map((card, index) => (
            <View key={index} style={styles.person}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(card.firstName[0] ?? '') + (card.lastName[0] ?? '')}</Text>
              </View>
              <View style={styles.personTexts}>
                <Text style={styles.personName}>{`${card.firstName} ${card.lastName}`.trim()}</Text>
                <Text style={styles.personInfo} numberOfLines={1}>
                  {[card.jobTitle, card.company].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Feather name="check-circle" size={20} color={colors.success} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  banner: {
    backgroundColor: colors.dark,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  accent: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: spacing.xs },
  bannerTitle: { color: colors.white, fontSize: 20, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.sm },
  bannerText: { color: '#D9D9D7', fontSize: 14, lineHeight: 20 },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.input,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
  },
  demoText: { flex: 1, marginLeft: spacing.sm, color: colors.primaryDark, fontSize: 13 },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm + 4 },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { marginTop: spacing.sm, color: colors.textMuted, fontSize: 14 },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  personTexts: { flex: 1 },
  personName: { fontSize: 15, fontWeight: '700', color: colors.text },
  personInfo: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
