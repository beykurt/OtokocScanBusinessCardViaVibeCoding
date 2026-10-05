import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

// Otokoç Mobil ana sayfasındaki "ikon + başlık + ok" kartı
export function ListCard({ icon, title, subtitle, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconBox}>
        <Feather name={icon} size={30} color={colors.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {onPress ? <Feather name="arrow-right" size={24} color={colors.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  pressed: { opacity: 0.7 },
  iconBox: { width: 52, alignItems: 'center', marginRight: spacing.sm + 4 },
  texts: { flex: 1, marginRight: spacing.sm },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: colors.text, lineHeight: 18 },
});
