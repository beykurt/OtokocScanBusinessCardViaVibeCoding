import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Props = {
  title: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

// Otokoç Mobil'deki turuncu üst bar
export function Header({ title, onBack, rightIcon, onRightPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Pressable style={styles.side} onPress={onBack} disabled={!onBack} hitSlop={12}>
          {onBack ? <Feather name="chevron-left" size={28} color={colors.white} /> : <Feather name="menu" size={24} color={colors.white} />}
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Pressable style={[styles.side, styles.right]} onPress={onRightPress} disabled={!onRightPress} hitSlop={12}>
          {rightIcon ? <Feather name={rightIcon} size={22} color={colors.white} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.primary },
  bar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  side: { width: 40, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', color: colors.white, fontSize: 18, fontWeight: '700' },
});
