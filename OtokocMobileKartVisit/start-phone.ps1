# Geliştirme sunucusunu Wi-Fi IP adresiyle başlatır.
# Expo varsayılan olarak sanal ağ kartının (vEthernet 172.20.0.1) adresini seçebiliyor; telefon o adrese ulaşamaz.
$wifi = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $wifi) {
  Write-Host 'Wi-Fi bağlantısı bulunamadı. Bilgisayarı telefonla aynı Wi-Fi ağına bağlayın.' -ForegroundColor Red
  exit 1
}
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $wifi.IPAddress
Write-Host "Telefonun bağlanacağı adres: exp://$($wifi.IPAddress):8081" -ForegroundColor Green
npx expo start --lan
