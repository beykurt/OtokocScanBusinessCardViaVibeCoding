import { Contact, requestPermissionsAsync } from 'expo-contacts';
import type { CreateContactRecord } from 'expo-contacts';
import { BusinessCard } from '../types';

export type SaveOutcome = 'saved' | 'cancelled' | 'denied';

// Kartvizit bilgisini Apple Kişiler (Contacts) kaydına dönüştürür
export function toContactRecord(card: BusinessCard): CreateContactRecord {
  const clean = (value: string) => value.trim() || undefined;
  const phones = [
    card.mobilePhone && { label: 'mobile', number: card.mobilePhone.trim() },
    card.workPhone && { label: 'work', number: card.workPhone.trim() },
  ].filter(Boolean) as CreateContactRecord['phones'];

  return {
    givenName: clean(card.firstName),
    familyName: clean(card.lastName),
    jobTitle: clean(card.jobTitle),
    company: clean(card.company),
    department: clean(card.department),
    phones,
    emails: card.email.trim() ? [{ label: 'work', address: card.email.trim() }] : undefined,
    urlAddresses: card.website.trim() ? [{ label: 'work', url: card.website.trim() }] : undefined,
    addresses: card.address.trim() ? [{ label: 'work', street: card.address.trim() }] : undefined,
  };
}

// Rehbere doğrudan kaydeder
export async function saveToContacts(card: BusinessCard): Promise<SaveOutcome> {
  const { granted } = await requestPermissionsAsync();
  if (!granted) return 'denied';
  await Contact.create(toContactRecord(card));
  return 'saved';
}

// iOS'un yerel "Yeni Kişi" formunu doldurulmuş olarak açar; kullanıcı son hali onaylar
export async function openContactForm(card: BusinessCard): Promise<SaveOutcome> {
  const created = await Contact.presentCreateForm(toContactRecord(card));
  return created ? 'saved' : 'cancelled';
}
