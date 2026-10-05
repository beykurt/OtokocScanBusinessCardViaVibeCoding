import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { BusinessCard, emptyCard } from '../types';

// Google Gemini API (ücretsiz katman). Anahtar .env.local dosyasından okunur.
// Canlı ortamda bu çağrı bir .NET backend servisi üzerinden yapılmalıdır.
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const isDemoMode = !apiKey;

// Ana model yoğunsa veya kota dolduysa daha hafif modelle tekrar denenir
const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];

const fieldNames = Object.keys(emptyCard) as (keyof BusinessCard)[];

const cardSchema = {
  type: 'OBJECT',
  properties: Object.fromEntries(fieldNames.map((name) => [name, { type: 'STRING' }])),
  required: fieldNames,
  propertyOrdering: fieldNames,
};

const instructions = `Bu fotoğraf bir kartvizittir. Kartvizitteki kişinin bilgilerini çıkar.
Kurallar:
- Metni karttaki gibi yaz, Türkçe karakterleri (ç, ğ, ı, İ, ö, ş, ü) koru.
- Ad ve soyadı ayır: firstName = ad(lar), lastName = soyad. Tamamı büyük harfle yazılmışsa ilk harfi büyük olacak şekilde düzelt (ARSLAN -> Arslan).
- jobTitle = kişinin unvanı, department = birimi/departmanı, company = şirket adı (logo veya unvan satırından).
- Telefonları uluslararası biçimde yaz (ör. +90 532 123 45 67). Cep telefonunu mobilePhone, sabit/iş hattını workPhone alanına koy. Faks numarasını alma.
- Birden fazla e-posta varsa kişiye ait olanı seç (genel info@ adresini değil).
- website alanına alan adını yaz (ör. www.otokoc.com.tr).
- address alanına açık adresi tek satırda yaz.
- Kartta olmayan bilgi için boş metin ("") kullan, tahmin etme.
- Fotoğrafta kartvizit yoksa tüm alanları boş bırak.`;

// Fotoğrafı küçültüp sıkıştırır: daha hızlı yükleme
async function prepareImage(photoUri: string): Promise<string> {
  const context = ImageManipulator.manipulate(photoUri);
  context.resize({ width: 1400 });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ compress: 0.8, format: SaveFormat.JPEG, base64: true });
  if (!result.base64) throw new Error('Fotoğraf işlenemedi.');
  return result.base64;
}

export const demoCard: BusinessCard = {
  firstName: 'Burak',
  lastName: 'Beykurt',
  jobTitle: 'Yazılım Uzmanı',
  company: 'Otokoç Otomotiv',
  department: 'Uzun Dönem Kiralama',
  mobilePhone: '+90 555 010 20 30',
  workPhone: '+90 216 000 00 00',
  email: 'burak.beykurt@ornek.com',
  website: '',
  address: 'Örnek Mahallesi, Demo Sk. No:1, 34000 İstanbul',
};

class GeminiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function callGemini(model: string, base64: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey! },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ inline_data: { mime_type: 'image/jpeg', data: base64 } }, { text: instructions }],
          },
        ],
        generationConfig: { responseMimeType: 'application/json', responseSchema: cardSchema, temperature: 0 },
      }),
    });
  } catch {
    throw new GeminiError(0, 'İnternet bağlantısı kurulamadı.');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new GeminiError(response.status, body?.error?.message ?? `Servis hatası (${response.status}).`);
  }

  const text: string | undefined = body?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? '')
    .join('');
  if (!text) throw new GeminiError(200, 'Kartvizitten bilgi alınamadı.');
  return text;
}

export async function scanBusinessCard(photoUri: string): Promise<BusinessCard> {
  if (isDemoMode) {
    // API anahtarı yoksa arayüzü gösterebilmek için örnek veri döner
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return demoCard;
  }

  const base64 = await prepareImage(photoUri);

  let text = '';
  for (const [index, model] of models.entries()) {
    try {
      text = await callGemini(model, base64);
      break;
    } catch (e) {
      const retryable = e instanceof GeminiError && (e.status === 429 || e.status === 404 || e.status >= 500);
      if (!retryable || index === models.length - 1) throw e;
    }
  }

  const parsed = JSON.parse(text) as Partial<BusinessCard>;
  const card = { ...emptyCard, ...parsed };

  if (fieldNames.every((name) => !card[name].trim())) {
    throw new Error('Fotoğrafta kartvizit bulunamadı. Kartı çerçeveye hizalayıp tekrar çekin.');
  }
  return card;
}

export function describeError(error: unknown): string {
  if (error instanceof GeminiError) {
    if (error.status === 429) return 'Ücretsiz kullanım limiti doldu, biraz sonra tekrar deneyin.';
    // Sunucunun asıl mesajı da gösterilir; sorunun nedenini anlamayı kolaylaştırır
    return error.status ? `Servis hatası (${error.status}): ${error.message}` : error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Beklenmeyen bir hata oluştu.';
}
