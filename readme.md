# 🥚 EggApps Algoritma Kontrol Merkezi

## 🇹🇷 Proje Hakkında

Bu proje, farklı algoritmik yapıları (TCKN, Kredi Kartı vb.) tek bir arayüzde kontrol etmeye yarayan dinamik bir uygulamadır. Uygulama artık üç temel mod içerir: **Doğrulama, Tamamlama ve Üretme**.

### 🛠️ Desteklenen Algoritmalar ve Modüller

#### 1. 🇹🇷 TCKN Kontrol & Tamamlama
* **Girdi:** İlk 9 hane (Tamamlama) veya 11 hane (Doğrulama).
* **Algoritma:** T.C. Kimlik No resmi kontrol hanesi hesaplama kuralları.

#### 2. 💳 Kredi Kartı Doğrulama & Tamamlama
* **Doğrulama/Tamamlama:** Kart numarası **Luhn Algoritması (Mod 10)** ile doğrulanır ve son kontrol basamağı tamamlanır.
* **Marka Tespiti:** Kartın ilk hanelerinden (BIN) Visa, Mastercard, Amex gibi markalar tespit edilir.
* **Dinamik Uzunluk:** Kullanıcının seçtiği hedef uzunluğa (13, 15, 16, 19 hane) göre tamamlama yapılır.

#### 3. ⭐ Rastgele Kart Üreticisi
* **Üretim:** Seçilen markanın (Visa, Mastercard, Amex) BIN kurallarına ve Luhn algoritmasına uygun, **algoritmik olarak geçerli** rastgele kart numaraları üretilir.

### 🚀 GitHub'a Gönderme
Bu dosyaları deponuzun ana dizinine yükledikten sonra, Git komutlarını tekrar çalıştırın:
```bash
git add .
git commit -m "feat: Kart uretme modulü (BIN + Luhn) eklendi ve arayüz hatalari duzeltildi"
git push