# Otokoç Mobile Kart Visit

Kartvizitin fotoğrafını çekip bilgileri yapay zekâ ile okuyan ve kişiyi telefon rehberine (Apple Kişiler) kaydeden mobil uygulama. Mobil geliştirme deneyimi olmayan bir .NET geliştiricisinin, Claude Code ile "vibe coding" yaparak sıfırdan geliştirdiği bir demo.

## Akış

1. Ana sayfada **Kartvizit Tara**'ya dokunulur.
2. Kart turuncu çerçeveye hizalanıp fotoğrafı çekilir.
3. Google Gemini; ad, soyad, unvan, şirket, departman, telefonlar, e-posta, web ve adresi ayırır.
4. Kullanıcı bilgileri kontrol edip düzeltir.
5. **Rehbere Kaydet** ile kişi Kişiler uygulamasına eklenir.

## Teknolojiler

| Konu | Seçim |
| --- | --- |
| Uygulama | React Native + Expo (SDK 57), TypeScript |
| Kamera / Rehber | expo-camera, expo-contacts |
| Kartvizit okuma | Google Gemini API (ücretsiz katman), yedek model ile |
| Dağıtım | EAS Update + Expo Go (Mac ve Apple geliştirici hesabı gerekmeden) |

## Klasörler

- `OtokocMobileKartVisit/` – uygulamanın kaynak kodu
  - `src/screens` – ekranlar, `src/services` – Gemini ve rehber servisleri, `src/theme.ts` – Otokoç renkleri
  - `publish.ps1` – uygulamayı Expo bulutuna yükler
- `docs/` – ekran görüntüleri, tanıtım videosu, örnek kartvizit, QR kodlar

## Çalıştırma

```powershell
cd OtokocMobileKartVisit
npm install
# .env.local dosyasına Gemini anahtarı: EXPO_PUBLIC_GEMINI_API_KEY=...
powershell -ExecutionPolicy Bypass -File .\publish.ps1 -Message "Güncelleme"
```

Telefonda Expo Go'ya `burakbeykurts-team` organizasyonuna üye bir hesapla giriş yapılıp `docs/qr-secim.png` içindeki, Expo Go sürümüne uygun QR kod okutulur.

> Gemini anahtarı `.env.local` dosyasında tutulur ve depoya eklenmez. Canlı kullanımda anahtar bir .NET backend servisine taşınmalıdır.
