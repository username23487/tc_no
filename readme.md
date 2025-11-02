# 🇹🇷 Türkiye Veri Doğrulama ve Üretim Algoritmaları Projesi

Bu proje, Türkiye Cumhuriyeti'nde kullanılan çeşitli kimlik, finans ve tescil numaralarının (TCKN, VKN, IBAN, Plaka, Kredi Kartı) **uluslararası ve yerel standartlara uygunluğunu** denetleyen ve geçerli formata göre üreten kapsamlı bir JavaScript (Vanilla JS) aracıdır.

Proje, özellikle kritik algoritmik mantık hatalarını ve format istisnalarını gidermek için son dönemde **kapsamlı güncellemeler** almıştır.

## ✨ Temel Modüller ve Algoritmalar

Proje, aşağıdaki modüllerde endüstri standardı algoritmaları ve T.C. resmi kısıtlamalarını kullanır:

| Modül | Algoritma/Kontrol Standardı | Açıklama |
| :--- | :--- | :--- |
| **T.C. Kimlik No (TCKN)** | T.C. İçişleri Bakanlığı Algoritması | İlk hane $0$ olamaz. $10.$ ve $11.$ haneler, ilk 9 hane üzerinden **$7-1$ çarpım kuralı** ile hesaplanır ve doğrulanır. |
| **Vergi Kimlik No (VKN)** | T.C. Maliye Bakanlığı Algoritması | 10 haneli VKN'nin son basamağı, **Mod 9 ve Mod 10** kurallarına göre hesaplanır. **$0 \rightarrow 9$ istisna kuralı** dikkate alınmıştır. |
| **Uluslararası Banka Hesap No (IBAN)** | **ISO 13616 (MOD 97)** | Türkiye (TR) IBAN'ının 26 haneli formatı doğrulanır. Hesaplama sırasında harfler sayısal karşılığa çevrilir ve sonucun $1$ (Mod $97$ kuralı) olması beklenir. |
| **Kredi Kartı** | **Luhn Algoritması (Mod 10)** | VISA, Mastercard, Amex ve Troy kart tipleri desteklenir. Her ikinci hanenin iki katına çıkarılması ve toplamın Mod 10 ile $0$ olması kuralı uygulanır. |
| **Plaka Numarası** | T.C. Trafik Tescil Kısıtlamaları | En kritik yerel kısıtlamaları içerir. |

## 🚨 Plaka Modülündeki Kritik Düzeltmeler

Plaka doğrulama modülü, **en son güncellemelerle** birlikte, piyasadaki birçok aracın atladığı kritik istisnaları ve yerel kuralları kapsayacak şekilde optimize edilmiştir:

1.  **7 Karakterli Format Eksikliği Giderildi:**
    * `34 A 1234` (1 Harf + 4 Rakam)
    * `34 ABC 12` (3 Harf + 2 Rakam)
    * **EK DÜZELTME:** `55 CZ 956` gibi **2 Harf + 3 Rakam** kombinasyonları artık geçerli sayılmaktadır.

2.  **Yasaklı Karakter ve Kelimeler:**
    * **Türkçe Karakter Yasağı:** Plaka harf gruplarında **Ç, Ş, İ, Ö, Ü, Ğ** karakterlerinin kullanılması engellenmiştir. (Örnek: `42 EÖ 1000` plakası HATA verir.)
    * **Standart Dışı Harfler:** **Q, W, X** harflerinin kullanılması engellenmiştir.
    * **Yasaklı Kelime Kontrolü:** `APO`, `PKK`, `LAN`, `MAL`, vb. gibi yasaklı kelimeler içeren harf dizileri engellenmiştir.

## ✅ Test Edilen ve Onaylanan Senaryolar

Proje, en zorlu test senaryolarından başarıyla geçmiştir:

* **Plaka 2H+3R Testi:** `55 CZ 956` girişi başarılı (BAŞARI) olarak onaylanmıştır.
* **VKN Tamamlama Testi:** `123456789` girişi için kontrol hanesi **$0$** olarak doğru hesaplanmıştır. (Çıktı: `1234567890`)
* **Kredi Kartı Luhn Testi:** $15$ haneli `400000000000019` girişi için Luhn kontrol hanesi **$2$** olarak doğru hesaplanmıştır. (Çıktı: `4000000000000192`)

---

## 🛠️ Kurulum ve Kullanım

Bu proje saf JavaScript ile yazılmıştır. Herhangi bir derleme (bundler) gerektirmez.

1.  Proje dosyalarını (özellikle `script.js` ve `index.html`) sunucunuza yükleyin.
2.  `index.html` dosyasını tarayıcınızda açın.
3.  Arayüzden ilgili modülü seçin ve doğrulama veya üretim işlemini başlatın.