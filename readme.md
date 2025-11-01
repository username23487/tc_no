# 🥚 EggApps Algoritma Kontrol Merkezi

## 🇹🇷 Proje Hakkında

Bu proje, farklı algoritmik yapıları (TCKN, Kredi Kartı vb.) tek bir arayüzde kontrol etmeye yarayan dinamik bir uygulamadır. Uygulama, girdi uzunluğuna ve seçime göre ilgili algoritmayı (Luhn Algoritması veya TCKN Algoritması) **JavaScript** ile anlık olarak çalıştırır.

### 🌐 Canlı Uygulama ve Kullanım

Uygulama anlık geri bildirim ile çalışır ve butona basma gerektirmez.

👉 **Canlı Uygulama Adresi:** `https://username23487.github.io/tc_no/`

---

## 🛠️ Desteklenen Algoritmalar

### 1. 🇹🇷 TCKN Kontrol & Tamamlama
* **Girdi:** İlk 9 hane (Tamamlama) veya 11 hane (Doğrulama).
* **Algoritma:** T.C. Kimlik No resmi kontrol hanesi hesaplama kuralları.

### 2. 💳 Kredi Kartı Doğrulama
* **Girdi:** 13 ile 19 haneli kart numarası.
* **Algoritma:** Kontrol basamağı sistemi olan **Luhn Algoritması (Mod 10)** ile kartın formatı doğrulanır.
* *(Not: Bu doğrulama, kartın gerçek, aktif ve geçerli olduğu anlamına gelmez, sadece matematiksel yapısını kontrol eder.)*

---

## 💻 Proje Yapısı

| Dosya Adı | Amaç |
| :--- | :--- |
| `index.html` | Proje seçimi ve dinamik arayüzü (HTML/CSS) sağlar. |
| `script.js` | TCKN ve Luhn Algoritmalarını içeren ana mantık ve yönlendirici fonksiyonları içerir. |
| `README.md` | Proje açıklaması ve kullanım kılavuzu. |

### Kurulum ve Güncelleme
Bu dosyaları deponuzun ana dizinine yükledikten sonra, Git komutlarını tekrar çalıştırın:
```bash
git add .
git commit -m "feat: Proje secimi ve Kredi Karti Luhn algoritmasi eklendi"
git push