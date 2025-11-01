// =========================================================================
// == PROJE: ALGORİTMA DOĞRULAMA VE ÜRETİM ARACI (TÜM MODÜLLER VE PLAKA KISITLAMALARI)
// =========================================================================

// --- 1. GENEL PROJE YAPILANDIRMASI (CONFIG) ---
const CONFIG = {
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    
    SIFRE_KARAKTER_SETLERI: {
        buyukHarf: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        kucukHarf: 'abcdefghijklmnopqrstuvwxyz',
        rakam: '0123456789',
        ozelKarakter: '!@#$%^&*()_+~`|}{[]\:;?><,./-=' 
    },

    OPERATOR_KODLARI: {
        turkcell: [530, 531, 532, 533, 534, 535, 536, 537, 538, 539],
        vodafone: [540, 541, 542, 543, 544, 545, 546, 547, 548, 549],
        turktelekom: [501, 505, 506, 507, 550, 551, 552, 553, 554, 555, 558, 559]
    },

    KART_STANDARTLARI: {
        visa: { onEk: '4', uzunluk: 16 },
        mastercard: { onEk: '5', uzunluk: 16 },
        amex: { onEkler: ['34', '37'], uzunluk: 15 },
        troy: { onEk: '9792', uzunluk: 16 }
    },
    
    PLAKA_KODLARI: Array.from({ length: 81 }, (_, i) => (i + 1).toString().padStart(2, '0')),
    // GÜNCELLEME: Ç,Ş,İ,Ö,Ü,Ğ, Q, W, X harfleri plaka harf gruplarında kullanılmaz.
    YASAKLI_TURKCE_HARFLER: ['Ç', 'Ş', 'İ', 'Ö', 'Ü', 'Ğ', 'Q', 'W', 'X'], 
    YASAKLI_PLAKA_KELIMELER: ['KEL', 'LAN', 'NAH', 'APO', 'PKK', 'MAL', 'LEN', 'APP'], 

    UI_DURUMLARI: {
        HATA: 'error',
        BASARI: 'success',
        UYARI: 'warn',
        VARSAYILAN: 'default'
    }
};


// --- 2. TEMEL YARDIMCI (UTILITY) FONKSİYONLAR ---

function rastgeleSayiUret(uzunluk, ilkHaneSifirOlamaz = false) {
    let numara = '';
    for (let i = 0; i < uzunluk; i++) {
        let rakam = Math.floor(Math.random() * 10);
        if (i === 0 && ilkHaneSifirOlamaz && uzunluk > 1) { 
            rakam = Math.floor(Math.random() * 9) + 1; 
        }
        numara += rakam;
    }
    return numara;
}

function rastgeleKarakterUret(uzunluk) {
    const karakterler = 'abcdefghijklmnopqrstuvwxyz0123456789'; 
    let sonuc = '';
    for (let i = 0; i < uzunluk; i++) {
        sonuc += karakterler.charAt(Math.floor(Math.random() * karakterler.length));
    }
    return sonuc;
}

function rastgeleHarfUret(uzunluk) { // Yasaklı Türkçe Harfleri ve Q,W,X'i İçermez
    const yasakli = CONFIG.YASAKLI_TURKCE_HARFLER;
    let karakterler = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    
    // Yasaklı harfleri listeden filtreleyip çıkarır.
    karakterler = karakterler.split('').filter(char => !yasakli.includes(char)).join('');
    
    let sonuc = '';
    for (let i = 0; i < uzunluk; i++) {
        sonuc += karakterler.charAt(Math.floor(Math.random() * karakterler.length));
    }
    return sonuc;
}

function hesaplaLuhnKontrolHaneyi(numara) {
    let gecici_numara = numara + '0';
    let toplam = 0;
    let cift_hane = false; 

    for (let i = gecici_numara.length - 1; i >= 0; i--) {
        let rakam = parseInt(gecici_numara.charAt(i), 10);

        if (cift_hane) {
            rakam *= 2;
            if (rakam > 9) rakam -= 9; 
        }
        toplam += rakam;
        cift_hane = !cift_hane; 
    }
    return (10 - (toplam % 10)) % 10;
}

function convertLettersToNumbers(str) {
    return str.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            return (char.charCodeAt(0) - 'A'.charCodeAt(0) + 10).toString();
        }
        return char; 
    }).join('');
}

function panoyaKopyala(metin) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern Tarayıcılar (HTTPS veya Localhost)
        navigator.clipboard.writeText(metin).then(() => {
            // Başarılı kopyalama logu (konsolda görünür)
        }).catch(err => {
            console.error("Panoya kopyalama hatası (navigator.clipboard): ", err);
        });
        return true;
    } else {
        // Eski yöntem (Geriye dönük uyumluluk)
        const textArea = document.createElement("textarea");
        textArea.value = metin;
        textArea.style.position = "fixed"; 
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}


// --- 3. ANA ALGORİTMA NESNESİ (MODÜLER YAPI) ---
const Algoritma = {

    // --- VKN MODÜLÜ ---
    vkn: {
        kontrolBasamagiHesapla(ilk_9_hane) {
            let V = [];
            for (let i = 0; i < 9; i++) {
                const di = parseInt(ilk_9_hane.charAt(i), 10);
                const j = 9 - i; 
                let temp = (di + j) % 10;
                let v_i = (temp * Math.pow(2, j)) % 9;
                if (temp !== 0 && v_i === 0) {
                    v_i = 9;
                }
                V[i] = v_i;
            }
            const toplam = V.reduce((a, b) => a + b, 0);
            let kontrol_basamagi = toplam % 10;
            return kontrol_basamagi === 0 ? 0 : (10 - kontrol_basamagi) % 10;
        },

        kontrol(vkn_str) {
            const uzunluk = vkn_str.length;
            if (uzunluk === 0) return { sonucMetni: '⚠️ VKN Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk < 9) return { sonucMetni: `⌛ VKN Tamamlama İşlemi İçin **${9 - uzunluk} hane** daha girmeniz gerekmektedir.`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > 10) return { sonucMetni: '❌ Hata: Vergi Kimlik Numarası 10 haneden fazla olamaz.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(vkn_str)) return { sonucMetni: '❌ Hata: VKN sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };

            const ilk_9_hane = vkn_str.substring(0, 9);
            const hesaplanan_kontrol = Algoritma.vkn.kontrolBasamagiHesapla(ilk_9_hane);

            if (uzunluk === 9) {
                const tamamlanmis_vkn = ilk_9_hane + String(hesaplanan_kontrol);
                return { sonucMetni: `➡️ **TAMAMLANMIŞ VKN:** <span style="color: var(--primary-color); font-weight: bold;">${tamamlanmis_vkn}</span> (Hesaplanan Kontrol Basamagi: ${hesaplanan_kontrol})`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }

            const girilen_kontrol = parseInt(vkn_str.charAt(9));
            if (girilen_kontrol === hesaplanan_kontrol) {
                return { sonucMetni: `✅ Vergi Kimlik Numarası Algoritmayi Başarıyla Geçti! **(Doğruluk Onaylandi)**`, durum: CONFIG.UI_DURUMLARI.BASARI };
            } else {
                const dogru_vkn = ilk_9_hane + String(hesaplanan_kontrol);
                return { sonucMetni: `❌ VKN Doğrulama Başarısız. Girilen: ${vkn_str}. **Doğru VKN:** ${dogru_vkn}. (Kontrol Basamağı ${girilen_kontrol} yerine ${hesaplanan_kontrol} olmalıydı.)`, durum: CONFIG.UI_DURUMLARI.HATA };
            }
        },

        uret() {
            const ilk_9_hane = rastgeleSayiUret(9);
            const kontrol_hanesi = Algoritma.vkn.kontrolBasamagiHesapla(ilk_9_hane);
            return ilk_9_hane + String(kontrol_hanesi);
        }
    },
    
    // --- TCKN MODÜLÜ ---
    tckn: {
        kontrolBasamagiHesapla(ilk_9_hane) {
            const rakamlar = ilk_9_hane.split('').map(Number);
            let tek_toplam = 0, cift_toplam = 0;
            
            for (let i = 0; i < 9; i++) {
                if ((i + 1) % 2 === 1) {
                    tek_toplam += rakamlar[i]; 
                } else {
                    cift_toplam += rakamlar[i]; 
                }
            }
            
            const kontrol_farki = (tek_toplam * 7) - cift_toplam;
            const hane_10 = (kontrol_farki % 10 + 10) % 10; 
            
            const ilk_10_toplam = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + hane_10;
            const hane_11 = ilk_10_toplam % 10;

            return { hane_10, hane_11 };
        },

        kontrol(tckn_str) {
            const uzunluk = tckn_str.length;
            if (uzunluk === 0) return { sonucMetni: '⚠️ TCKN Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk < 9) return { sonucMetni: `⌛ TCKN Tamamlama İçin **${9 - uzunluk} hane** daha girmeniz gerekmektedir.`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > 11) return { sonucMetni: '❌ Hata: TCKN 11 haneden fazla olamaz.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (tckn_str.charAt(0) === '0') return { sonucMetni: "❌ Hata: T.C. Kimlik Numarası'nın ilk hanesi sıfır ('0') olamaz.", durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(tckn_str)) return { sonucMetni: '❌ Hata: TCKN sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };


            const ilk_9_hane = tckn_str.substring(0, 9);
            const { hane_10, hane_11 } = Algoritma.tckn.kontrolBasamagiHesapla(ilk_9_hane);

            if (uzunluk === 9) {
                const tamamlanmis_tckn = ilk_9_hane + String(hane_10) + String(hane_11);
                return { sonucMetni: `➡️ **TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color); font-weight: bold;">${tamamlanmis_tckn}</span> (Kontrol Haneleri: ${hane_10} ve ${hane_11})`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }

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

        uret() {
            const ilk_9_hane = rastgeleSayiUret(1, true) + rastgeleSayiUret(8); 
            const { hane_10, hane_11 } = Algoritma.tckn.kontrolBasamagiHesapla(ilk_9_hane);
            return ilk_9_hane + String(hane_10) + String(hane_11);
        }
    },

    // --- KREDİ KARTI MODÜLÜ ---
    kredi_karti: {
        kartMarkasiBelirle(kart_no) {
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.visa.onEk)) return 'Visa 🛡️';
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.mastercard.onEk)) return 'Mastercard 💳';
            if (CONFIG.KART_STANDARTLARI.amex.onEkler.some(prefix => kart_no.startsWith(prefix))) return 'American Express (Amex) ✈️';
            if (kart_no.startsWith(CONFIG.KART_STANDARTLARI.troy.onEk)) return 'Troy 🇹🇷';
            return 'Bilinmeyen Kart Türü';
        },
        
        kontrol(kart_no) {
            kart_no = kart_no.replace(/\s/g, ''); 
            const uzunluk = kart_no.length;
            const kart_markasi = Algoritma.kredi_karti.kartMarkasiBelirle(kart_no);
            const hedef_uzunluk = parseInt(document.getElementById('kart-uzunluk-secim').value, 10);
            
            if (uzunluk === 0) return { sonucMetni: '⚠️ Kart Kontrolü İçin Lütfen haneleri girmeye başlayınız...', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > hedef_uzunluk) return { sonucMetni: `❌ Hata: Girdiğiniz hane sayısı (${uzunluk}), seçilen (${hedef_uzunluk}) haneden fazladır.`, durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^\d+$/.test(kart_no)) return { sonucMetni: '❌ Hata: Kart numarası sadece sayısal karakterler içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };

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

            if (uzunluk === hedef_uzunluk - 1) { 
                const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(kart_no);
                const tamamlanmis_kart = kart_no + kontrol_hanesi;
                return { sonucMetni: `➡️ Marka: ${kart_markasi}. **Eksik Son Hane Tamamlandı:** ${kontrol_hanesi}. Tamamı: <span style="font-weight: bold;">${tamamlanmis_kart}</span>`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }
            
            if (uzunluk === hedef_uzunluk) {
                const toplam = hesaplaLuhnToplami(kart_no);
                if (toplam % 10 === 0) { 
                    return { sonucMetni: `✅ Kart Numarası (${kart_markasi}) **Luhn Algoritmasını BAŞARIYLA GEÇTİ!** (Toplam Mod 10 = 0)`, durum: CONFIG.UI_DURUMLARI.BASARI }; 
                } else { 
                    return { sonucMetni: `❌ Kart Numarası (${kart_markasi}) Luhn Algoritmasında BAŞARISIZ. (Toplam Mod 10 = ${toplam % 10}, 0 olmalıydı.)`, durum: CONFIG.UI_DURUMLARI.HATA }; 
                }
            }

            return { sonucMetni: `⌛ Kartı tamamlamak için **${hedef_uzunluk - uzunluk} hane** girmelisiniz. Marka Tespiti: ${kart_markasi}`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
        },

        uret() {
            const secim = document.getElementById('kart-marka-secim').value;
            let on_ek, hedef_uzunluk;
            
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
            
            const hesap_numarasi_uzunlugu = hedef_uzunluk - on_ek.length - 1; 
            let gecici_numara = on_ek + rastgeleSayiUret(hesap_numarasi_uzunlugu);
            
            const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(gecici_numara);
            return gecici_numara + kontrol_hanesi;
        }
    },

    // --- IBAN MODÜLÜ (MOD 97 VE TAMAMLAMA) ---
    iban: {
        kontrol(iban_str) {
            iban_str = iban_str.toUpperCase().replace(/\s/g, ''); 
            const uzunluk = iban_str.length;
            
            if (uzunluk === 0) return { sonucMetni: '⚠️ IBAN Kontrolü İçin Lütfen karakterleri girmeye başlayınız.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk > 26) return { sonucMetni: '❌ Hata: Türkiye IBAN\'ı 26 karakterden fazla olamaz.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (!iban_str.startsWith('TR')) return { sonucMetci: '❌ Hata: Türkiye IBAN numarası zorunlu olarak "TR" ülke kodu ile başlamalıdır.', durum: CONFIG.UI_DURUMLARI.HATA };
            if (!/^[0-9A-Z]+$/.test(iban_str)) return { sonucMetni: '❌ Hata: IBAN sadece sayı ve büyük harf içermelidir.', durum: CONFIG.UI_DURUMLARI.HATA };

            if (uzunluk < 4) return { sonucMetni: `⌛ IBAN Tamamlama İçin İlk 4 karakteri (TR ve Kontrol Haneleri) giriniz.`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            
            const gerekli_bb_uzunlugu = 22; 

            // --- IBAN TAMAMLAMA LOGİĞİ (24. Hane Kontrolü) ---
            if (uzunluk === gerekli_bb_uzunlugu + 2) { 
                const kontrolsuz_iban = iban_str.substring(0, 2) + '00' + iban_str.substring(4);
                const duzenlenmis_iban = kontrolsuz_iban.substring(4) + kontrolsuz_iban.substring(0, 4); 
                const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
                
                let kalan = 0;
                for (let i = 0; i < sayisal_iban.length; i++) { 
                    kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97; 
                }
                
                let kontrol_basamagi = 98 - kalan;
                let kontrol_str = kontrol_basamagi.toString().padStart(2, '0');
                
                const tamamlanmis_iban = iban_str.substring(0, 2) + kontrol_str + iban_str.substring(4);
                
                return { sonucMetni: `➡️ **TAMAMLANMIŞ IBAN:** <span style="color: var(--primary-color); font-weight: bold;">${tamamlanmis_iban}</span> (Hesaplanan Kontrol Haneleri: ${kontrol_str})`, durum: CONFIG.UI_DURUMLARI.BASARI };
            }

            // --- TAM IBAN DOĞRULAMA LOGİĞİ (26 HANE KONTROLÜ) ---
            if (uzunluk === 26) {
                const duzenlenmis_iban = iban_str.substring(4) + iban_str.substring(0, 4); 
                const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
                
                let kalan = 0;
                for (let i = 0; i < sayisal_iban.length; i++) { 
                    kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97; 
                }

                if (kalan === 1) { 
                    return { sonucMetni: '✅ IBAN, Uluslararası MOD 97 Kontrolünden **BAŞARIYLA GEÇTİ!** (Kalan 1)', durum: CONFIG.UI_DURUMLARI.BASARI }; 
                } else { 
                    const hesaplanan_kontrol = (98 - kalan).toString().padStart(2, '0');
                    return { sonucMetni: `❌ IBAN, MOD 97 Kontrolünde BAŞARISIZ. (Kalan ${kalan}, 1 olmalıydı.) **Doğru Kontrol Haneleri:** ${hesaplanan_kontrol}`, durum: CONFIG.UI_DURUMLARI.HATA }; 
                }
            }

            const eksikHane = 26 - uzunluk;
            return { sonucMetni: `⌛ IBAN'ı kontrol etmek veya tamamlamak için **${eksikHane} hane** daha girmelisiniz. (Toplam 26 hane)`, durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
        },

        uret() {
            const ulke_kodu = 'TR'; 
            const banka_kodu = rastgeleSayiUret(5); 
            const rezerv_alan = '0'; 
            
            const hesap_no_ilk_2 = rastgeleSayiUret(2); 
            const hesap_numarasi = hesap_no_ilk_2 + rastgeleSayiUret(14); 
            
            let hesaplama_parcasi = banka_kodu + rezerv_alan + hesap_numarasi + ulke_kodu + '00';
            const sayisal_iban = convertLettersToNumbers(hesaplama_parcasi);
            
            let kalan = 0;
            for (let i = 0; i < sayisal_iban.length; i++) { 
                kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97; 
            }
            
            let kontrol_basamagi = 98 - kalan;
            let kontrol_str = kontrol_basamagi.toString().padStart(2, '0'); 
            
            const tam_iban = ulke_kodu + kontrol_str + banka_kodu + rezerv_alan + hesap_numarasi;
            if (tam_iban.length !== 26) {
                 console.error("HATA: Üretilen IBAN 26 hane değil!");
                 return "IBAN Üretim Hatası (Uzunluk)";
            }

            return tam_iban;
        }
    },
    
    // --- TELEFON MODÜLÜ ---
    telefon: {
        numarayiTemizle(numara_str) {
            let temiz_numara = numara_str.replace(/[^0-9]/g, ''); 
            if (temiz_numara.startsWith('90')) {
                temiz_numara = temiz_numara.substring(2);
            }
            if (temiz_numara.startsWith('0')) {
                temiz_numara = temiz_numara.substring(1);
            }
            return temiz_numara.substring(0, 10);
        },

        operatorBelirle(alan_kodu) {
            const kodlar = CONFIG.OPERATOR_KODLARI;
            for (const operator in kodlar) {
                if (kodlar[operator].includes(parseInt(alan_kodu))) {
                    return operator.charAt(0).toUpperCase() + operator.slice(1);
                }
            }
            return 'Bilinmiyor';
        },

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

        uret() {
            const operatorSecim = document.getElementById('operator-secim').value;
            const kodListesi = CONFIG.OPERATOR_KODLARI[operatorSecim];
            if (!kodListesi) return '';

            const rastgeleKod = kodListesi[Math.floor(Math.random() * kodListesi.length)];
            const son_7_hane = rastgeleSayiUret(7);
            const uretilen_numara = String(rastgeleKod) + son_7_hane;
            
            return `${uretilen_numara.substring(0, 3)} ${uretilen_numara.substring(3, 6)} ${uretilen_numara.substring(6, 8)} ${uretilen_numara.substring(8, 10)}`;
        }
    },
    
    // --- E-POSTA MODÜLÜ ---
    eposta: {
        kontrol(eposta_str) {
            if (eposta_str.length === 0) return { sonucMetni: '⚠️ E-Posta Kontrolü İçin Lütfen bir adres giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            const dogrulama_basarili = CONFIG.EMAIL_REGEX.test(eposta_str.toLowerCase());
            
            if (dogrulama_basarili) { 
                return { sonucMetni: `✅ E-Posta adresi sözdizimi **Uluslararası RFC standartlarına** uygun görünmektedir.`, durum: CONFIG.UI_DURUMLARI.BASARI }; 
            } else { 
                return { sonucMetni: `❌ E-Posta sözdizimi kurallarına uymuyor. Lütfen **@** ve **alan adı** (örn: .com) kontrolünü yapınız.`, durum: CONFIG.UI_DURUMLARI.HATA }; 
            }
        },
        
        uret() {
            const popüler_alanlar = ['gmail.com', 'hotmail.com.tr', 'yandex.com', 'yahoo.com', 'outlook.com', 'mail.com', 'mycorp.org', 'bireysel.net'];
            const kullanici_adi = rastgeleKarakterUret(Math.floor(Math.random() * 5) + 5); 
            const alan_adi = popüler_alanlar[Math.floor(Math.random() * popüler_alanlar.length)];
            return `${kullanici_adi}_${rastgeleSayiUret(2)}@${alan_adi}`;
        }
    },
    
    // --- ŞİFRE MODÜLÜ ---
    sifre: {
        kontrol(sifre) {
            if (sifre.length === 0) return { sonucMetni: '⚠️ Şifre Güç Kontrolü İçin Lütfen bir şifre giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            
            let puan = 0;
            let eksik_kosullar = [];
            const min_uzunluk = 8;
            
            if (sifre.length >= min_uzunluk) puan += 1; else eksik_kosullar.push(`Min. ${min_uzunluk} karakter.`);
            if (/[A-Z]/.test(sifre)) puan += 1; else eksik_kosullar.push('Büyük harf (A-Z).');
            if (/[a-z]/.test(sifre)) puan += 1; else eksik_kosullar.push('Küçük harf (a-z).');
            if (/[0-9]/.test(sifre)) puan += 1; else eksik_kosullar.push('Rakam (0-9).');
            
            const ozelKarakterSeti = CONFIG.SIFRE_KARAKTER_SETLERI.ozelKarakter;
            const ozelKarakterRegex = new RegExp(`[${ozelKarakterSeti.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`);
            if (ozelKarakterRegex.test(sifre)) puan += 1; else eksik_kosullar.push('Özel karakter (!@#$...).');

            let durum = CONFIG.UI_DURUMLARI.UYARI; 
            let sonucMetni = '';
            
            const eksik_metin = `<span style="font-size: 0.85em; font-weight: normal; color: var(--warn-color); display: block; margin-top: 5px;">**Eksik Kriterler:** ${eksik_kosullar.join(' ')}</span>`;
            
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
        
        uret() {
            const uzunluk = parseInt(document.getElementById('sifre-uzunluk').value) || 12; 
            if (uzunluk < 8 || uzunluk > 30) return ''; 
            
            const setler = CONFIG.SIFRE_KARAKTER_SETLERI;
            const tumKarakterler = setler.buyukHarf + setler.kucukHarf + setler.rakam + setler.ozelKarakter;
            let sifre = '';
            
            sifre += setler.buyukHarf.charAt(Math.floor(Math.random() * setler.buyukHarf.length));
            sifre += setler.kucukHarf.charAt(Math.floor(Math.random() * setler.kucukHarf.length));
            sifre += setler.rakam.charAt(Math.floor(Math.random() * setler.rakam.length));
            sifre += setler.ozelKarakter.charAt(Math.floor(Math.random() * setler.ozelKarakter.length));
            
            for (let i = sifre.length; i < uzunluk; i++) { 
                sifre += tumKarakterler.charAt(Math.floor(Math.random() * tumKarakterler.length)); 
            }
            
            return sifre.split('').sort(() => 0.5 - Math.random()).join('');
        }
    },
    
    // --- PLAKA MODÜLÜ ---
    plaka: {
        
        plakaHarfKontrol(harf_grubu) {
            // Yasaklı Türkçe harfleri ve standart dışı Q, W, X'i kontrol et
            for (const yasakliHarf of CONFIG.YASAKLI_TURKCE_HARFLER) {
                if (harf_grubu.includes(yasakliHarf)) {
                    return { hata: true, mesaj: `❌ Plakada Yasaklı Harf Tespiti. (**${yasakliHarf}**) kullanılamaz. (Türkçe karakter veya Q, W, X)` };
                }
            }
            
            // Yasaklı kelimeleri kontrol et (KEL, LAN, APO vb.)
            for (const yasakliKelime of CONFIG.YASAKLI_PLAKA_KELIMELER) {
                if (harf_grubu.includes(yasakliKelime)) {
                    return { hata: true, mesaj: `❌ Yasaklı Kelime: **${yasakliKelime}** harf dizisi plakada bulunamaz.` };
                }
            }
            
            return { hata: false };
        },
        
        kontrol(plaka_str) {
            plaka_str = plaka_str.toUpperCase().replace(/[^0-9A-Z]/g, ''); 
            const uzunluk = plaka_str.length;

            if (uzunluk === 0) return { sonucMetni: '⚠️ Plaka Kontrolü İçin Lütfen numarayı giriniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            if (uzunluk < 7 || uzunluk > 8) return { sonucMetni: `❌ Plaka Format Hatası: Türkiye plakaları **7 veya 8 karakterden** oluşmalıdır (İl kodu dahil). Girilen: ${uzunluk} hane.`, durum: CONFIG.UI_DURUMLARI.HATA };
            
            const il_kodu = plaka_str.substring(0, 2);
            if (!CONFIG.PLAKA_KODLARI.includes(il_kodu)) {
                return { sonucMetni: `❌ Şehir Kodu Hatası: Plaka ilk iki hanesi (${il_kodu}), geçerli bir İl Kodu (01-81) değildir.`, durum: CONFIG.UI_DURUMLARI.HATA };
            }

            const harf_grup_regex_match = plaka_str.substring(2).match(/([A-Z]+)(\d+)/);
            if (!harf_grup_regex_match || harf_grup_regex_match.length < 3) {
                 return { sonucMetni: `❌ Plaka Numarası Geçersiz Format. İl Kodu doğru, ancak harf/rakam dizilimi hatalı. Örn: 34ABC123`, durum: CONFIG.UI_DURUMLARI.HATA };
            }
            
            const harf_grubu = harf_grup_regex_match[1];
            const rakam_grubu = harf_grup_regex_match[2];
            
            // 1. KONTROL: Yasaklı Harf ve Kelime Kontrolü
            const harfKontrolSonucu = Algoritma.plaka.plakaHarfKontrol(harf_grubu);
            if (harfKontrolSonucu.hata) {
                return { sonucMetni: harfKontrolSonucu.mesaj, durum: CONFIG.UI_DURUMLARI.HATA };
            }
            
            // 2. KONTROL: Format Kısıtlamaları (Harf Uzunluğuna Göre Rakam Uzunluğu)
            const harf_uzunluk = harf_grubu.length;
            const rakam_uzunluk = rakam_grubu.length;
            const toplam_uzunluk_kontrol_parcasi = harf_uzunluk + rakam_uzunluk; // İl kodu hariç

            // 7 Karakterli (5 hane Kontrol Parçası) Formatlar:
            if (uzunluk === 7) { 
                if (toplam_uzunluk_kontrol_parcasi === 5) {
                    // 1 Harf + 4 Rakam (Örn: 34 A 1234) VEYA 3 Harf + 2 Rakam (Örn: 34 ABC 12)
                    if ( (harf_uzunluk === 1 && rakam_uzunluk === 4) || (harf_uzunluk === 3 && rakam_uzunluk === 2) ) {
                        return { sonucMetni: `✅ Plaka Numarası **Geçerli 7 Karakterli Format** kurallarına uymaktadır. **İl Kodu:** ${il_kodu}`, durum: CONFIG.UI_DURUMLARI.BASARI };
                    }
                }
            } 
            // 8 Karakterli (6 hane Kontrol Parçası) Formatlar:
            else if (uzunluk === 8) {
                if (toplam_uzunluk_kontrol_parcasi === 6) {
                    // 2 Harf + 4 Rakam (Örn: 34 AB 1234) VEYA 3 Harf + 3 Rakam (Örn: 34 ABC 123)
                    if ( (harf_uzunluk === 2 && rakam_uzunluk === 4) || (harf_uzunluk === 3 && rakam_uzunluk === 3) ) {
                        return { sonucMetni: `✅ Plaka Numarası **Geçerli 8 Karakterli Format** kurallarına uymaktadır. **İl Kodu:** ${il_kodu}`, durum: CONFIG.UI_DURUMLARI.BASARI };
                    }
                }
            }
            
            // Eğer yukarıdaki özel 7 veya 8 hane kombinasyonlarına uymazsa:
            return { 
                sonucMetni: `❌ Plaka Formatı Uyumsuz. İl kodu hariç **${toplam_uzunluk_kontrol_parcasi}** hane var. Format: ${harf_uzunluk} Harf + ${rakam_uzunluk} Rakam. Standartlar 7 veya 8 toplam hane gerektirir.`, 
                durum: CONFIG.UI_DURUMLARI.HATA 
            };
        },

        uret() {
            const rastgele_il = CONFIG.PLAKA_KODLARI[Math.floor(Math.random() * CONFIG.PLAKA_KODLARI.length)];
            
            // Plaka formatını seç (1: 7 hane, 2: 8 hane)
            const format_tipi = Math.random() < 0.5 ? 7 : 8; 
            
            let harf_uzunluk, rakam_uzunluk;

            if (format_tipi === 7) {
                // 7 Hane (İl kodu hariç 5 hane): (1 Harf + 4 Rakam) VEYA (3 Harf + 2 Rakam)
                if (Math.random() < 0.5) {
                    harf_uzunluk = 1; rakam_uzunluk = 4; // 34 A 1234
                } else {
                    harf_uzunluk = 3; rakam_uzunluk = 2; // 34 ABC 12
                }
            } else { // 8 Hane
                // 8 Hane (İl kodu hariç 6 hane): (2 Harf + 4 Rakam) VEYA (3 Harf + 3 Rakam)
                if (Math.random() < 0.5) {
                    harf_uzunluk = 2; rakam_uzunluk = 4; // 34 AB 1234
                } else {
                    harf_uzunluk = 3; rakam_uzunluk = 3; // 34 ABC 123
                }
            }
            
            let harf_grup;
            let deneme_sayisi = 0;
            do {
                harf_grup = rastgeleHarfUret(harf_uzunluk);
                deneme_sayisi++;
            } while (CONFIG.YASAKLI_PLAKA_KELIMELER.some(kelime => harf_grup.includes(kelime)) && deneme_sayisi < 10);
            
            const rakam_grup = rastgeleSayiUret(rakam_uzunluk);
            
            const uretilen_plaka = `${rastgele_il} ${harf_grup} ${rakam_grup}`;
            return uretilen_plaka.toUpperCase();
        }
    }
};


// --- 4. KULLANICI ARAYÜZÜ (UI) YÖNETİM FONKSİYONLARI ---

function updateUI(input_degeri, sonuc) {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');

    inputElement.classList.remove('error-border', 'success-border', 'warn-border');
    sonucElement.className = '';
    
    sonucElement.innerHTML = sonuc.sonucMetni;

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
        sonucElement.classList.add('default-box');
    }
}

function calistirici() {
    const input_degeri = document.getElementById('input-alan').value.trim();
    const secim = document.getElementById('proje-secim').value;
    let sonuc = { sonucMetni: 'Lütfen doğru bir proje seçimi yapınız ve kontrol işlemine başlayınız.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };

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
        case 'plaka':
            sonuc = Algoritma.plaka.kontrol(input_degeri);
            break;
        default:
            sonuc = { sonucMetni: 'Lütfen listeden geçerli bir doğrulama projesi seçiniz.', durum: CONFIG.UI_DURUMLARI.VARSAYILAN };
            break;
    }

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
    
    let kopyalamaDurumu = panoyaKopyala(sifre);

    let sonucMetni = kontrolSonucu.sonucMetni;
    if (kopyalamaDurumu) {
         sonucMetni = `🔑 **Şifre Üretildi ve Panoya Kopyalandı.** Sonuç: ${kontrolSonucu.sonucMetni}`;
    } else {
         sonucMetni = `🔑 **Şifre Üretildi.** Kopyalanamadı, lütfen manuel kopyalayın. Sonuç: ${kontrolSonucu.sonucMetni}`;
    }
    
    updateUI(sifre, { sonucMetni: sonucMetni, durum: kontrolSonucu.durum });
}

function plakaUret() {
    const plaka = Algoritma.plaka.uret();
    document.getElementById('input-alan').value = plaka;
    updateUI(plaka, { sonucMetni: `🚘 **Rastgele GEÇERLİ Plaka Üretildi.** (Format: ${plaka})`, durum: CONFIG.UI_DURUMLARI.BASARI });
}


// --- 6. PROJE VE ARAYÜZ DURUM YÖNETİMİ ---

function setUretimHedefi() {
    const markaSecim = document.getElementById('kart-marka-secim').value;
    const uzunlukSecimElementi = document.getElementById('kart-uzunluk-secim');
    let hedefUzunluk = 16;
    
    if (markaSecim === '3_15') {
        hedefUzunluk = 15;
    }
    uzunlukSecimElementi.value = hedefUzunluk;
    calistirici(); 
}

function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    const sonucElement = document.getElementById('sonuc');
    
    const gruplar = [
        'vkn-uretim-grup', 'tckn-uretim-grup', 'kredi-karti-grup', 'iban-uretim-grup', 
        'telefon-uretim-grup', 'eposta-uretim-grup', 'sifre-uretim-grup', 'plaka-uretim-grup', 
        'kart-marka-secim-grup', 'kart-uzunluk-secim-grup', 'operator-secim-grup'
    ];
    gruplar.forEach(id => { 
        const el = document.getElementById(id); 
        if(el) el.style.display = 'none'; 
    });

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
    let onInputFunc = calistirici; 

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
        setUretimHedefi(); 
    } else if (secim === 'iban') {
        document.getElementById('iban-uretim-grup').style.display = 'flex'; 
        labelText = "IBAN'ı Girin (TR ile başlayan 26 karakter):";
        placeholderText = "24 hane (TR + 22 karakter) tamamlama yapar. (Harf ve Rakam)";
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
        onInputFunc = calistirici; 
    } else if (secim === 'eposta') {
        document.getElementById('eposta-uretim-grup').style.display = 'flex';
        labelText = "E-Posta Adresini Girin (Sözdizimi Kontrolü):";
        placeholderText = "ornek.kullanici@alanadi.com";
        maxLength = 100;
    } else if (secim === 'sifre') {
        document.getElementById('sifre-uretim-grup').style.display = 'flex';
        labelText = "Şifrenizi Girin (Güç Kontrolü):";
        placeholderText = "Güçlü şifre kurallarını karşılayınız.";
        maxLength = 50;
        inputAlan.type = 'password'; 
    } else if (secim === 'plaka') {
        document.getElementById('plaka-uretim-grup').style.display = 'flex';
        labelText = "Türkiye Plaka Numarasını Girin (Örn: 34 ABC 123):";
        placeholderText = "Boşluklu veya boşluksuz girebilirsiniz. (7-8 hane kontrolü yapılır)";
        maxLength = 12; 
        onInputFunc = function() { 
            this.value = this.value.toUpperCase(); 
            calistirici(); 
        };
    }
    
    inputLabel.innerHTML = labelText;
    inputAlan.placeholder = placeholderText;
    inputAlan.maxLength = maxLength;
    inputAlan.oninput = onInputFunc;

    calistirici(); 
}

// --- 7. BAŞLANGIÇ OLAY DİNLEYİCİSİ ---
document.addEventListener('DOMContentLoaded', resetAndChangeProject);