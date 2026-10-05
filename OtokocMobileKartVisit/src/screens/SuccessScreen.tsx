import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radius, shadow, spacing } from '../theme';
import { BusinessCard } from '../types';

type Props = {
  card: BusinessCard;
  onScanAnother: () => void;
  onHome: () => void;
};

export function SuccessScreen({ card, onScanAnother, onHome }: Props) {
  const insets = useSafeAreaInsets();
  const name = `${card.firstName} ${card.lastName}`.trim() || card.company;
  const rows = [
    { icon: 'briefcase' as const, value: [card.jobTitle, card.company].filter(Boolean).join(' · ') },
    { icon: 'smartphone' as const, value: card.mobilePhone || card.workPhone },
    { icon: 'mail' as const, value: card.email },
  ].filter((row) => row.value);

  return (
    <View style={styles.screen}>
      <Header title="Kişi Kaydedildi" />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Feather name="check" size={48} color={colors.white} />
        </View>
        <Text style={styles.title}>Rehbere eklendi</Text>
        <Text style={styles.text}>{`${name} artık telefonunuzdaki Kişiler uygulamasında.`}</Text>

        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          {rows.map((row) => (
            <View key={row.icon} style={styles.row}>
              <Feather name={row.icon} size={16} color={colors.primary} />
              <Text style={styles.rowText}>{row.value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PrimaryButton title="Yeni Kartvizit Tara" icon="camera" onPress={onScanAnother} />
        <View style={styles.gap} />
        <PrimaryButton title="Ana Sayfa" icon="home" variant="outline" onPress={onHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  text: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    ...shadow,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  rowText: { marginLeft: spacing.sm, fontSize: 14, color: colors.text, flex: 1 },
  footer: { paddingHorizontal: spacing.md },
  gap: { height: spacing.sm },
});
