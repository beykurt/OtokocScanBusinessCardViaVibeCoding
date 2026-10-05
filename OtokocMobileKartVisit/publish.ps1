# Uygulamayı EAS Update ile buluta yükler; QR kod (preview kanalı) değişmez.
# eas update, .env.local dosyasını okumadığı için anahtar işlem ortamına buradan aktarılır.
param([string]$Message = 'Guncelleme')

$line = Get-Content .env.local -ErrorAction SilentlyContinue | Where-Object { $_ -like 'EXPO_PUBLIC_GEMINI_API_KEY=*' }
if (-not $line) {
  Write-Host '.env.local içinde EXPO_PUBLIC_GEMINI_API_KEY bulunamadı; uygulama demo modunda yüklenecek.' -ForegroundColor Yellow
} else {
  $env:EXPO_PUBLIC_GEMINI_API_KEY = $line.Substring('EXPO_PUBLIC_GEMINI_API_KEY='.Length).Trim()
}

$env:EAS_NO_VCS = '1'
$env:EAS_PROJECT_ROOT = (Get-Location).Path
$env:EAS_SKIP_AUTO_FINGERPRINT = '1'
npx eas update --branch preview --environment preview --message $Message --non-interactive
