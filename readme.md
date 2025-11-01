# 🥚 EggApps T.C. Kimlik No Tamamlayıcı ve Denetleyici

## 🇹🇷 Proje Hakkında

Bu proje, T.C. Kimlik Numarası (TCKN) doğrulama algoritmasına dayalı olarak çalışır. Uygulama, girdi uzunluğuna göre iki temel görevi yerine getirir:
1. **TCKN Tamamlama (9 Hane Girişi):** İlk 9 hane girildiğinde, 10. ve 11. kontrol basamaklarını hesaplayarak geçerli bir TCKN formatı oluşturur.
2. **TCKN Doğrulama (11 Hane Girişi):** 11 hanenin tamamı girildiğinde, TCKN'nin algoritmik olarak doğru olup olmadığını kontrol eder.

Proje, **JavaScript** kullanarak tamamen statik bir web uygulaması olarak **GitHub Pages** üzerinde çalışmak üzere tasarlanmıştır.

**Önemli Not:** Bu uygulama tarafından üretilen TCKN'ler yalnızca **algoritmik olarak geçerlidir** ve **gerçek bir kişiye ait değildir**.

### 🌐 Canlı Uygulama ve Kullanım

Uygulama anlık geri bildirim ile çalışır ve butona basma gerektirmez.

👉 **Canlı Uygulama Adresi:** `https://username23487.github.io/tc_no/`

---

## 🛠️ Teknik Detaylar (Algoritma Özeti)

Uygulama, TCKN'nin son iki hanesini resmi algoritma kurallarına göre hesaplar:

1.  **İlk Hane Kontrolü:** İlk hane '0' olamaz.
2.  **10. Hane:** $\left( \sum_{tek} (Hane_n) \times 7 - \sum_{çift} (Hane_n) \right) \bmod 10$
3.  **11. Hane:** $\left( \sum_{n=1}^{10} (Hane_n) \right) \bmod 10$

---

## 💻 Proje Yapısı

| Dosya Adı | Amaç |
| :--- | :--- |
| `index.html` | Uygulamanın modern ve stilize edilmiş arayüzünü (HTML/CSS) sağlar. |
| `script.js` | TCKN hesaplama, tamamlama ve doğrulama mantığını (JavaScript) içerir. |
| `README.md` | Proje açıklaması ve kullanım kılavuzu. |

### Kurulum (Yerel)
1.  Depoyu klonlayın:
    ```bash
    git clone [https://github.com/username23487/tc_no.git](https://github.com/username23487/tc_no.git)
    ```
2.  `index.html` dosyasını herhangi bir web tarayıcısında açın. Uygulama anında çalışmaya başlayacaktır.