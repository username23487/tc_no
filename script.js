// --- YARDIMCI FONKSİYONLAR ---

/**
 * Rastgele basamaklar üretir.
 * @param {number} uzunluk - Üretilecek rakam sayısı.
 * @param {boolean} [ilkHaneSifirOlamaz=false] - İlk hanenin 1-9 arasında olmasını sağlar (TCKN için).
 */
function rastgeleSayiUret(uzunluk, ilkHaneSifirOlamaz = false) {
    let numara = '';
    for (let i = 0; i < uzunluk; i++) {
        let rakam = Math.floor(Math.random() * 10);
        // İlk hane için özel kontrol
        if (i === 0 && ilkHaneSifirOlamaz) {
            rakam = Math.floor(Math.random() * 9) + 1; // 1'den 9'a kadar
        }
        numara += rakam;
    }
    return numara;
}

/**
 * Belirtilen uzunlukta rastgele harf ve rakamlardan oluşan bir string üretir.
 */
function rastgeleKarakterUret(uzunluk) {
    const karakterler = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let sonuc = '';
    for (let i = 0; i < uzunluk; i++) {
        sonuc += karakterler.charAt(Math.floor(Math.random() * karakterler.length));
    }
    return sonuc;
}

/**
 * Luhn Algoritması Temel Hesaplama Fonksiyonu (Kontrol Hanesi).
 */
function hesaplaLuhnKontrolHaneyi(numara) {
    let gecici_numara = numara + '0';
    let toplam = 0;
    let cift_hane = false; 

    for (let i = gecici_numara.length - 1; i >= 0; i--) {
        let rakam = parseInt(gecici_numara.charAt(i), 10);

        if (cift_hane) {
            rakam *= 2;
            if (rakam > 9) {
                rakam -= 9;
            }
        }
        toplam += rakam;
        cift_hane = !cift_hane;
    }
    
    // Luhn kontrol hanesi
    return (10 - (toplam % 10)) % 10;
}

/**
 * IBAN Mod 97 için harfleri sayısal değere çevirir (A=10, B=11, ... Z=35).
 */
function convertLettersToNumbers(str) {
    return str.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            return (char.charCodeAt(0) - 'A'.charCodeAt(0) + 10).toString();
        }
        return char;
    }).join('');
}

// --- MODÜL 6: ŞİFRE GÜCÜ KONTROL VE ÜRETİM ---

const SIFRE_KARAKTER_SETLERI = {
    buyukHarf: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    kucukHarf: 'abcdefghijklmnopqrstuvwxyz',
    rakam: '0123456789',
    ozelKarakter: '!@#$%^&*()_+~`|}{[]\:;?><,./-='
};

/**
 * Şifre gücü analizi yapar ve puanlar.
 */
function sifreAlgoritmaKontrolu(sifre) {
    if (sifre.length === 0) {
        return { sonucMetni: 'Lütfen kontrol etmek için bir şifre giriniz.', hataMi: false, durum: 'default' };
    }
    
    let puan = 0;
    let eksik_kosullar = [];

    // 1. Uzunluk Kontrolü (Minimum 8 karakter)
    if (sifre.length >= 8) {
        puan += 1;
    } else {
        eksik_kosullar.push('Minimum 8 karakter uzunluğunda olmalıdır.');
    }
    
    // 2. Büyük Harf Kontrolü
    if (/[A-Z]/.test(sifre)) {
        puan += 1;
    } else {
        eksik_kosullar.push('En az bir büyük harf (A-Z) içermelidir.');
    }

    // 3. Küçük Harf Kontrolü
    if (/[a-z]/.test(sifre)) {
        puan += 1;
    } else {
        eksik_kosullar.push('En az bir küçük harf (a-z) içermelidir.');
    }

    // 4. Rakam Kontrolü
    if (/[0-9]/.test(sifre)) {
        puan += 1;
    } else {
        eksik_kosullar.push('En az bir rakam (0-9) içermelidir.');
    }
    
    // 5. Özel Karakter Kontrolü
    const ozelKarakterRegex = new RegExp(`[${SIFRE_KARAKTER_SETLERI.ozelKarakter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`);
    if (ozelKarakterRegex.test(sifre)) {
        puan += 1;
    } else {
        eksik_kosullar.push('En az bir özel karakter (!, @, #, $ vb.) içermelidir.');
    }

    // PUANLAMAYA GÖRE SONUÇ
    let durum = 'warn';
    let sonucMetni = '';

    if (puan === 5 && sifre.length >= 12) {
        durum = 'success';
        sonucMetni = `💪 **ÇOK GÜÇLÜ ŞİFRE!** Tüm 5 koşulu başarıyla geçti. (Puan: 5/5)`;
    } else if (puan >= 4) {
        durum = 'success';
        sonucMetni = `✅ **GÜÇLÜ ŞİFRE.** Neredeyse tüm koşullar sağlandı. (Puan: ${puan}/5)`;
    } else if (puan >= 3) {
        durum = 'warn';
        sonucMetni = `⚠️ **ORTA DÜZEY ŞİFRE.** Daha güvenli olabilir. (Puan: ${puan}/5)<br><span style="font-size: 0.8em; font-weight: normal;">Eksikler: ${eksik_kosullar.join(' ')}</span>`;
    } else {
        durum = 'error';
        sonucMetni = `❌ **ZAYIF/ÇOK ZAYIF ŞİFRE.** Lütfen geliştirin. (Puan: ${puan}/5)<br><span style="font-size: 0.8em; font-weight: normal;">Eksikler: ${eksik_kosullar.join(' ')}</span>`;
    }

    return {
        sonucMetni: sonucMetni,
        hataMi: durum === 'error',
        durum: durum
    };
}

/**
 * Belirtilen uzunlukta tüm karakter setlerini içeren rastgele bir şifre üretir.
 */
function sifreUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const uzunlukElement = document.getElementById('sifre-uzunluk');
    const uzunluk = parseInt(uzunlukElement.value) || 12; // Varsayılan 12
    
    if (uzunluk < 8 || uzunluk > 30) {
        sonucElement.innerHTML = 'Hata: Şifre uzunluğu 8 ile 30 arasında olmalıdır.';
        sonucElement.classList.add('error-box');
        return;
    }
    
    const setler = SIFRE_KARAKTER_SETLERI;
    const tumKarakterler = setler.buyukHarf + setler.kucukHarf + setler.rakam + setler.ozelKarakter;
    let sifre = '';
    
    // Güçlü olması için her setten en az bir karakter ekle
    sifre += setler.buyukHarf.charAt(Math.floor(Math.random() * setler.buyukHarf.length));
    sifre += setler.kucukHarf.charAt(Math.floor(Math.random() * setler.kucukHarf.length));
    sifre += setler.rakam.charAt(Math.floor(Math.random() * setler.rakam.length));
    sifre += setler.ozelKarakter.charAt(Math.floor(Math.random() * setler.ozelKarakter.length));
    
    // Kalan uzunluğu rastgele doldur
    for (let i = sifre.length; i < uzunluk; i++) {
        sifre += tumKarakterler.charAt(Math.floor(Math.random() * tumKarakterler.length));
    }
    
    // Şifreyi karıştır (Daha az tahmin edilebilir olması için)
    sifre = sifre.split('').sort(() => 0.5 - Math.random()).join('');

    inputAlan.value = sifre;
    
    // Üretilen şifrenin gücünü kontrol et ve sonucu göster
    const kontrolSonucu = sifreAlgoritmaKontrolu(sifre);
    sonucElement.innerHTML = `🔑 **${uzunluk} Karakterli Şifre Üretildi.** ${kontrolSonucu.sonucMetni}`;
    sonucElement.className = '';
    sonucElement.classList.add(kontrolSonucu.durum + '-box');
    inputAlan.classList.add(kontrolSonucu.durum + '-border');
}


// --- MODÜL 1: TCKN ÜRETİM VE KONTROL ---

function tcknUret() { /* TCKN üretme mantığı */
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const ilk_9_hane = rastgeleSayiUret(1, true) + rastgeleSayiUret(8);
    const rakamlar = ilk_9_hane.split('').map(Number);
    let tek_haneler_toplami = 0; let cift_haneler_toplami = 0;
    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) tek_haneler_toplami += rakamlar[i];
        else cift_haneler_toplami += rakamlar[i];
    }
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const algoritma_10_hane = (kontrol_farki % 10 + 10) % 10;
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + algoritma_10_hane;
    const algoritma_11_hane = ilk_10_toplami % 10;
    const uretilen_tckn = ilk_9_hane + String(algoritma_10_hane) + String(algoritma_11_hane);
    inputAlan.value = uretilen_tckn;
    sonucElement.innerHTML = `🇹🇷 **GEÇERLİ TCKN ÜRETİLDİ.** Doğrulama başarılı!`;
    sonucElement.className = '';
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}

function tcknAlgoritmaKontrolu(tckn_str) {
    const tckn_uzunluk = tckn_str.length;
    const varsayilan_yanit = { sonucMetni: 'Lütfen TCKN hanelerini giriniz...', hataMi: false, durum: 'default' };

    if (tckn_uzunluk === 0) return varsayilan_yanit;
    if (tckn_uzunluk < 9) {
        const eksik_hane = 9 - tckn_uzunluk;
        return { sonucMetni: `TCKN Tamamlama İçin ${eksik_hane} hane daha giriniz.`, hataMi: false, durum: 'default' };
    }
    if (tckn_uzunluk > 11) {
        return { sonucMetni: 'Hata: TCKN 11 haneden fazla olamaz.', hataMi: true, durum: 'error' };
    }
    if (tckn_str.charAt(0) === '0') {
        return { sonucMetni: "Hata: TCKN'nin ilk hanesi sıfır olamaz.", hataMi: true, durum: 'error' };
    }

    const ilk_9_hane = tckn_str.substring(0, 9);
    const rakamlar = ilk_9_hane.split('').map(Number);
    let tek_haneler_toplami = 0;
    let cift_haneler_toplami = 0;

    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) tek_haneler_toplami += rakamlar[i];
        else cift_haneler_toplami += rakamlar[i];
    }
    
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const algoritma_10_hane = (kontrol_farki % 10 + 10) % 10;
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + algoritma_10_hane;
    const algoritma_11_hane = ilk_10_toplami % 10;

    if (tckn_uzunluk === 9) {
        const tamamlanmis_tckn = ilk_9_hane + String(algoritma_10_hane) + String(algoritma_11_hane);
        
        return {
            sonucMetni: `**TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color);">${tamamlanmis_tckn}</span>`,
            hataMi: false,
            durum: 'success'
        };
    }

    if (tckn_uzunluk === 11) {
        const girilen_10 = parseInt(tckn_str.charAt(9));
        const girilen_11 = parseInt(tckn_str.charAt(10));
        
        if (girilen_10 === algoritma_10_hane && girilen_11 === algoritma_11_hane) {
            return {
                sonucMetni: `✔ TCKN Algoritmayı Başarıyla Geçti!`,
                hataMi: false,
                durum: 'success'
            };
        } else {
            const dogru_tckn = ilk_9_hane + String(algoritma_10_hane) + String(algoritma_11_hane);
            return {
                sonucMetni: `❌ TCKN Doğrulama Başarısız. Doğrusu: ${dogru_tckn}`,
                hataMi: true,
                durum: 'error'
            };
        }
    }
}

// --- MODÜL 2: KREDİ KARTI ÜRETİM VE KONTROL (LUHN) ---

function kartMarkasiBelirle(kart_no) {
    if (kart_no.startsWith('4')) {
        return 'Visa 🛡️';
    } else if (kart_no.startsWith('51') || kart_no.startsWith('52') || kart_no.startsWith('53') || kart_no.startsWith('54') || kart_no.startsWith('55')) {
        return 'Mastercard 💳';
    } else if (kart_no.startsWith('34') || kart_no.startsWith('37')) {
        return 'American Express (Amex) ✈️';
    } else if (kart_no.startsWith('6011') || kart_no.startsWith('65')) {
        return 'Discover 🌟';
    } else if (kart_no.startsWith('35')) {
        return 'JCB 🇯🇵';
    } else if (kart_no.startsWith('9792')) {
        return 'Troy 🇹🇷';
    }
    return 'Bilinmeyen Kart Türü';
}


function kartUret() {
    const secim = document.getElementById('kart-marka-secim').value;
    const sonucElement = document.getElementById('sonuc');
    const inputAlan = document.getElementById('input-alan');
    
    let on_ek, hedef_uzunluk;

    if (secim === '4_16') {
        on_ek = '4' + rastgeleSayiUret(5); 
        hedef_uzunluk = 16;
    } else if (secim === '5_16') {
        on_ek = '5' + rastgeleSayiUret(5); 
        hedef_uzunluk = 16;
    } else if (secim === '3_15') {
        const amex_on_ekleri = ['34', '37'];
        on_ek = amex_on_ekleri[Math.floor(Math.random() * amex_on_ekleri.length)] + rastgeleSayiUret(2); 
        hedef_uzunluk = 15;
    } else {
        sonucElement.innerHTML = 'Hata: Geçerli bir kart türü seçiniz.';
        sonucElement.className = '';
        sonucElement.classList.add('error-box');
        return;
    }

    const hesap_numarasi_uzunlugu = hedef_uzunluk - on_ek.length - 1; 
    let gecici_numara = on_ek + rastgeleSayiUret(hesap_numarasi_uzunlugu);
    
    const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(gecici_numara);
    const uretilen_kart_no = gecici_numara + kontrol_hanesi;

    inputAlan.value = uretilen_kart_no;
    sonucElement.innerHTML = `✅ ${kartMarkasiBelirle(uretilen_kart_no)} için **${hedef_uzunluk}** haneli kart üretildi. (Doğrulama başarılı!)`;
    sonucElement.className = '';
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}


function luhnAlgoritmasiKontrolu(kart_no) {
    kart_no = kart_no.replace(/\s/g, ''); 
    const uzunluk = kart_no.length;
    const kart_markasi = kartMarkasiBelirle(kart_no);
    
    const hedef_uzunluk_element = document.getElementById('kart-uzunluk-secim');
    const hedef_uzunluk = hedef_uzunluk_element ? parseInt(hedef_uzunluk_element.value, 10) : 16;


    if (uzunluk === 0) {
        return { sonucMetni: 'Lütfen kart hanelerini giriniz...', hataMi: false, durum: 'default' };
    }
    
    if (uzunluk > hedef_uzunluk) {
        return { sonucMetni: `Hata: Girdiğiniz hane sayısı (${uzunluk}), seçilen (${hedef_uzunluk}) haneden fazladır.`, hataMi: true, durum: 'error' };
    }

    const hesaplaLuhnToplami = (numara) => {
        let toplam = 0;
        let cift_hane = false; 

        for (let i = numara.length - 1; i >= 0; i--) {
            let rakam = parseInt(numara.charAt(i), 10);

            if (cift_hane) {
                rakam *= 2;
                if (rakam > 9) {
                    rakam -= 9;
                }
            }
            toplam += rakam;
            cift_hane = !cift_hane;
        }
        return toplam;
    };

    if (uzunluk === hedef_uzunluk - 1) { 
        const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(kart_no);
        const tamamlanmis_kart = kart_no + kontrol_hanesi;

        return { 
            sonucMetni: `Marka: ${kart_markasi}. **Eksik Son Hane:** ${kontrol_hanesi}. Tamamı: ${tamamlanmis_kart}`, 
            hataMi: false, 
            durum: 'success' 
        };
    }
    
    if (uzunluk === hedef_uzunluk) {
        const toplam = hesaplaLuhnToplami(kart_no);

        if (toplam % 10 === 0) {
            return { sonucMetni: `✔ Kart (${kart_markasi}) Luhn Algoritmasını GEÇTİ.`, hataMi: false, durum: 'success' };
        } else {
            return { sonucMetni: `❌ Kart (${kart_markasi}) Luhn Algoritmasında BAŞARISIZ.`, hataMi: true, durum: 'error' };
        }
    }
    
    if (uzunluk < hedef_uzunluk - 1) {
        const eksik_hane = hedef_uzunluk - uzunluk;
        return { sonucMetni: `Kartı tamamlamak için son ${eksik_hane} hane eksik. Tamamlama sadece son hane (kontrol basamağı) için yapılabilir.`, hataMi: false, durum: 'default' };
    }
    
    return { sonucMetni: `Kartı tamamlamak için ${hedef_uzunluk - 1} hane girmelisiniz.`, hataMi: false, durum: 'default' };
}


// --- MODÜL 3: IBAN ÜRETİM VE KONTROL (MOD 97) ---

function ibanUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');

    const ulke_kodu = 'TR'; // 2 Karakter
    const banka_kodu = rastgeleSayiUret(5); // 5 Hane (BBBBB)
    const rezerv_alan = '0'; // 1 Hane (R)
    const hesap_numarasi = rastgeleSayiUret(16); // 16 Hane (CCCCCCCCCCCCCCCC)
    
    // Kontrol basamağını hesaplamak için numara: Banka Kodu + Rezerv + Hesap No + Ülke Kodu + "00"
    let hesaplama_parcasi = banka_kodu + rezerv_alan + hesap_numarasi + ulke_kodu + '00';
    
    // Harfleri Sayısallaştırma (T=29, R=27)
    const sayisal_iban = convertLettersToNumbers(hesaplama_parcasi);
    
    // Modulo 97 hesaplama
    let kalan = 0;
    for (let i = 0; i < sayisal_iban.length; i++) {
        kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97;
    }
    
    // Kontrol basamağını bul: 98 - (Kalan)
    let kontrol_basamagi = 98 - kalan;
    let kontrol_str = kontrol_basamagi.toString().padStart(2, '0');

    // Nihai IBAN'ı oluştur
    const uretilen_iban = ulke_kodu + kontrol_str + banka_kodu + rezerv_alan + hesap_numarasi;
    
    inputAlan.value = uretilen_iban;
    sonucElement.innerHTML = `🏦 **GEÇERLİ IBAN ÜRETİLDİ.** Kontrol: ${kontrol_str}. Doğrulama başarılı!`;
    sonucElement.className = '';
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}

function ibanAlgoritmaKontrolu(iban_str) {
    iban_str = iban_str.toUpperCase().replace(/\s/g, '');

    if (iban_str.length === 0) {
        return { sonucMetni: 'Lütfen IBAN hanelerini giriniz...', hataMi: false, durum: 'default' };
    }
    if (iban_str.length !== 26) {
        const eksik_fazla = 26 - iban_str.length;
        return { sonucMetni: `Hata: Türkiye IBAN'ı 26 karakter olmalıdır. (${eksik_fazla > 0 ? eksik_fazla + ' eksik' : -eksik_fazla + ' fazla'})`, hataMi: true, durum: 'error' };
    }
    if (!iban_str.startsWith('TR')) {
        return { sonucMetni: 'Hata: Türkiye IBAN numarası TR ile başlamalıdır.', hataMi: true, durum: 'error' };
    }

    // İlk 4 haneyi (TRKK) sona at
    const duzenlenmis_iban = iban_str.substring(4) + iban_str.substring(0, 4); 
    const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
    
    // Mod 97 hesaplama
    let kalan = 0;
    for (let i = 0; i < sayisal_iban.length; i++) {
        kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97;
    }
    
    if (kalan === 1) {
        return { sonucMetni: '✔ IBAN, Uluslararası MOD 97 Kontrolünden BAŞARIYLA GEÇTİ!', hataMi: false, durum: 'success' };
    } else {
        return { sonucMetni: `❌ IBAN, MOD 97 Kontrolünde BAŞARISIZ. (Kalan ${kalan}, 1 olmalıydı.)`, hataMi: true, durum: 'error' };
    }
}


// --- MODÜL 4: TELEFON ÜRETİM VE KONTROL ---

const OPERATOR_KODLARI = {
    turkcell: [530, 531, 532, 533, 534, 535, 536, 537, 538, 539],
    vodafone: [540, 541, 542, 543, 544, 545, 546, 547, 548, 549],
    turktelekom: [501, 505, 506, 507, 550, 551, 552, 553, 554, 555, 558, 559]
};

function numarayiTemizle(numara_str) {
    let temiz_numara = numara_str.replace(/[^0-9]/g, '');
    if (temiz_numara.startsWith('90')) {
        temiz_numara = temiz_numara.substring(2);
    }
    if (temiz_numara.startsWith('0')) {
        temiz_numara = temiz_numara.substring(1);
    }
    return temiz_numara;
}

function operatorBelirle(alan_kodu) {
    const kod = parseInt(alan_kodu, 10);
    for (const operator in OPERATOR_KODLARI) {
        if (OPERATOR_KODLARI[operator].includes(kod)) {
            return operator.charAt(0).toUpperCase() + operator.slice(1);
        }
    }
    return 'Bilinmiyor';
}

function telefonUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const operatorSecim = document.getElementById('operator-secim').value;
    
    const kodListesi = OPERATOR_KODLARI[operatorSecim];
    if (!kodListesi || kodListesi.length === 0) {
        sonucElement.innerHTML = 'Hata: Geçerli bir operatör seçimi yapılmadı.';
        sonucElement.className = '';
        sonucElement.classList.add('error-box');
        return;
    }

    const rastgeleKod = kodListesi[Math.floor(Math.random() * kodListesi.length)];
    const son_7_hane = rastgeleSayiUret(7);
    const uretilen_numara = String(rastgeleKod) + son_7_hane;
    const operatorAdi = operatorSecim.charAt(0).toUpperCase() + operatorSecim.slice(1);

    const formatli_numara = uretilen_numara.substring(0, 3) + ' ' + uretilen_numara.substring(3, 6) + ' ' + uretilen_numara.substring(6, 8) + ' ' + uretilen_numara.substring(8, 10);

    inputAlan.value = formatli_numara; 
    sonucElement.innerHTML = `📱 **GEÇERLİ NUMARA ÜRETİLDİ.** Operatör: **${operatorAdi}**. Doğrulama başarılı!`;
    sonucElement.className = '';
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}


function telefonAlgoritmaKontrolu(numara_str) {
    const temiz_numara = numarayiTemizle(numara_str);
    const uzunluk = temiz_numara.length;
    
    if (uzunluk === 0) {
        return { sonucMetni: 'Lütfen bir telefon numarası giriniz.', hataMi: false, durum: 'default' };
    }
    
    if (uzunluk !== 10) {
        const eksik_fazla = 10 - uzunluk;
        return { sonucMetni: `Hata: GSM numarası 10 hane olmalıdır (5XX XXXXXXX). (${eksik_fazla > 0 ? eksik_fazla + ' eksik' : -eksik_fazla + ' fazla'})`, hataMi: true, durum: 'error' };
    }
    
    if (!temiz_numara.startsWith('5')) {
        return { sonucMetni: 'Hata: Türkiye GSM numaraları 5 ile başlamalıdır (5XX).', hataMi: true, durum: 'error' };
    }
    
    const alan_kodu = temiz_numara.substring(0, 3);
    const operator = operatorBelirle(alan_kodu);
    
    let formatli_temiz_numara = temiz_numara.substring(0, 3) + ' ' + temiz_numara.substring(3, 6) + ' ' + temiz_numara.substring(6, 8) + ' ' + temiz_numara.substring(8, 10);
    
    let sonucMetni;
    
    if (operator === 'Bilinmiyor') {
        sonucMetni = `❌ Alan Kodu **${alan_kodu}** Geçersiz veya Bilinmeyen Operatör Kodu. Temiz Format: ${formatli_temiz_numara}`;
        return { sonucMetni, hataMi: true, durum: 'error' };
    } else {
        sonucMetri = `✔ Numara Geçerli. **Operatör:** ${operator}. Uluslararası Format: +90 ${formatli_temiz_numara}`;
        return { sonucMetni, hataMi: false, durum: 'success' };
    }
}

// --- MODÜL 5: E-POSTA KONTROL VE ÜRETİM (REGEX) ---

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function epostaAlgoritmaKontrolu(eposta_str) {
    if (eposta_str.length === 0) {
        return { sonucMetni: 'Lütfen kontrol etmek için bir e-posta adresi giriniz.', hataMi: false, durum: 'default' };
    }
    
    const dogrulama_basarili = EMAIL_REGEX.test(eposta_str.toLowerCase());

    if (dogrulama_basarili) {
        return {
            sonucMetni: `✔ E-Posta sözdizimi **Regex kurallarını** başarıyla geçti.`,
            hataMi: false,
            durum: 'success'
        };
    } else {
        return {
            sonucMetni: `❌ E-Posta sözdizimi kurallarına uymuyor. (Hata: Kullanıcı adı, @, veya alan adı/uzantı eksik/hatalı.)`,
            hataMi: true,
            durum: 'error'
        };
    }
}

function epostaUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    
    const popüler_alanlar = ['gmail.com', 'hotmail.com', 'yandex.com', 'yahoo.com', 'outlook.com', 'mail.com'];
    
    const kullanici_adi = rastgeleKarakterUret(Math.floor(Math.random() * 5) + 5); 
    const alan_adi = popüler_alanlar[Math.floor(Math.random() * popüler_alanlar.length)];
    
    const uretilen_eposta = `${kullanici_adi}${rastgeleSayiUret(2)}@${alan_adi}`;

    inputAlan.value = uretilen_eposta;
    sonucElement.innerHTML = `📧 **GEÇERLİ E-POSTA ÜRETİLDİ.** Sözdizimi doğru!`;
    sonucElement.className = '';
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}

// --- ANA YÖNLENDİRİCİ FONKSİYONLAR ---

function setUretimHedefi() {
    const markaSecim = document.getElementById('kart-marka-secim').value;
    const uzunlukSecimElementi = document.getElementById('kart-uzunluk-secim');
    let hedefUzunluk = (markaSecim === '3_15') ? 15 : 16;
    uzunlukSecimElementi.value = hedefUzunluk;
    calistirici(); 
}

function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    
    // Tüm opsiyonel grupları gizle
    document.getElementById('tckn-uretim-grup').style.display = 'none';
    document.getElementById('kart-uretim-grup').style.display = 'none'; 
    document.getElementById('iban-uretim-grup').style.display = 'none';
    document.getElementById('kart-uzunluk-secim-grup').style.display = 'none';
    document.getElementById('telefon-uretim-grup').style.display = 'none'; 
    document.getElementById('eposta-uretim-grup').style.display = 'none';
    document.getElementById('sifre-uretim-grup').style.display = 'none'; // Şifre grubu

    inputAlan.value = '';
    inputAlan.oninput = null; 
    inputAlan.maxLength = 50; 
    inputAlan.type = 'text'; 
    inputAlan.classList.remove('error-border', 'success-border', 'warn-border'); // Yeni uyarı stilini sıfırla

    if (secim === 'tckn') {
        document.getElementById('tckn-uretim-grup').style.display = 'block';
        inputLabel.innerHTML = "TC Kimlik No'nun İlk 9 VEYA Tamamını (11 hane) Girin:";
        inputAlan.placeholder = "9 hane tamamlama yapar, 11 hane doğrular";
        inputAlan.maxLength = 11;
        inputAlan.oninput = function() { this.value = this.value.replace(/[^0-9]/g, ''); };
    } else if (secim === 'kredi_karti') {
        document.getElementById('kart-uzunluk-secim-grup').style.display = 'block'; 
        document.getElementById('kart-uretim-grup').style.display = 'block'; 
        const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
        inputLabel.innerHTML = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        inputAlan.placeholder = `Tamamlama için ${hedefUzunluk - 1} hane girin.`;
        inputAlan.maxLength = 19; 
        inputAlan.oninput = function() { this.value = this.value.replace(/[^0-9]/g, ''); };
        setUretimHedefi(); 
    } else if (secim === 'iban') {
        document.getElementById('iban-uretim-grup').style.display = 'block'; 
        inputLabel.innerHTML = "IBAN'ı Girin (TR ile başlayan 26 karakter):";
        inputAlan.placeholder = "Örnek: TRKKBBBBBRRRRCCCCCCCCCCCCCCCC";
        inputAlan.maxLength = 26;
        inputAlan.oninput = function() { this.value = this.value.toUpperCase().replace(/[^0-9A-Z]/g, ''); }; 
    } else if (secim === 'telefon') {
        document.getElementById('telefon-uretim-grup').style.display = 'block';
        inputLabel.innerHTML = "Telefon Numarasını Girin (Örn: 5XX XXX XX XX):";
        inputAlan.placeholder = "Tüm formatlar desteklenir (05XX, +905XX vb.)";
        inputAlan.maxLength = 20; 
        inputAlan.oninput = function() { this.value = this.value.replace(/[^0-9\s\+\-\(\)]/g, ''); }; 
    } else if (secim === 'eposta') {
        document.getElementById('eposta-uretim-grup').style.display = 'block';
        inputLabel.innerHTML = "E-Posta Adresini Girin (Sözdizimi Kontrolü):";
        inputAlan.placeholder = "ornek.kullanici@domain.com";
        inputAlan.maxLength = 100;
        inputAlan.oninput = null;
    } else if (secim === 'sifre') {
        document.getElementById('sifre-uretim-grup').style.display = 'block';
        inputLabel.innerHTML = "Şifrenizi Girin (Güç Kontrolü):";
        inputAlan.placeholder = "Güçlü şifre en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir.";
        inputAlan.maxLength = 50;
        inputAlan.oninput = null;
    }
    
    calistirici(); 
}


function calistirici() {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const secim = document.getElementById('proje-secim').value;
    
    const input_degeri = inputElement.value.trim();
    let sonuc;

    inputElement.classList.remove('error-border', 'success-border', 'warn-border');
    sonucElement.className = '';
    
    if (secim === 'tckn') {
        sonuc = tcknAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'kredi_karti') {
        sonuc = luhnAlgoritmasiKontrolu(input_degeri);
    } else if (secim === 'iban') {
        sonuc = ibanAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'telefon') {
        sonuc = telefonAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'eposta') {
        sonuc = epostaAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'sifre') { // YENİ ŞİFRE KONTROLÜ
        sonuc = sifreAlgoritmaKontrolu(input_degeri);
    } else {
        sonuc = { sonucMetni: 'Lütfen bir proje seçin.', hataMi: false, durum: 'default' };
    }

    sonucElement.innerHTML = sonuc.sonucMetni;

    if (sonuc.durum === 'error') {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else if (sonuc.durum === 'success') {
        sonucElement.classList.add('success-box');
        inputElement.classList.add('success-border');
    } else if (sonuc.durum === 'warn') {
        sonucElement.classList.add('warn-box');
        inputElement.classList.add('warn-border');
    }
}

document.addEventListener('DOMContentLoaded', calistirici);