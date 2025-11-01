// --- YARDIMCI FONKSİYONLAR ---

/**
 * Rastgele basamaklar üretir.
 */
function rastgeleSayiUret(uzunluk) {
    let numara = '';
    for (let i = 0; i < uzunluk; i++) {
        numara += Math.floor(Math.random() * 10);
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

// --- IBAN KONTROLÜ (MOD 97) ---

function ibanAlgoritmaKontrolu(iban_str) {
    // 1. Temizlik ve Format Kontrolü (TR IBAN 26 karakter)
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

    // 2. Düzeltme (İlk 4 karakteri sona taşı)
    const duzenlenmis_iban = iban_str.substring(4) + iban_str.substring(0, 4); 

    // 3. Harfleri Sayısallaştırma (A=10, T=29, R=27, Kalanlar Aynı)
    const sayisal_iban = convertLettersToNumbers(duzenlenmis_iban);
    
    // 4. Modulo 97 Kontrolü (Çok uzun sayılar için büyük sayı modu)
    let kalan = 0;
    for (let i = 0; i < sayisal_iban.length; i++) {
        // Her yeni basamağı ekleyerek kalanı hesapla
        kalan = (kalan * 10 + parseInt(sayisal_iban[i], 10)) % 97;
    }
    
    // Geçerli bir IBAN için Modulo 97 sonucu 1 olmalıdır.
    if (kalan === 1) {
        return { sonucMetni: '✔ IBAN, Uluslararası MOD 97 Kontrolünden BAŞARIYLA GEÇTİ!', hataMi: false, durum: 'success' };
    } else {
        return { sonucMetni: `❌ IBAN, MOD 97 Kontrolünde BAŞARISIZ. (Kalan ${kalan}, 1 olmalıydı.)`, hataMi: true, durum: 'error' };
    }
}

// --- KART ÜRETİM VE KONTROL (Önceki Kod) ---

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


// --- TCKN KONTROL (Önceki Kod) ---

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


// --- ANA YÖNLENDİRİCİ FONKSİYONLAR ---

function setUretimHedefi() {
    const markaSecim = document.getElementById('kart-marka-secim').value;
    const uzunlukSecimElementi = document.getElementById('kart-uzunluk-secim');
    let hedefUzunluk;

    if (markaSecim === '4_16' || markaSecim === '5_16') {
        hedefUzunluk = 16;
    } else if (markaSecim === '3_15') {
        hedefUzunluk = 15;
    } else {
        hedefUzunluk = 16;
    }
    
    uzunlukSecimElementi.value = hedefUzunluk;
    calistirici(); 
}


function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    const kartUzunlukSecimGrup = document.getElementById('kart-uzunluk-secim-grup');
    const kartUretimGrup = document.getElementById('kart-uretim-grup');

    inputAlan.value = '';
    
    // Görüntüleme ayarları
    kartUzunlukSecimGrup.style.display = 'none';
    kartUretimGrup.style.display = 'none'; 

    if (secim === 'tckn') {
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
    } else if (secim === 'iban') {
        inputLabel.innerHTML = "IBAN'ı Girin (TR ile başlayan 26 karakter):";
        inputAlan.placeholder = "Örnek: TRKKBBBBBBBBBBBBBBBBBBBBBB";
        inputAlan.maxLength = 26;
        // IBAN büyük harf ve rakamlardan oluşur.
        inputAlan.oninput = function() { this.value = this.value.toUpperCase().replace(/[^0-9A-Z]/g, ''); }; 
    }
    
    if (secim === 'kredi_karti' && document.getElementById('kart-marka-secim')) {
         setUretimHedefi(); 
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