// --- KREDİ KARTI DOĞRULAMA & TAMAMLAMA (LUHN ALGORİTMASI) ---

/**
 * Kartın ilk hanelerine göre markasını belirler.
 */
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


/**
 * Kredi kartı numarasını Luhn Algoritması (Mod 10) ile doğrular VEYA tamamlar.
 */
function luhnAlgoritmasiKontrolu(kart_no) {
    kart_no = kart_no.replace(/\s/g, ''); 
    const uzunluk = kart_no.length;
    const kart_markasi = kartMarkasiBelirle(kart_no);
    
    // HTML'den seçilen hedef uzunluğu al
    const hedef_uzunluk_element = document.getElementById('kart-uzunluk-secim');
    const hedef_uzunluk = hedef_uzunluk_element ? parseInt(hedef_uzunluk_element.value, 10) : 16;


    if (uzunluk === 0) {
        return { sonucMetni: 'Lütfen kart hanelerini giriniz...', hataMi: false, durum: 'default' };
    }
    
    if (uzunluk > hedef_uzunluk) {
        return { sonucMetni: `Hata: Girdiğiniz hane sayısı, seçilen (${hedef_uzunluk}) haneden fazladır.`, hataMi: true, durum: 'error' };
    }


    // Luhn Algoritması Temel Hesaplama Fonksiyonu
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

    // --- DURUM 1: Tamamlama (Hedef uzunluktan 1 hane eksikse) ---
    if (uzunluk === hedef_uzunluk - 1) { 
        const tamamlanacak_numara = kart_no + '0'; 
        const toplam = hesaplaLuhnToplami(tamamlanacak_numara);
        
        const kontrol_hanesi = (10 - (toplam % 10)) % 10;
        const tamamlanmis_kart = kart_no + kontrol_hanesi;

        return { 
            sonucMetni: `Marka: ${kart_markasi}. **Eksik Son Hane:** ${kontrol_hanesi}. Tamamı: ${tamamlanmis_kart}`, 
            hataMi: false, 
            durum: 'success' 
        };
    }
    
    // --- DURUM 2: Doğrulama (Tam Hane Girildiyse) ---
    if (uzunluk === hedef_uzunluk) {
        const toplam = hesaplaLuhnToplami(kart_no);

        if (toplam % 10 === 0) {
            return { sonucMetni: `✔ Kart (${kart_markasi}) Luhn Algoritmasını GEÇTİ.`, hataMi: false, durum: 'success' };
        } else {
            return { sonucMetni: `❌ Kart (${kart_markasi}) Luhn Algoritmasında BAŞARISIZ.`, hataMi: true, durum: 'error' };
        }
    }
    
    // --- DURUM 3: Eksik Hane (Tamamlama için yetersiz) ---
    if (uzunluk < hedef_uzunluk - 1) {
        const eksik_hane = hedef_uzunluk - uzunluk;
        return { sonucMetni: `Kartı tamamlamak için son ${eksik_hane} hane eksik. Tamamlama sadece son hane (kontrol basamağı) için yapılabilir.`, hataMi: false, durum: 'default' };
    }
    
    return { sonucMetni: `Kartı tamamlamak için ${hedef_uzunluk - 1} hane girmelisiniz.`, hataMi: false, durum: 'default' };
}


// --- TCKN DOĞRULAMA & TAMAMLAMA (Önceki Fonksiyon) ---
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

function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    const kartUzunlukSecimGrup = document.getElementById('kart-uzunluk-secim-grup');
    
    inputAlan.value = '';
    
    if (secim === 'tckn') {
        inputLabel.innerHTML = "TC Kimlik No'nun İlk 9 VEYA Tamamını (11 hane) Girin:";
        inputAlan.placeholder = "9 hane tamamlama yapar, 11 hane doğrular";
        inputAlan.maxLength = 11;
        kartUzunlukSecimGrup.style.display = 'none';
    } else if (secim === 'kredi_karti') {
        // Hedef uzunluğu seçime göre belirle
        const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
        inputLabel.innerHTML = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        inputAlan.placeholder = `${hedefUzunluk - 1} hane girin, son haneyi tamamlayalım.`;
        inputAlan.maxLength = 19; // Maksimum 19 hane girilebilir
        kartUzunlukSecimGrup.style.display = 'block';
    }
    
    calistirici(); 
}


function calistirici() {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const secim = document.getElementById('proje-secim').value;
    
    const input_degeri = inputElement.value.trim();
    let sonuc;

    if (secim === 'tckn') {
        sonuc = tcknAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'kredi_karti') {
        sonuc = luhnAlgoritmasiKontrolu(input_degeri);
        
        // Kredi kartı seçiliyken hedef uzunluk değiştiyse input label'ı güncelle
        if (document.getElementById('kart-uzunluk-secim-grup').style.display === 'block') {
            const hedefUzunluk = document.getElementById('kart-uzunluk-secim').value; 
            document.getElementById('input-label').innerHTML = `Kredi Kartı Numarasını Girin (Hedef: ${hedefUzunluk} hane):`;
        }
        
    } else {
        sonuc = { sonucMetni: 'Lütfen bir proje seçin.', hataMi: false, durum: 'default' };
    }

    sonucElement.innerHTML = sonuc.sonucMetni;
    
    sonucElement.classList.remove('error-box', 'success-box');
    inputElement.classList.remove('error-border', 'success-border');
    inputElement.style.borderColor = ''; 

    if (sonuc.durum === 'error') {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else if (sonuc.durum === 'success') {
        sonucElement.classList.add('success-box');
        inputElement.classList.add('success-border');
    }
}

document.addEventListener('DOMContentLoaded', calistirici);