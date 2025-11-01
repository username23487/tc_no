# 🥚 EggApps T.C. Kimlik No Tamamlayıcı ve Denetleyici

## 🇹🇷 Proje Hakkında

Bu proje, T.C. Kimlik Numarası (TCKN) doğrulama algoritmasına dayalı olarak, girilen ilk 9 hane üzerinden **10. ve 11. kontrol basamaklarını** hesaplayarak geçerli bir TCKN formatı oluşturur. 

Proje, **Python mantığını JavaScript'e çevirerek** tamamen statik bir web uygulaması olarak **GitHub Pages** üzerinde çalışmak üzere tasarlanmıştır.

**Önemli Not:** Bu uygulama tarafından üretilen TCKN'ler yalnızca **algoritmik olarak geçerlidir** ve **gerçek bir kişiye ait değildir**. Lütfen gerçek kimlik numarası üretme veya kullanma amacıyla kullanmayınız.

### 🌐 Canlı Uygulama ve Kullanım

Uygulamaya doğrudan web tarayıcınızdan erişebilirsiniz:

👉 **Canlı Uygulama Adresi:** `https://username23487.github.io/tc_no/`

---

## 🛠️ Teknik Detaylar

### Çalışma Prensibi
Uygulama, TCKN'nin son iki hanesini resmi algoritma kurallarına göre **JavaScript** kullanarak hesaplar. Bu, uygulamanın herhangi bir sunucuya ihtiyaç duymadan, doğrudan kullanıcı tarayıcısında (GitHub Pages uyumlu) çalışmasını sağlar.

### Algoritma Özeti
1.  **İlk Hane Kontrolü:** İlk hane '0' olamaz.
2.  **10. Hane:** $\left( \sum_{tek} (Hane_n) \times 7 - \sum_{çift} (Hane_n) \right) \bmod 10$
3.  **11. Hane:** $\left( \sum_{n=1}^{10} (Hane_n) \right) \bmod 10$

---

## 💻 Proje Yapısı

| Dosya Adı | Amaç |
| :--- | :--- |
| `index.html` | Uygulamanın modern ve stilize edilmiş arayüzünü (HTML/CSS) sağlar. |
| `script.js` | TCKN hesaplama ve doğrulama mantığını (JavaScript) içerir. |
| `README.md` | Proje açıklaması ve kullanım kılavuzu. |

### Kurulum (Yerel)
1.  Depoyu klonlayın:
    ```bash
    git clone [https://github.com/username23487/tc_no.git](https://github.com/username23487/tc_no.git)
    ```
2.  `index.html` dosyasını herhangi bir web tarayıcısında açın. Uygulama anında çalışmaya başlayacaktır.