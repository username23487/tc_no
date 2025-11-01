// --- YARDIMCI FONKSİYONLAR ---

/**
 * Rastgele basamaklar üretir.
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
 * Luhn Algoritması Temel Hesaplama Fonksiyonu.
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
    
    return (10 - (toplam % 10)) % 10;
}

// A=10, B=11, ... Z=35 dönüşümü (IBAN için gerekli)
function convertLettersToNumbers(str) {
    return str.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            return (char.charCodeAt(0) - 'A'.charCodeAt(0) + 10).toString();
        }
        return char;
    }).join('');
}


// --- TCKN ÜRETİM FONKSİYONU ---

function tcknUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    
    // 1. İlk 9 haneyi rastgele oluştur (İlk hane 0 olamaz!)
    const ilk_9_hane = rastgeleSayiUret(1, true) + rastgeleSayiUret(8);
    const rakamlar = ilk_9_hane.split('').map(Number);
    
    let tek_haneler_toplami = 0; // 1, 3, 5, 7, 9. haneler (indis: 0, 2, 4, 6, 8)
    let cift_haneler_toplami = 0; // 2, 4, 6, 8. haneler (indis: 1, 3, 5, 7)

    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) { 
            tek_haneler_toplami += rakamlar[i];
        } else {
            cift_haneler_toplami += rakamlar[i];
        }
    }
    
    // 2. 10. haneyi (kontrol basamağı) hesapla
    // 10. hane: ((t1+t3+t5+t7+t9)*7 - (t2+t4+t6+t8)) mod 10
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const algoritma_10_hane = (kontrol_farki % 10 + 10) % 10;
    
    // 3. 11. haneyi (kontrol basamağı) hesapla
    // 11. hane: (t1+t2+t3+t4+t5+t6+t7+t8+t9+t10) mod 10
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + algoritma_10_hane;
    const algoritma_11_hane = ilk_10_toplami % 10;

    const uretilen_tckn = ilk_9_hane + String(algoritma_10_hane) + String(algoritma_11_hane);

    // Arayüze yaz
    inputAlan.value = uretilen_tckn;
    sonucElement.innerHTML = `🇹🇷 **GEÇERLİ TCKN ÜRETİLDİ.** Doğrulama başarılı!`;
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}


// --- TCKN DOĞRULAMA & TAMAMLAMA (Önceki Kod) ---

function tcknAlgoritmaKontrolu(tckn_str) {
    
    const tckn_uzunluk = tckn_str.length;
    const varsayilan_yanit = { sonucMetni: 'Lütfen TCKN hanelerini giriniz...', hataMi: false, durum: 'default' };

    if (tckn_uzunluk === 0) {
        return varsayilan_yanit;
    }
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
        if ((i + 1) % 2 === 1) { 
            tek_haneler_toplami += rakamlar[i];
        } else {
            cift_haneler_toplami += rakamlar[i];
        }
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


// --- KART VE IBAN ÜRETİM/KONTROL (Kısaltılmış Önceki Kodlar) ---

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
        sonucElement.classList.add('error-box');
        return;
    }

    const hesap_numarasi_uzunlugu = hedef_uzunluk - on_ek.length - 1; 
    let gecici_numara = on_ek + rastgeleSayiUret(hesap_numarasi_uzunlugu);
    
    const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(gecici_numara);
    const uretilen_kart_no = gecici_numara + kontrol_hanesi;

    inputAlan.value = uretilen_kart_no;
    sonucElement.innerHTML = `✅ ${kartMarkasiBelirle(uretilen_kart_no)} için **${hedef_uzunluk}** haneli kart üretildi. (Doğrulama başarılı!)`;
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}

function ibanUret() {
    const inputAlan = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const ulke_kodu = 'TR'; 
    const banka_kodu = rastgeleSayiUret(5); 
    const rezerv_alan = '0'; 
    const hesap_numarasi = rastgeleSayiUret(16); 
    
    let hesaplama_parcasi = banka_kodu + rezerv_alan + hesap_numarasi + ulke_kodu + '00';
    const sayisal_iban = convertLettersToNumbers(hesaplama_parcasi);
    
    let kalan = 0;
    for (let i = 0; i < sayisal_iban.length; i++) {
        kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97;
    }
    
    let kontrol_basamagi = 98 - kalan;
    let kontrol_str = kontrol_basamagi.toString().padStart(2, '0');

    const uretilen_iban = ulke_kodu + kontrol_str + banka_kodu + rezerv_alan + hesap_numarasi;
    
    inputAlan.value = uretilen_iban;
    sonucElement.innerHTML = `🏦 **GEÇERLİ IBAN ÜRETİLDİ.** Kontrol: ${kontrol_str}. Doğrulama başarılı!`;
    sonucElement.classList.add('success-box');
    inputAlan.classList.add('success-border');
}

function kartMarkasiBelirle(kart_no) { /* ... önceki kod ... */
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

function luhnAlgoritmasiKontrolu(kart_no) { /* ... önceki kod ... */
    kart_no = kart_no.replace(/\s/g, ''); 
    const uzunluk = kart_no.length;
    const hedef_uzunluk_element = document.getElementById('kart-uzunluk-secim');
    const hedef_uzunluk = hedef_uzunluk_element ? parseInt(hedef_uzunluk_element.value, 10) : 16;
    // ... (kontrol ve tamamlama mantığı)
    
    if (uzunluk === hedef_uzunluk) {
        const hesaplaLuhnToplami = (numara) => { /* ... toplama mantığı ... */
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
        const toplam = hesaplaLuhnToplami(kart_no);
        if (toplam % 10 === 0) {
            return { sonucMetni: `✔ Kart (${kartMarkasiBelirle(kart_no)}) Luhn Algoritmasını GEÇTİ.`, hataMi: false, durum: 'success' };
        } else {
            return { sonucMetni: `❌ Kart (${kartMarkasiBelirle(kart_no)}) Luhn Algoritmasında BAŞARISIZ.`, hataMi: true, durum: 'error' };
        }
    } else if (uzunluk === hedef_uzunluk - 1) { 
        const kontrol_hanesi = hesaplaLuhnKontrolHaneyi(kart_no);
        const tamamlanmis_kart = kart_no + kontrol_hanesi;
        return { 
            sonucMetni: `Marka: ${kartMarkasiBelirle(kart_no)}. **Eksik Son Hane:** ${kontrol_hanesi}. Tamamı: ${tamamlanmis_kart}`, 
            hataMi: false, 
            durum: 'success' 
        };
    } 
    // ... (diğer kontrol durumları)
    const eksik_hane = hedef_uzunluk - uzunluk;
    return { sonucMetni: `Kartı tamamlamak için son ${eksik_hane} hane eksik.`, hataMi: false, durum: 'default' };
}

function ibanAlgoritmaKontrolu(iban_str) { /* ... önceki kod ... */
    iban_str = iban_str.toUpperCase().replace(/\s/g, '');
    if (iban_str.length !== 26 || !iban_str.startsWith('TR')) {
        if(iban_str.length === 0) return { sonucMetni: 'Lütfen IBAN hanelerini giriniz...', hataMi: false, durum: 'default' };
        return { sonucMetni: `Hata: Türkiye IBAN'ı 26 karakter (TR ile başlayan) olmalıdır.`, hataMi: true, durum: 'error' };
    }
    const duzenlenmis_iban = iban_str.substring(4) + iban_str.substring(0, 4); 
    const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
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


// --- ANA YÖNLENDİRİCİ FONKSİYONLAR ---

function setUretimHedefi() {
    const markaSecim = document.getElementById('kart-marka-secim').value;
    const uzunlukSecimElementi = document.getElementById('kart-uzunluk-secim');
    let hedefUzunluk = 16;
    if (markaSecim === '3_15') hedefUzunluk = 15;
    
    uzunlukSecimElementi.value = hedefUzunluk;
    calistirici(); 
}


function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    const kartUzunlukSecimGrup = document.getElementById('kart-uzunluk-secim-grup');
    const kartUretimGrup = document.getElementById('kart-uretim-grup');
    const ibanUretimGrup = document.getElementById('iban-uretim-grup');
    const tcknUretimGrup = document.getElementById('tckn-uretim-grup'); // Yeni TCKN grubu

    inputAlan.value = '';
    
    // Görüntüleme ayarları (Önce hepsini gizle)
    kartUzunlukSecimGrup.style.display = 'none';
    kartUretimGrup.style.display = 'none'; 
    ibanUretimGrup.style.display = 'none';
    tcknUretimGrup.style.display = 'none'; // TCKN grubunu gizle/göster

    if (secim === 'tckn') {
        tcknUretimGrup.style.display = 'block'; // TCKN grubunu göster
        inputLabel.innerHTML = "TC Kimlik No'nun İlk 9 VEYA Tamamını (11 hane) Girin:";
        inputAlan.placeholder = "9 hane tamamlama yapar, 11 hane doğrular";
        inputAlan.maxLength = 11;
        inputAlan.oninput = function() { this.value = this.value.replace(/[^0-9]/g, ''); };
    } else if (secim === 'kredi_karti') {
        kartUzunlukSecimGrup.style.display = 'block'; 
        kartUretimGrup.style.display = 'block'; 
        
        const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
        inputLabel.innerHTML = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        inputAlan.placeholder = `Tamamlama için ${hedefUzunluk - 1} hane girin.`;
        inputAlan.maxLength = 19; 
        inputAlan.oninput = function() { this.value = this.value.replace(/[^0-9]/g, ''); };
        
        setUretimHedefi(); 
    } else if (secim === 'iban') {
        ibanUretimGrup.style.display = 'block'; 
        
        inputLabel.innerHTML = "IBAN'ı Girin (TR ile başlayan 26 karakter):";
        inputAlan.placeholder = "Örnek: TRKKBBBBBRRRRCCCCCCCCCCCCCCCC";
        inputAlan.maxLength = 26;
        inputAlan.oninput = function() { this.value = this.value.toUpperCase().replace(/[^0-9A-Z]/g, ''); }; 
    }
    
    calistirici(); 
}


function calistirici() {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const secim = document.getElementById('proje-secim').value;
    
    const input_degeri = inputElement.value.trim();
    let sonuc;

    inputElement.classList.remove('error-border', 'success-border');
    
    if (secim === 'tckn') {
        sonuc = tcknAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'kredi_karti') {
        sonuc = luhnAlgoritmasiKontrolu(input_degeri);
        
        if (document.getElementById('kart-uzunluk-secim-grup').style.display === 'block') {
            const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
            document.getElementById('input-label').innerHTML = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        }
        
    } else if (secim === 'iban') {
        sonuc = ibanAlgoritmaKontrolu(input_degeri);
    } else {
        sonuc = { sonucMetni: 'Lütfen bir proje seçin.', hataMi: false, durum: 'default' };
    }

    sonucElement.innerHTML = sonuc.sonucMetni;
    
    sonucElement.classList.remove('error-box', 'success-box');

    if (sonuc.durum === 'error') {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else if (sonuc.durum === 'success') {
        sonucElement.classList.add('success-box');
        inputElement.classList.add('success-border');
    }
}

document.addEventListener('DOMContentLoaded', calistirici);
