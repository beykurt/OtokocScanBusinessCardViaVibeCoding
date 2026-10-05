import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { isDemoMode } from '../services/cardScanner';
import { colors, radius, shadow, spacing } from '../theme';
import { BusinessCard, ScanResult } from '../types';

type Props = {
  result: ScanResult;
  onBack: () => void;
  onRescan: () => void;
  onSave?: (card: BusinessCard) => Promise<void>;
};

type Field = {
  key: keyof BusinessCard;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  keyboard?: KeyboardTypeOptions;
};

const groups: { title: string; fields: Field[] }[] = [
  {
    title: 'Kişi',
    fields: [
      { key: 'firstName', label: 'Ad', icon: 'user' },
      { key: 'lastName', label: 'Soyad', icon: 'user' },
      { key: 'jobTitle', label: 'Unvan', icon: 'award' },
    ],
  },
  {
    title: 'İletişim',
    fields: [
      { key: 'mobilePhone', label: 'Cep Telefonu', icon: 'smartphone', keyboard: 'phone-pad' },
      { key: 'workPhone', label: 'İş Telefonu', icon: 'phone', keyboard: 'phone-pad' },
      { key: 'email', label: 'E-posta', icon: 'mail', keyboard: 'email-address' },
      { key: 'website', label: 'Web Sitesi', icon: 'globe', keyboard: 'url' },
    ],
  },
  {
    title: 'Şirket',
    fields: [
      { key: 'company', label: 'Şirket', icon: 'briefcase' },
      { key: 'department', label: 'Departman', icon: 'layers' },
      { key: 'address', label: 'Adres', icon: 'map-pin' },
    ],
  },
];

export function ReviewScreen({ result, onBack, onRescan, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [card, setCard] = useState<BusinessCard>(result.card);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof BusinessCard, value: string) => setCard((c) => ({ ...c, [key]: value }));
  const hasName = Boolean(card.firstName.trim() || card.lastName.trim() || card.company.trim());

  async function save() {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(card);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Header title="Bilgileri Kontrol Et" onBack={onBack} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image source={{ uri: result.photoUri }} style={styles.photo} resizeMode="cover" />
          {isDemoMode ? (
            <View style={[styles.notice, styles.demoNotice]}>
              <Feather name="info" size={18} color={colors.primaryDark} />
              <Text style={styles.noticeText}>Demo modu: kartvizit okunmadı, örnek veri gösteriliyor.</Text>
            </View>
          ) : (
            <View style={styles.notice}>
              <Feather name="check-circle" size={18} color={colors.success} />
              <Text style={styles.noticeText}>Kartvizit okundu. Bilgileri kontrol edip gerekirse düzeltin.</Text>
            </View>
          )}

          {groups.map((group) => (
            <View key={group.title} style={styles.card}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.fields.map((field) => (
                <View key={field.key} style={styles.field}>
                  <Feather name={field.icon} size={18} color={colors.primary} style={styles.fieldIcon} />
                  <View style={styles.flex}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                      value={card[field.key]}
                      onChangeText={(v) => update(field.key, v)}
                      placeholder="-"
                      placeholderTextColor={colors.textMuted}
                      keyboardType={field.keyboard}
                      autoCapitalize={field.keyboard ? 'none' : 'words'}
                      autoCorrect={false}
                      multiline={field.key === 'address'}
                      style={styles.input}
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        {onSave ? (
          <PrimaryButton title="Rehbere Kaydet" icon="user-plus" onPress={save} loading={saving} disabled={!hasName} />
        ) : null}
        <View style={styles.gap} />
        <PrimaryButton title="Yeniden Çek" icon="camera" variant="outline" onPress={onRescan} disabled={saving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  photo: { width: '100%', aspectRatio: 1.75, borderRadius: radius.card, backgroundColor: colors.border },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    borderRadius: radius.input,
    padding: spacing.sm + 4,
    marginVertical: spacing.md,
  },
  demoNotice: { backgroundColor: colors.primarySoft },
  noticeText: { flex: 1, marginLeft: spacing.sm, color: colors.text, fontSize: 13 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  groupTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  fieldIcon: { width: 28 },
  label: { fontSize: 12, color: colors.textMuted },
  input: { fontSize: 16, color: colors.text, paddingVertical: 4, paddingHorizontal: 0 },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 4,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  gap: { height: spacing.sm },
});
