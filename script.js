/**
 * TCKN Algoritma Kontrollerini Gerçekleştirir.
 * Girdi 9 haneyse tamamlar, 11 haneyse doğrular.
 * @param {string} tckn_str - TCKN'nin ilk 9 hanesi veya 11 hanenin tamamı.
 * @returns {object} { sonucMetni: string, hataMi: boolean, durum: 'default'|'success'|'error' }
 */
function tcknAlgoritmaKontrolu(tckn_str) {
    
    const tckn_uzunluk = tckn_str.length;
    const varsayilan_yanit = { sonucMetni: 'Lütfen TCKN hanelerini giriniz...', hataMi: false, durum: 'default' };

    // 1. Temel Kontroller
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

    // Algoritma Hesaplaması için İlk 9 Hane Kullanılır
    const ilk_9_hane = tckn_str.substring(0, 9);
    const rakamlar = ilk_9_hane.split('').map(Number);
    
    let tek_haneler_toplami = 0; // 1., 3., 5., 7., 9.
    let cift_haneler_toplami = 0; // 2., 4., 6., 8.

    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) { 
            tek_haneler_toplami += rakamlar[i];
        } else {
            cift_haneler_toplami += rakamlar[i];
        }
    }
    
    // 10. Hanenin Algoritmik Değeri
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const algoritma_10_hane = (kontrol_farki % 10 + 10) % 10;
    
    // 11. Hanenin Algoritmik Değeri
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + algoritma_10_hane;
    const algoritma_11_hane = ilk_10_toplami % 10;

    // --- DURUM 1: TCKN Tamamlama (9 hane girildiyse) ---
    if (tckn_uzunluk === 9) {
        const tamamlanmis_tckn = ilk_9_hane + String(algoritma_10_hane) + String(algoritma_11_hane);
        
        return {
            sonucMetni: `**TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color);">${tamamlanmis_tckn}</span>`,
            hataMi: false,
            durum: 'success'
        };
    }

    // --- DURUM 2: TCKN Doğrulama (11 hane girildiyse) ---
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

// HTML arayüzünden anlık tetiklenecek ana fonksiyon
function tamamlayiciyiCalistir() {
    const inputElement = document.getElementById('tckn-input');
    const sonucElement = document.getElementById('sonuc');
    const tckn_input_degeri = inputElement.value.trim();
    
    const sonuc = tcknAlgoritmaKontrolu(tckn_input_degeri);
    
    sonucElement.innerHTML = sonuc.sonucMetni;
    
    // Sınıflandırma ve Vurgulama Yönetimi
    sonucElement.classList.remove('error-box', 'success-box');
    inputElement.classList.remove('error-border', 'success-border');
    inputElement.style.borderColor = ''; // Varsayılanı sıfırla

    if (sonuc.durum === 'error') {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else if (sonuc.durum === 'success') {
        sonucElement.classList.add('success-box');
        inputElement.classList.add('success-border');
    }
}