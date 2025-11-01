/**
 * TCKN Tamamlama ve Kontrol Mantığı (JavaScript)
 * TCKN'nin ilk 9 hanesini alır ve kurallara uygun 10. ve 11. kontrol basamaklarını hesaplar.
 * @param {string} ilk_9_hane - TCKN'nin ilk 9 hanesi (string).
 * @returns {string} Tamamlanmış TCKN veya Hata mesajı.
 */
function tcknKontrolBasamaklariniHesapla(ilk_9_hane) {
    
    // 1. Giriş Kontrolleri
    if (ilk_9_hane.length !== 9 || isNaN(ilk_9_hane) || ilk_9_hane.charAt(0) === '0') {
        return "Hata: Lütfen TCKN'nin ilk 9 hanesini (0 ile başlamayan, sadece rakam) tam ve doğru giriniz.";
    }

    // Rakamları sayı dizisine dönüştürme
    const rakamlar = ilk_9_hane.split('').map(Number);
    
    let tek_haneler_toplami = 0; // 1., 3., 5., 7., 9. haneler (indeks 0, 2, 4, 6, 8)
    let cift_haneler_toplami = 0; // 2., 4., 6., 8. haneler (indeks 1, 3, 5, 7)

    // Toplamları hesaplama
    for (let i = 0; i < 9; i++) {
        if ((i + 1) % 2 === 1) { // Tek sıradaki haneler
            tek_haneler_toplami += rakamlar[i];
        } else { // Çift sıradaki haneler
            cift_haneler_toplami += rakamlar[i];
        }
    }
    
    // --- 10. Hanenin Hesaplanması ---
    // Kural: (Teklerin Toplamı * 7) - Çiftlerin Toplamı
    const kontrol_farki = (tek_haneler_toplami * 7) - cift_haneler_toplami;
    const onuncu_hane = (kontrol_farki % 10 + 10) % 10; // Negatif sonuçları düzeltmek için (+10)%10 kullanıldı
    
    // --- 11. Hanenin Hesaplanması ---
    // İlk 9 hanenin toplamı + yeni bulunan 10. hane
    const ilk_10_toplami = rakamlar.reduce((toplam, mevcut) => toplam + mevcut, 0) + onuncu_hane;
    const onbirinci_hane = ilk_10_toplami % 10;
    
    // Sonucu birleştirme
    const tamamlanmis_tckn = ilk_9_hane + String(onuncu_hane) + String(onbirinci_hane);
    
    return `**TAMAMLANMIŞ TCKN:** <span style="color: var(--primary-color);">${tamamlanmis_tckn}</span>`;
}

// HTML arayüzünden tetiklenecek ana fonksiyon
function tamamlayiciyiCalistir() {
    const inputElement = document.getElementById('tckn-input');
    const sonucElement = document.getElementById('sonuc');
    
    // Girişi temizleme ve sadece ilk 9 haneyi alma
    const ilk_9_hane = inputElement.value.trim().substring(0, 9);
    
    const sonuc = tcknKontrolBasamaklariniHesapla(ilk_9_hane);
    
    sonucElement.innerHTML = sonuc;
}