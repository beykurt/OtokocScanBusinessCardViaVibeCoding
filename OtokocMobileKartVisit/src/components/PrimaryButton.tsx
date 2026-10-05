import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, icon, variant = 'primary', loading, disabled }: Props) {
  const outline = variant === 'outline';
  const tint = outline ? colors.primary : colors.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.outline : styles.filled,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tint} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={20} color={tint} style={styles.icon} /> : null}
          <Text style={[styles.text, { color: tint }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  filled: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  icon: { marginRight: 8 },
  text: { fontSize: 16, fontWeight: '700' },
});
