/**
 * TCKN Tamamlama ve Kontrol Mantığı (JavaScript)
 * TCKN'nin ilk 9 hanesini alır ve kurallara uygun 10. ve 11. kontrol basamaklarını hesaplar.
 * @param {string} ilk_9_hane - TCKN'nin ilk 9 hanesi (string).
 * @returns {object} { sonucMetni: string, hataMi: boolean }
 */
function tcknKontrolBasamaklariniHesapla(ilk_9_hane) {
    
    // Eğer giriş 9 haneden kısa ise, tamamlanmasını bekle
    if (ilk_9_hane.length < 9) {
        const eksik_hane = 9 - ilk_9_hane.length;
        return {
            sonucMetni: `Lütfen ${eksik_hane} hane daha giriniz.`,
            hataMi: false
        };
    }
    
    // 1. Kontrol: İlk hane 0 olamaz.
    if (ilk_9_hane.charAt(0) === '0') {
        return {
            sonucMetni: "Hata: TCKN'nin ilk hanesi sıfır olamaz.",
            hataMi: true
        };
    }

    // Rakamları sayı dizisine dönüştürme
    const rakamlar = ilk_9_hane.split('').map(Number);
    
    let tek_haneler_toplami = 0; // 1., 3., 5., 7., 9. haneler (indeks 0, 2, 4, 6, 8)
    let cift_haneler_toplami = 0; // 2., 4., 6., 8. haneler (indeks 1, 3, 5, 7)

    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) { 
            tek_haneler_toplami += rakamlar[i];
        } else {
            cift_haneler_toplami += rakamlar[i];
        }
    }
    
    // --- 10. Hanenin Hesaplanması ---
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const onuncu_hane = (kontrol_farki % 10 + 10) % 10;
    
    // --- 11. Hanenin Hesaplanması ---
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + onuncu_hane;
    const onbirinci_hane = ilk_10_toplami % 10;
    
    // Sonucu birleştirme
    const tamamlanmis_tckn = ilk_9_hane + String(onuncu_hane) + String(onbirinci_hane);
    
    return {
        sonucMetni: `**TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color);">${tamamlanmis_tckn}</span>`,
        hataMi: false
    };
}

// HTML arayüzünden anlık tetiklenecek ana fonksiyon
function tamamlayiciyiCalistir() {
    const inputElement = document.getElementById('tckn-input');
    const sonucElement = document.getElementById('sonuc');
    
    const ilk_9_hane = inputElement.value.trim();
    
    const sonuc = tcknKontrolBasamaklariniHesapla(ilk_9_hane);
    
    sonucElement.innerHTML = sonuc.sonucMetni;
    
    // Hata vurgulamasını yönetme
    if (sonuc.hataMi) {
        sonucElement.classList.add('error-box');
        inputElement.classList.add('error-border');
    } else {
        sonucElement.classList.remove('error-box');
        inputElement.classList.remove('error-border');
    }

    // Giriş tamamen boşsa, başlangıç metnine dön
    if (ilk_9_hane === '') {
        sonucElement.innerHTML = 'Lütfen ilk 9 haneyi giriniz...';
    }
}