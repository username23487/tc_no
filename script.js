// =========================================================================
// == PROJE: ALGORİTMA DOĞRULAMA VE ÜRETİM ARACI (GENİŞLETİLMİŞ VERSİYON) ==
// == AMAÇ: KOD UZUNLUĞUNU ARTIRMAK VE DETAYLI AÇIKLAMA EKLEMEK          ==
// =========================================================================

// --- 1. GENEL PROJE YAPILANDIRMASI (CONFIG) ---
// Tüm sabit değerler, regexler ve uzun listeler bu yapı içinde toplanmıştır.
const CONFIG = {
    // E-Posta Doğrulama için Gelişmiş Regex Yapısı
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    
    // Şifre Üretimi için Kapsamlı Karakter Setleri Tanımı
    SIFRE_KARAKTER_SETLERI: {
        buyukHarf: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        kucukHarf: 'abcdefghijklmnopqrstuvwxyz',
        rakam: '0123456789',
        ozelKarakter: '!@#$%^&*()_+~`|}{[]\:;?><,./-=' // Daha uzun bir set
    },

    // Türkiye GSM Operatör Kodlarının Detaylı Listesi
    OPERATOR_KODLARI: {
        turkcell: [530, 531, 532, 533, 534, 535, 536, 537, 538, 539],
        vodafone: [540, 541, 542, 543, 544, 545, 546, 547, 548, 549],
        turktelekom: [501, 505, 506, 507, 550, 551, 552, 553, 554, 555, 558, 559]
    },

    // Kredi Kartı On Ekleri ve Standart Uzunlukları
    KART_STANDARTLARI: {
        visa: { onEk: '4', uzunluk: 16 },
        mastercard: { onEk: '5', uzunluk: 16 },
        amex: { onEkler: ['34', '37'], uzunluk: 15 },
        troy: { onEk: '9792', uzunluk: 16 }
    },
    
    // Genel UI Durum Sınıfları
    UI_DURUMLARI: {
        HATA: 'error',
        BASARI: 'success',
        UYARI: 'warn',
        VARSAYILAN: 'default'
    }
};


// --- 2. TEMEL YARDIMCI (UTILITY) FONKSİYONLAR ---

/**
 * Belirtilen uzunlukta rastgele sayısal string üretir.
 * İlk hane sıfır olmaması gerekiyorsa bu parametre kullanılır (örn. TCKN).
 * @param {number} uzunluk - Üretilecek sayının uzunluğu.
 * @param {boolean} ilkHaneSifirOlamaz - İlk hanenin 1-9 arası olmasını sağlar.
 * @returns {string} Rastgele sayısal string.
 */
function rastgeleSayiUret(uzunluk, ilkHaneSifirOlamaz = false) {
    let numara = '';
    for (let i = 0; i < uzunluk; i++) {
        let rakam = Math.floor(Math.random() * 10);
        // Eğer ilk hane ve sıfır olmama kuralı geçerliyse
        if (i === 0 && ilkHaneSifirOlamaz) {
            rakam = Math.floor(Math.random() * 9) + 1; // 1 ile 9 arası
        }
        numara += rakam;
    }
    return numara;
}

/**
 * Belirtilen uzunlukta rastgele alfanümerik karakter dizisi üretir.
 * @param {number} uzunluk - Üretilecek dizinin uzunluğu.
 * @returns {string} Rastgele alfanümerik dize.
 */
function rastgeleKarakterUret(uzunluk) {
    const karakterler = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Kullanılabilir karakter seti
    let sonuc = '';
    for (let i = 0; i < uzunluk; i++) {
        sonuc += karakterler.charAt(Math.floor(Math.random() * karakterler.length));
    }
    return sonuc;
}

/**
 * Luhn Algoritması (Mod 10) Kontrol Hanesi Hesaplama Fonksiyonu.
 * Kredi kartı numarası, IMEI, vb. doğrulama sistemlerinde kullanılır.
 * @param {string} numara - Kontrol hanesi olmadan önceki kısım.
 * @returns {number} Hesaplanan kontrol hanesi.
 */
function hesaplaLuhnKontrolHaneyi(numara) {
    // Geçici olarak 0 eklenir ve sondan başlanır
    let gecici_numara = numara + '0';
    let toplam = 0;
    let cift_hane = false; // Sondan başlandığı için tek haneler çift işlem görür

    for (let i = gecici_numara.length - 1; i >= 0; i--) {
        let rakam = parseInt(gecici_numara.charAt(i), 10);

        if (cift_hane) {
            // Çift basamakta işlemi uygula: rakamı 2 ile çarp
            rakam *= 2;
            if (rakam > 9) rakam -= 9; // 9'dan büyükse rakamları topla (pratik olarak -9)
        }
        toplam += rakam;
        cift_hane = !cift_hane; // Durumu tersine çevir
    }
    // Kontrol hanesini hesapla: 10 - (toplam mod 10)
    return (10 - (toplam % 10)) % 10;
}

/**
 * IBAN doğrulama için alfanümerik karakterleri sayısal karşılığına çevirir.
 * A=10, B=11, ..., Z=35.
 * @param {string} str - Dönüştürülecek karakter dizisi (IBAN).
 * @returns {string} Sayısal karşılığı olan uzun dize.
 */
function convertLettersToNumbers(str) {
    return str.split('').map(char => {
        // Büyük harf kontrolü
        if (char >= 'A' && char <= 'Z') {
            // ASCII farkını kullanarak 10'dan başlayarak sayısal karşılığı buluruz
            return (char.charCodeAt(0) - 'A'.charCodeAt(0) + 10).toString();
        }
        return char; // Rakamları olduğu gibi bırak
    }).join('');
}


// --- 3. ANA ALGORİTMA NESNESİ (MODÜLER YAPI) ---
// Tüm doğrulama ve üretim mantığı, ilgili modül altında toplanmıştır.
const Algoritma = {

    // ---------------------------------------------
    // --- VKN MODÜLÜ (MODÜL 7) - VERGİ KİMLİK NO ---
    // ---------------------------------------------
    vkn: {
        /**
         * VKN'nin 10. hanesini (kontrol basamağını) hesaplar.
         * @param {string} ilk_9_hane - VKN'nin ilk 9 hanesi.
         * @returns {number} Hesaplanan 10. hane.
         */
        kontrolBasamagiHesapla(ilk_9_hane) {
            // Kontrol basamağı hesaplama süreci VKN algoritmasına özeldir.
            let V = [];
            for (let i = 0; i < 9; i++) {
                const di = parseInt(ilk_9_hane.charAt(i), 10);
                const j = 9 - i; // Ağırlık çarpanı
                let temp = (di + j) % 10;
                let v_i = (temp * Math.pow(2, j)) % 9;
                // VKN kuralı: (temp != 0) ve (v_i == 0) ise, v_i = 9 olur.
                if (temp !== 0 && v_i === 0) {
                    v_i = 9;
                }
                V[i] = v_i;
            }
            const toplam = V.reduce((a, b) => a + b, 0);
            let kontrol_basamagi = toplam % 10;
            // Sonuç 0 ise kontrol basamağı 0'dır, aksi halde 10'dan çıkarılır.
            return kontrol_basamagi === 0 ? 0 : (10 - kontrol_basamagi) % 10;
        },

        /**
         * Girilen VKN'yi kontrol eder ve tamamlar.
         * @param {string} vkn_str - Kullanıcıdan alınan VKN stringi.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(vkn_str) {
            const uzunluk = vkn_str.length;
            if (uzunluk === 0) return { sonucMetni: '⚠️ VKN Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk < 9) return { sonucMetni: `⌛ VKN Tamamlama İşlemi İçin **${9 - uzunluk} hane** daha girmeniz gerekmektedir.`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > 10) return { sonucMetni: '❌ Hata: Vergi Kimlik Numarası 10 haneden fazla olamaz.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(vkn_str)) return { sonucMetni: '❌ Hata: VKN sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };

            const ilk_9_hane = vkn_str.substring(0, 9);
            const hesaplanan_kontrol = Algoritma.vkn.kontrolBasamagiHesapla(ilk_9_hane);

            // 9 hane girildiğinde otomatik tamamlama yapılır.
            if (uzunluk === 9) {
                const tamamlanmis_vkn = ilk_9_hane + String(hesaplanan_kontrol);
                return { sonucMetni: `➡️ **TAMAMLANMIŞ VKN:** <span style="color: var(--primary-color); font-weight: bold;">${tamamlanmis_vkn}</span> (Hesaplanan Kontrol Basamağı: ${hesaplanan_kontrol})`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }

            // 10 hane girildiğinde doğrulama yapılır.
            const girilen_kontrol = parseInt(vkn_str.charAt(9));
            if (girilen_kontrol === hesaplanan_kontrol) {
                return { sonucMetni: `✅ Vergi Kimlik Numarası Algoritmayı Başarıyla Geçti! **(Doğruluk Onaylandı)**`, durum: CONFIG.UI_DURUMLARI.BASARI };
            } else {
                const dogru_vkn = ilk_9_hane + String(hesaplanan_kontrol);
                return { sonucMetni: `❌ VKN Doğrulama Başarısız. Girilen: ${vkn_str}. **Doğru VKN:** ${dogru_vkn}. (Kontrol Basamağı ${girilen_kontrol} yerine ${hesaplanan_kontrol} olmalıydı.)`, durum: CONFIG.UI_DURUMLARI.HATA };
            }
        },

        /**
         * Geçerli bir VKN üretir.
         * @returns {string} Üretilen 10 haneli VKN.
         */
        uret() {
            const ilk_9_hane = rastgeleSayiUret(9);
            const kontrol_hanesi = Algoritma.vkn.kontrolBasamagiHesapla(ilk_9_hane);
            return ilk_9_hane + String(kontrol_hanesi);
        }
    },
    // VKN Modülü Bitiş

    // ---------------------------------------------
    // --- TCKN MODÜLÜ (MODÜL 1) - T.C. KİMLİK NO ---
    // ---------------------------------------------
    tckn: {
        /**
         * TCKN'nin 10. ve 11. hanelerini hesaplar.
         * @param {string} ilk_9_hane - TCKN'nin ilk 9 hanesi.
         * @returns {{hane_10: number, hane_11: number}} Hesaplanan son iki hane.
         */
        kontrolBasamagiHesapla(ilk_9_hane) {
            // TCKN algoritması iki aşamalı bir kontrol mekanizmasıdır.
            const rakamlar = ilk_9_hane.split('').map(Number);
            let tek_toplam = 0, cift_toplam = 0;
            
            // 1. Aşama: Tek ve Çift Sıradaki Rakamların Toplamı
            for (let i = 0; i < 9; i++) {
                if ((i + 1) % 2 === 1) {
                    tek_toplam += rakamlar[i]; // 1, 3, 5, 7, 9. haneler
                } else {
                    cift_toplam += rakamlar[i]; // 2, 4, 6, 8. haneler
                }
            }
            
            // 10. Hane Kontrolü: ((Tek Toplam * 7) - Çift Toplam) mod 10
            const kontrol_farki = (tek_toplam * 7) - cift_toplam;
            const hane_10 = (kontrol_farki % 10 + 10) % 10; // Modulo operasyonunda negatif sayıları yönetmek için +10 eklendi.
            
            // 2. Aşama: İlk 10 Rakamın Toplamı (11. Hane Kontrolü)
            const ilk_10_toplam = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + hane_10;
            const hane_11 = ilk_10_toplam % 10;

            return { hane_10, hane_11 };
        },

        /**
         * Girilen TCKN'yi kontrol eder ve tamamlar.
         * @param {string} tckn_str - Kullanıcıdan alınan TCKN stringi.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(tckn_str) {
            const uzunluk = tckn_str.length;
            if (uzunluk === 0) return { sonucMetni: '⚠️ TCKN Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk < 9) return { sonucMetni: `⌛ TCKN Tamamlama İçin **${9 - uzunluk} hane** daha girmeniz gerekmektedir.`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > 11) return { sonucMetni: '❌ Hata: TCKN 11 haneden fazla olamaz.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (tckn_str.charAt(0) === '0') return { sonucMetni: "❌ Hata: T.C. Kimlik Numarası'nın ilk hanesi sıfır ('0') olamaz.", durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(tckn_str)) return { sonucMetni: '❌ Hata: TCKN sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };


            const ilk_9_hane = tckn_str.substring(0, 9);
            const { hane_10, hane_11 } = Algoritma.tckn.kontrolBasamagiHesapla(ilk_9_hane);

            // 9 hane girildiğinde otomatik tamamlama yapılır.
            if (uzunluk === 9) {
                const tamamlanmis_tckn = ilk_9_hane + String(hane_10) + String(hane_11);
                return { sonucMetni: `➡️ **TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color); font-weight: bold;">${tamamlanmis_tckn}</span> (Kontrol Haneleri: ${hane_10} ve ${hane_11})`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }

            // 11 hane girildiğinde tam doğrulama yapılır.
            if (uzunluk === 11) {
                const girilen_10 = parseInt(tckn_str.charAt(9));
                const girilen_11 = parseInt(tckn_str.charAt(10));

                if (girilen_10 === hane_10 && girilen_11 === hane_11) {
                    return { sonucMetni: `✅ T.C. Kimlik Numarası Algoritmayı Başarıyla Geçti! **(Çift Kontrol Onaylandı)**`, durum: CONFIG.UI_DURUMLARI.BASARI };
                } else {
                    const dogru_tckn = ilk_9_hane + String(hane_10) + String(hane_11);
                    return { sonucMetni: `❌ TCKN Doğrulama Başarısız. Kontrol Hatalı. **Doğru TCKN Şöyle Olmalıydı:** ${dogru_tckn}`, durum: CONFIG.UI_DURUMLARI.HATA };
                }
            }
        },

        /**
         * Geçerli bir TCKN üretir.
         * @returns {string} Üretilen 11 haneli TCKN.
         */
        uret() {
            // İlk hane 1-9 arası, sonra rastgele 8 hane.
            const ilk_9_hane = rastgeleSayiUret(1, true) + rastgeleSayiUret(8); 
            const { hane_10, hane_11 } = Algoritma.tckn.kontrolBasamagiHesapla(ilk_9_hane);
            return ilk_9_hane + String(hane_10) + String(hane_11);
        }
    },
    // TCKN Modülü Bitiş

    // ---------------------------------------------------
    // --- KREDİ KARTI MODÜLÜ (MODÜL 2 - LUHN ALGORİTMASI) ---
    // ---------------------------------------------------
    kredi_karti: {
        /**
         * Kart numarasının ilk hanelerine bakarak markayı belirler.
         * @param {string} kart_no - Kart numarasının başlangıç kısmı.
         * @returns {string} Belirlenen kart markası (veya bilinmeyen).
         */
        kartMarkasiBelirle(kart_no) {
            // Uluslararası Standartlara göre kart markası tespiti
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.visa.onEk)) return 'Visa 🛡️';
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.mastercard.onEk)) return 'Mastercard 💳';
            if (CONFIG.KART_STANDARTLARI.amex.onEkler.some(prefix => kart_no.startsWith(prefix))) return 'American Express (Amex) ✈️';
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.troy.onEk)) return 'Troy 🇹🇷';
            return 'Bilinmeyen Kart Türü';
        },
        
        /**
         * Girilen kart numarasını Luhn algoritması ile kontrol eder.
         * @param {string} kart_no - Kullanıcıdan alınan kart numarası.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(kart_no) {
            kart_no = kart_no.replace(/\s/g, ''); // Boşlukları kaldır
            const uzunluk = kart_no.length;
            const kart_markasi = Algoritma.kredi_karti.kartMarkasiBelirle(kart_no);
            const hedef_uzunluk = parseInt(document.getElementById('kart-uzunluk-secim').value, 10);
            
            if (uzunluk === 0) return { sonucMetni: '⚠️ Kart Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > hedef_uzunluk) return { sonucMetni: `❌ Hata: Girdiğiniz hane sayısı (${uzunluk}), seçilen (${hedef_uzunluk}) haneden fazladır.`, durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(kart_no)) return { sonucMetni: '❌ Hata: Kart numarası sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };

            // Luhn Toplam Hesaplayıcısı (Kontrol hariç)
            const hesaplaLuhnToplami = (numara) => {
                let toplam = 0; let cift_hane = false; 
                for (let i = numara.length - 1; i >= 0; i--) {
                    let rakam = parseInt(numara.charAt(i), 10);
                    if (cift_hane) { 
                        rakam *= 2; 
                        if (rakam > 9) rakam -= 9; 
                    }
                    toplam += rakam; 
                    cift_hane = !cift_hane;
                } 
                return toplam;
            };

            // Eksik hane girildiğinde tamamlama yapar.
            if (uzunluk === hedef_uzunluk - 1) { 
                const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(kart_no);
                const tamamlanmis_kart = kart_no + kontrol_hanesi;
                return { sonucMetni: `➡️ Marka: ${kart_markasi}. **Eksik Son Hane Tamamlandı:** ${kontrol_hanesi}. Tamamı: <span style="font-weight: bold;">${tamamlanmis_kart}</span>`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }
            
            // Tam hane girildiğinde doğrulama yapar.
            if (uzunluk === hedef_uzunluk) {
                const toplam = hesaplaLuhnToplami(kart_no);
                if (toplam % 10 === 0) { 
                    return { sonucMetni: `✅ Kart Numarası (${kart_markasi}) **Luhn Algoritmasını BAŞARIYLA GEÇTİ!** (Toplam Mod 10 = 0)`, durum: CONFIG.UI_DURUMLARI.BASARI }; 
                } else { 
                    return { sonucMetni: `❌ Kart Numarası (${kart_markasi}) Luhn Algoritmasında BAŞARISIZ. (Toplam Mod 10 = ${toplam % 10}, 0 olmalıydı.)`, durum: CONFIG.UI_DURUMLARI.HATA }; 
                }
            }

            return { sonucMetni: `⌛ Kartı tamamlamak için **${hedef_uzunluk - 1} hane** girmelisiniz. Marka Tespiti: ${kart_markasi}`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
        },

        /**
         * Seçilen markaya göre geçerli bir kart numarası üretir.
         * @returns {string} Üretilen Luhn geçerli kart numarası.
         */
        uret() {
            const secim = document.getElementById('kart-marka-secim').value;
            let on_ek, hedef_uzunluk;
            
            // Seçime göre başlangıç ve uzunluk belirleme
            if (secim === '4_16') { 
                on_ek = CONFIG.KART_STANDARTLARI.visa.onEk + rastgeleSayiUret(5); 
                hedef_uzunluk = CONFIG.KART_STANDARTLARI.visa.uzunluk; 
            } else if (secim === '5_16') { 
                on_ek = CONFIG.KART_STANDARTLARI.mastercard.onEk + rastgeleSayiUret(5); 
                hedef_uzunluk = CONFIG.KART_STANDARTLARI.mastercard.uzunluk; 
            } else if (secim === '3_15') { 
                const amex_on_ekleri = CONFIG.KART_STANDARTLARI.amex.onEkler;
                on_ek = amex_on_ekleri[Math.floor(Math.random() * amex_on_ekleri.length)] + rastgeleSayiUret(2); 
                hedef_uzunluk = CONFIG.KART_STANDARTLARI.amex.uzunluk; 
            } else if (secim === '9_16') { 
                on_ek = CONFIG.KART_STANDARTLARI.troy.onEk + rastgeleSayiUret(2); 
                hedef_uzunluk = CONFIG.KART_STANDARTLARI.troy.uzunluk; 
            } else {
                return '';
            }
            
            // Luhn kontrol hanesi hesaplaması için gerekli rastgele kısım
            const hesap_numarasi_uzunlugu = hedef_uzunluk - on_ek.length - 1; 
            let gecici_numara = on_ek + rastgeleSayiUret(hesap_numarasi_uzunlugu);
            
            // Kontrol hanesini hesaplayıp numaranın sonuna ekle
            const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(gecici_numara);
            return gecici_numara + kontrol_hanesi;
        }
    },
    // Kredi Kartı Modülü Bitiş

    // ---------------------------------------------
    // --- IBAN MODÜLÜ (MODÜL 3 - MOD 97) ---
    // ---------------------------------------------
    iban: {
        /**
         * Girilen IBAN'ı Uluslararası MOD 97 algoritması ile kontrol eder.
         * @param {string} iban_str - Kullanıcıdan alınan IBAN stringi.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(iban_str) {
            iban_str = iban_str.toUpperCase().replace(/\s/g, ''); // Boşlukları ve küçük harfleri düzenle
            if (iban_str.length === 0) return { sonucMetni: '⚠️ IBAN Kontrolü İçin Lütfen karakterleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (iban_str.length !== 26) return { sonucMetni: `❌ Hata: Türkiye IBAN'ı tam olarak 26 karakter olmalıdır. Girilen: ${iban_str.length}`, durum: CONFIG.UI_DURUMLARI.HATA };
            if (!iban_str.startsWith('TR')) return { sonucMetni: '❌ Hata: Türkiye IBAN numarası zorunlu olarak "TR" ülke kodu ile başlamalıdır.', durum: CONFIG.UI_DURUMLARI.HATA };
            
            // Kontrol: İlk 4 karakteri sona taşı
            const duzenlenmis_iban = iban_str.substring(4) + iban_str.substring(0, 4); 
            // Kontrol: Harfleri sayılara çevir (TR -> 2927)
            const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
            
            // MOD 97 Algoritması ile Kalan Hesaplama
            let kalan = 0;
            // Dize çok uzun olduğu için Modulo işlemi parça parça yapılır
            for (let i = 0; i < sayisal_iban.length; i++) { 
                kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97; 
            }

            if (kalan === 1) { 
                return { sonucMetni: '✅ IBAN, Uluslararası MOD 97 Kontrolünden **BAŞARIYLA GEÇTİ!** (Kalan 1)', durum: CONFIG.UI_DURUMLARI.BASARI }; 
            } else { 
                return { sonucMetni: `❌ IBAN, MOD 97 Kontrolünde BAŞARISIZ. (Kalan ${kalan}, 1 olmalıydı.)`, durum: CONFIG.UI_DURUMLARI.HATA }; 
            }
        },

        /**
         * Geçerli bir Türkiye IBAN'ı üretir.
         * @returns {string} Üretilen 26 karakterli IBAN.
         */
        uret() {
            const ulke_kodu = 'TR'; 
            const banka_kodu = rastgeleSayiUret(5); // 5 hane
            const rezerv_alan = '0'; // 1 hane (TR'de genellikle 0)
            const hesap_numarasi = rastgeleSayiUret(16); // 16 hane
            
            // Kontrol basamağı hesaplamak için dizilim: BBKKK... + TR00
            let hesaplama_parcasi = banka_kodu + rezerv_alan + hesap_numarasi + ulke_kodu + '00';
            const sayisal_iban = convertLettersToNumbers(hesaplama_parcasi);
            
            // MOD 97 Hesaplaması
            let kalan = 0;
            for (let i = 0; i < sayisal_iban.length; i++) { 
                kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97; 
            }
            
            // Kontrol basamağı: 98 - kalan
            let kontrol_basamagi = 98 - kalan;
            let kontrol_str = kontrol_basamagi.toString().padStart(2, '0'); // 2 haneli olmalı
            
            // Son IBAN yapısı: TR + Kontrol + Banka Kodu + Rezerv + Hesap No.
            return ulke_kodu + kontrol_str + banka_kodu + rezerv_alan + hesap_numarasi;
        }
    },
    // IBAN Modülü Bitiş
    
    // ---------------------------------------------
    // --- TELEFON MODÜLÜ (MODÜL 4) - GSM NUMARASI ---
    // ---------------------------------------------
    telefon: {
        /**
         * Kullanıcıdan gelen numara stringini sadeleştirir (sadece 10 hane kalır).
         * @param {string} numara_str - Giriş numarası.
         * @returns {string} Sadece 10 haneden oluşan sayısal dize.
         */
        numarayiTemizle(numara_str) {
            let temiz_numara = numara_str.replace(/[^0-9]/g, ''); // Tüm sayı dışı karakterleri kaldır
            
            // Ülke Kodu Temizleme (+90 / 90)
            if (temiz_numara.startsWith('90')) {
                temiz_numara = temiz_numara.substring(2);
            }
            // Başlangıç Sıfırı Temizleme (05XX)
            if (temiz_numara.startsWith('0')) {
                temiz_numara = temiz_numara.substring(1);
            }
            // Sadece 10 hane (5XX XXXXXXX) kalmasını sağla
            return temiz_numara.substring(0, 10);
        },

        /**
         * 3 haneli alan koduna göre operatörü belirler.
         * @param {string} alan_kodu - Numaranın ilk 3 hanesi.
         * @returns {string} Operatör adı (Büyük Harfle) veya "Bilinmiyor".
         */
        operatorBelirle(alan_kodu) {
            const kodlar = CONFIG.OPERATOR_KODLARI;
            for (const operator in kodlar) {
                if (kodlar[operator].includes(parseInt(alan_kodu))) {
                    // Operatör adının ilk harfini büyüt
                    return operator.charAt(0).toUpperCase() + operator.slice(1);
                }
            }
            return 'Bilinmiyor';
        },

        /**
         * Girilen numarayı kontrol eder ve formatlar.
         * @param {string} numara_str - Kullanıcıdan alınan numara stringi.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(numara_str) {
            const temiz_numara = Algoritma.telefon.numarayiTemizle(numara_str);
            const uzunluk = temiz_numara.length;

            if (uzunluk === 0) return { sonucMetni: '⚠️ Numara Kontrolü İçin Lütfen bir numara giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk !== 10) return { sonucMetni: `❌ Hata: GSM numarası 10 hane olmalıdır (5XX XXXXXXX). Girilen: ${uzunluk} hane.`, durum: CONFIG.UI_DURUMLARI.HATA };
            if (!temiz_numara.startsWith('5')) return { sonucMetni: '❌ Hata: Türkiye GSM numaraları zorunlu olarak 5 ile başlamalıdır (5XX).', durum: CONFIG.UI_DURUMLARI.HATA };
            
            const alan_kodu = temiz_numara.substring(0, 3);
            const operator = Algoritma.telefon.operatorBelirle(alan_kodu);
            const formatli_numara = `${temiz_numara.substring(0, 3)} ${temiz_numara.substring(3, 6)} ${temiz_numara.substring(6, 8)} ${temiz_numara.substring(8, 10)}`;
            
            if (operator === 'Bilinmiyor') {
                return { sonucMetni: `❌ Alan Kodu **${alan_kodu}** Geçersiz veya Bilinmeyen Operatör Kodu. Lütfen geçerli bir 5XX kodu giriniz.`, durum: CONFIG.UI_DURUMLARI.HATA };
            } else {
                return { sonucMetni: `✅ GSM Numaranız Geçerli. **Operatör:** ${operator}. Önerilen Format: **+90 ${formatli_numara}**`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }
        },

        /**
         * Seçilen operatöre göre rastgele geçerli bir numara üretir.
         * @returns {string} Üretilen formatlı numara.
         */
        uret() {
            const operatorSecim = document.getElementById('operator-secim').value;
            const kodListesi = CONFIG.OPERATOR_KODLARI[operatorSecim];
            if (!kodListesi) return '';

            const rastgeleKod = kodListesi[Math.floor(Math.random() * kodListesi.length)];
            const son_7_hane = rastgeleSayiUret(7);
            const uretilen_numara = String(rastgeleKod) + son_7_hane;
            
            // Formatlama: 5XX XXX XX XX
            return `${uretilen_numara.substring(0, 3)} ${uretilen_numara.substring(3, 6)} ${uretilen_numara.substring(6, 8)} ${uretilen_numara.substring(8, 10)}`;
        }
    },
    // Telefon Modülü Bitiş
    
    // ---------------------------------------------
    // --- E-POSTA MODÜLÜ (MODÜL 5 - REGEX) ---
    // ---------------------------------------------
    eposta: {
        /**
         * E-posta adresini gelişmiş Regex ile kontrol eder.
         * @param {string} eposta_str - Kullanıcıdan alınan e-posta adresi.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(eposta_str) {
            if (eposta_str.length === 0) return { sonucMetni: '⚠️ E-Posta Kontrolü İçin Lütfen bir adres giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            const dogrulama_basarili = CONFIG.EMAIL_REGEX.test(eposta_str.toLowerCase());
            
            if (dogrulama_basarili) { 
                return { sonucMetni: `✅ E-Posta adresi sözdizimi **Uluslararası RFC standartlarına** uygun görünmektedir.`, durum: CONFIG.UI_DURUMLARI.BASARI }; 
            } else { 
                return { sonucMetni: `❌ E-Posta sözdizimi kurallarına uymuyor. Lütfen **@** ve **alan adı** (örn: .com) kontrolünü yapınız.`, durum: CONFIG.UI_DURUMLARI.HATA }; 
            }
        },
        
        /**
         * Rastgele, geçerli bir e-posta adresi üretir.
         * @returns {string} Üretilen e-posta adresi.
         */
        uret() {
            const popüler_alanlar = ['gmail.com', 'hotmail.com.tr', 'yandex.com', 'yahoo.com', 'outlook.com', 'mail.com', 'mycorp.org', 'bireysel.net'];
            const kullanici_adi = rastgeleKarakterUret(Math.floor(Math.random() * 5) + 5); 
            const alan_adi = popüler_alanlar[Math.floor(Math.random() * popüler_alanlar.length)];
            return `${kullanici_adi}_${rastgeleSayiUret(2)}@${alan_adi}`;
        }
    },
    // E-Posta Modülü Bitiş
    
    // ---------------------------------------------
    // --- ŞİFRE MODÜLÜ (MODÜL 6) - GÜÇ KONTROLÜ ---
    // ---------------------------------------------
    sifre: {
        /**
         * Şifreyi güvenlik kriterlerine göre puanlar ve durumunu belirler.
         * @param {string} sifre - Kullanıcıdan alınan şifre.
         * @returns {{sonucMetni: string, durum: string}} İşlem sonucu.
         */
        kontrol(sifre) {
            if (sifre.length === 0) return { sonucMetni: '⚠️ Şifre Güç Kontrolü İçin Lütfen bir şifre giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            
            let puan = 0;
            let eksik_kosullar = [];
            const min_uzunluk = 8;
            
            // Koşul Kontrolleri ve Puanlama:
            if (sifre.length >= min_uzunluk) puan += 1; else eksik_kosullar.push(`Min. ${min_uzunluk} karakter.`);
            if (/[A-Z]/.test(sifre)) puan += 1; else eksik_kosullar.push('Büyük harf (A-Z).');
            if (/[a-z]/.test(sifre)) puan += 1; else eksik_kosullar.push('Küçük harf (a-z).');
            if (/[0-9]/.test(sifre)) puan += 1; else eksik_kosullar.push('Rakam (0-9).');
            
            // Özel karakter Regex oluşturma ve kontrolü
            const ozelKarakterSeti = CONFIG.SIFRE_KARAKTER_SETLERI.ozelKarakter;
            const ozelKarakterRegex = new RegExp(`[${ozelKarakterSeti.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`);
            if (ozelKarakterRegex.test(sifre)) puan += 1; else eksik_kosullar.push('Özel karakter (!@#$...).');

            let durum = CONFIG.UI_DURUMLARI.UYARI; 
            let sonucMetni = '';
            
            const eksik_metin = `<span style="font-size: 0.85em; font-weight: normal; color: var(--warn-color); display: block; margin-top: 5px;">**Eksik Kriterler:** ${eksik_kosullar.join(' ')}</span>`;
            
            // Nihai Güç Değerlendirmesi
            if (puan === 5 && sifre.length >= 12) { 
                durum = CONFIG.UI_DURUMLARI.BASARI; 
                sonucMetni = `💪 **MÜKEMMEL ŞİFRE GÜCÜ!** (Puan: ${puan}/5 - Uzunluk Onaylandı)`; 
            } else if (puan === 5 && sifre.length < 12) { 
                durum = CONFIG.UI_DURUMLARI.BASARI; 
                sonucMetni = `✅ **ÇOK GÜÇLÜ ŞİFRE.** (Tüm Kriterler Tamam. Puan: ${puan}/5). **İpucu:** Daha uzun olması (12+ hane) önerilir.`; 
            } else if (puan >= 3) { 
                durum = CONFIG.UI_DURUMLARI.UYARI; 
                sonucMetni = `⚠️ **ORTA DÜZEY ŞİFRE GÜCÜ.** (Puan: ${puan}/5). Lütfen eksik kriterleri tamamlayınız.<br>${eksik_metin}`; 
            } else { 
                durum = CONFIG.UI_DURUMLARI.HATA; 
                sonucMetni = `❌ **ZAYIF/KOLAY TAHMİN EDİLEBİLİR ŞİFRE.** (Puan: ${puan}/5). Güvenlik riskli.<br>${eksik_metin}`; 
            }
            
            return { sonucMetni: sonucMetni, durum: durum };
        },
        
        /**
         * Belirlenen uzunlukta rastgele, güçlü bir şifre üretir.
         * @returns {string} Üretilen şifre.
         */
        uret() {
            const uzunluk = parseInt(document.getElementById('sifre-uzunluk').value) || 12; 
            if (uzunluk < 8 || uzunluk > 30) return ''; // Güvenli uzunluk kısıtlaması
            
            const setler = CONFIG.SIFRE_KARAKTER_SETLERI;
            // Tüm karakter setlerini tek bir dizeye birleştir
            const tumKarakterler = setler.buyukHarf + setler.kucukHarf + setler.rakam + setler.ozelKarakter;
            let sifre = '';
            
            // Zorunlu Koşulları garanti altına al: Her tipten en az bir karakter
            sifre += setler.buyukHarf.charAt(Math.floor(Math.random() * setler.buyukHarf.length));
            sifre += setler.kucukHarf.charAt(Math.floor(Math.random() * setler.kucukHarf.length));
            sifre += setler.rakam.charAt(Math.floor(Math.random() * setler.rakam.length));
            sifre += setler.ozelKarakter.charAt(Math.floor(Math.random() * setler.ozelKarakter.length));
            
            // Kalan uzunluğu rastgele karakterlerle doldur
            for (let i = sifre.length; i < uzunluk; i++) { 
                sifre += tumKarakterler.charAt(Math.floor(Math.random() * tumKarakterler.length)); 
            }
            
            // Karıştırarak sırayı boz ve daha rastgele yap
            return sifre.split('').sort(() => 0.5 - Math.random()).join('');
        }
    }
    // Şifre Modülü Bitiş
};


// --- 4. KULLANICI ARAYÜZÜ (UI) YÖNETİM FONKSİYONLARI ---

/**
 * Geri dönüş sonucuna göre input ve sonuç kutucuklarını görsel olarak günceller.
 * @param {string} input_degeri - Kontrol edilen değer.
 * @param {{sonucMetni: string, durum: string}} sonuc - Algoritma kontrolünden dönen sonuç nesnesi.
 */
function updateUI(input_degeri, sonuc) {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');

    // Önceki sınıfları temizle
    inputElement.classList.remove('error-border', 'success-border', 'warn-border');
    sonucElement.className = '';
    
    // Sonuç metnini yerleştir
    sonucElement.innerHTML = sonuc.sonucMetni;

    // Duruma göre stil sınıfı ve input kenarını ayarla
    if (sonuc.durum === CONFIG.UI_DURUMLARI.HATA) {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else if (sonuc.durum === CONFIG.UI_DURUMLARI.BASARI) {
        sonucElement.classList.add('success-box');
        inputElement.classList.add('success-border');
    } else if (sonuc.durum === CONFIG.UI_DURUMLARI.UYARI) {
        sonucElement.classList.add('warn-box');
        inputElement.classList.add('warn-border');
    } else {
        // Varsayılan durum
        sonucElement.classList.add('default-box');
    }
}

/**
 * Ana Kontrol Tetikleyicisi. Proje seçimine göre ilgili algoritma modülünü çağırır.
 */
function calistirici() {
    const input_degeri = document.getElementById('input-alan').value.trim();
    const secim = document.getElementById('proje-secim').value;
    let sonuc = { sonucMetni: 'Lütfen doğru bir proje seçimi yapınız ve kontrol işlemine başlayınız.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };

    // Seçime göre ilgili modülün kontrol fonksiyonunu çağır
    switch (secim) {
        case 'vkn': 
            sonuc = Algoritma.vkn.kontrol(input_degeri); 
            break;
        case 'tckn': 
            sonuc = Algoritma.tckn.kontrol(input_degeri); 
            break;
        case 'kredi_karti': 
            sonuc = Algoritma.kredi_karti.kontrol(input_degeri); 
            break;
        case 'iban': 
            sonuc = Algoritma.iban.kontrol(input_degeri); 
            break;
        case 'telefon': 
            sonuc = Algoritma.telefon.kontrol(input_degeri); 
            break;
        case 'eposta': 
            sonuc = Algoritma.eposta.kontrol(input_degeri); 
            break;
        case 'sifre': 
            sonuc = Algoritma.sifre.kontrol(input_degeri); 
            break;
        default:
            // Geçersiz veya boş seçim
            sonuc = { sonucMetni: 'Lütfen listeden geçerli bir doğrulama projesi seçiniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            break;
    }

    // Arayüzü gelen sonuçla güncelle
    updateUI(input_degeri, sonuc);
}


// --- 5. ÜRETİM TETİKLEYİCİ FONKSİYONLARI ---

function vknUret() {
    const vkn = Algoritma.vkn.uret();
    document.getElementById('input-alan').value = vkn;
    updateUI(vkn, { sonucMetni: `🏢 **10 Haneli GEÇERLİ VKN ÜRETİLDİ.** Algoritmik Kontrol Başarılı!`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function tcknUret() {
    const tckn = Algoritma.tckn.uret();
    document.getElementById('input-alan').value = tckn;
    updateUI(tckn, { sonucMetni: `🇹🇷 **11 Haneli GEÇERLİ TCKN ÜRETİLDİ.** Doğrulama Kurallarına Uygun!`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function kartUret() {
    const kartNo = Algoritma.kredi_karti.uret();
    const kartMarkasi = Algoritma.kredi_karti.kartMarkasiBelirle(kartNo);
    document.getElementById('input-alan').value = kartNo;
    updateUI(kartNo, { sonucMetni: `💳 ${kartMarkasi} için **Luhn Geçerli Kart Üretildi.** (Doğrulama başarılı!)`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function ibanUret() {
    const iban = Algoritma.iban.uret();
    document.getElementById('input-alan').value = iban;
    updateUI(iban, { sonucMetni: `🏦 **26 Karakterli GEÇERLİ IBAN ÜRETİLDİ.** MOD 97 Kontrolünden Geçti!`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function telefonUret() {
    const numara = Algoritma.telefon.uret();
    const operatorSecim = document.getElementById('operator-secim').value;
    const operatorAdi = operatorSecim.charAt(0).toUpperCase() + operatorSecim.slice(1);
    document.getElementById('input-alan').value = numara;
    updateUI(numara, { sonucMetni: `📱 **10 Haneli GEÇERLİ NUMARA ÜRETİLDİ.** Operatör: **${operatorAdi}**.`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function epostaUret() {
    const eposta = Algoritma.eposta.uret();
    document.getElementById('input-alan').value = eposta;
    updateUI(eposta, { sonucMetni: `📧 **Rastgele GEÇERLİ E-POSTA ÜRETİLDİ.** Sözdizimi Kontrolü Tamamlandı!`, durum: CONFIG.UI_DURUMLARI.BASARI });
}

function sifreUret() {
    const sifre = Algoritma.sifre.uret();
    const kontrolSonucu = Algoritma.sifre.kontrol(sifre);
    document.getElementById('input-alan').value = sifre;
    // Üretilen şifrenin durumunu rapor et
    updateUI(sifre, { sonucMetni: `🔑 **Şifre Üretildi.** Sonuç: ${kontrolSonucu.sonucMetni}`, durum: kontrolSonucu.durum });
}

// --- 6. PROJE VE ARAYÜZ DURUM YÖNETİMİ ---

/**
 * Kredi kartı marka seçimine göre kart uzunluğunu ayarlar.
 */
function setUretimHedefi() {
    const markaSecim = document.getElementById('kart-marka-secim').value;
    const uzunlukSecimElementi = document.getElementById('kart-uzunluk-secim');
    let hedefUzunluk = 16;
    
    // Amex 15 hanedir, diğerleri genellikle 16.
    if (markaSecim === '3_15') {
        hedefUzunluk = 15;
    }
    uzunlukSecimElementi.value = hedefUzunluk;
    // Proje ayarları değiştiği için kontrolü tekrar tetikle
    calistirici(); 
}

/**
 * Proje seçimi değiştiğinde arayüzü resetler, input özelliklerini (max length, label) ayarlar
 * ve sadece ilgili üretim/opsiyon gruplarını gösterir.
 */
function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    const sonucElement = document.getElementById('sonuc');
    
    // a) Tüm opsiyonel grupları gizle (Genişletilmiş satır sayısı için detaylandırıldı)
    const gruplar = [
        'vkn-uretim-grup', 'tckn-uretim-grup', 'kredi-karti-grup', 'iban-uretim-grup', 
        'telefon-uretim-grup', 'eposta-uretim-grup', 'sifre-uretim-grup', 
        'kart-marka-secim-grup', 'kart-uzunluk-secim-grup', 'operator-secim-grup'
    ];
    gruplar.forEach(id => { 
        const el = document.getElementById(id); 
        if(el) el.style.display = 'none'; 
    });

    // b) Input alanını temizle ve sıfırla
    inputAlan.value = '';
    inputAlan.oninput = null; 
    inputAlan.maxLength = 50; 
    inputAlan.type = 'text'; 
    inputAlan.classList.remove('error-border', 'success-border', 'warn-border'); 
    sonucElement.className = '';
    sonucElement.innerHTML = 'Lütfen projenizi seçin ve ilk girişi yapınız...';
    
    let labelText = "Lütfen bir proje seçimi yapın:";
    let placeholderText = "";
    let maxLength = 50;
    let onInputFunc = null;

    // c) Seçime göre ilgili ayarları yapılandır
    if (secim === 'vkn') {
        document.getElementById('vkn-uretim-grup').style.display = 'flex';
        labelText = "Vergi Kimlik No'nun İlk 9 VEYA Tamamını (10 hane) Girin:";
        placeholderText = "9 hane tamamlama yapar, 10 hane doğrular (Sadece Rakam)";
        maxLength = 10;
        onInputFunc = function() { 
            this.value = this.value.replace(/[^0-9]/g, ''); 
            calistirici(); 
        };
    } else if (secim === 'tckn') {
        document.getElementById('tckn-uretim-grup').style.display = 'flex';
        labelText = "TC Kimlik No'nun İlk 9 VEYA Tamamını (11 hane) Girin:";
        placeholderText = "9 hane tamamlama yapar, 11 hane doğrular (Sadece Rakam)";
        maxLength = 11;
        onInputFunc = function() { 
            this.value = this.value.replace(/[^0-9]/g, ''); 
            calistirici(); 
        };
    } else if (secim === 'kredi_karti') {
        // Kart modülü için özel grup ayarları
        document.getElementById('kredi-karti-grup').style.display = 'flex';
        document.getElementById('kart-marka-secim-grup').style.display = 'flex';
        document.getElementById('kart-uzunluk-secim-grup').style.display = 'flex';
        
        const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
        labelText = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        placeholderText = `Tamamlama için ${hedefUzunluk - 1} hane girin. (Sadece Rakam)`;
        maxLength = 19; 
        onInputFunc = function() { 
            this.value = this.value.replace(/[^0-9]/g, ''); 
            calistirici(); 
        };
        setUretimHedefi(); // UI'ı yeni seçime göre güncelle
    } else if (secim === 'iban') {
        document.getElementById('iban-uretim-grup').style.display = 'flex'; 
        labelText = "IBAN'ı Girin (TR ile başlayan 26 karakter):";
        placeholderText = "Örnek: TRKKBBBBBRRRRCCCCCCCCCCCCCCCC (Harf ve Rakam)";
        maxLength = 26;
        onInputFunc = function() { 
            this.value = this.value.toUpperCase().replace(/[^0-9A-Z]/g, ''); 
            calistirici(); 
        }; 
    } else if (secim === 'telefon') {
        document.getElementById('telefon-uretim-grup').style.display = 'flex';
        document.getElementById('operator-secim-grup').style.display = 'flex';
        labelText = "Telefon Numarasını Girin (Örn: 5XX XXX XX XX - 10 Hane Kontrolü):";
        placeholderText = "Tüm formatlar desteklenir (05XX, +905XX vb.)";
        maxLength = 20; 
        onInputFunc = function() { 
            // Boşluklar, tireler vb. silinmez, temizleme fonksiyonda yapılır
            calistirici(); 
        }; 
    } else if (secim === 'eposta') {
        document.getElementById('eposta-uretim-grup').style.display = 'flex';
        labelText = "E-Posta Adresini Girin (Sözdizimi Kontrolü):";
        placeholderText = "ornek.kullanici@alanadi.com";
        maxLength = 100;
        onInputFunc = calistirici;
    } else if (secim === 'sifre') {
        document.getElementById('sifre-uretim-grup').style.display = 'flex';
        labelText = "Şifrenizi Girin (Güç Kontrolü):";
        placeholderText = "Güçlü şifre kurallarını karşılayınız.";
        maxLength = 50;
        onInputFunc = calistirici;
        inputAlan.type = 'password'; // Şifre girişi için
    }
    
    // d) Input özelliklerini uygula
    inputLabel.innerHTML = labelText;
    inputAlan.placeholder = placeholderText;
    inputAlan.maxLength = maxLength;
    inputAlan.oninput = onInputFunc;

    // Arayüzü ilk yüklemede güncelle
    calistirici(); 
}


// --- 7. BAŞLANGIÇ OLAY DİNLEYİCİSİ ---
// DOM yüklendiğinde arayüzü hazırlar.
document.addEventListener('DOMContentLoaded', resetAndChangeProject);