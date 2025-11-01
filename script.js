// --- KREDİ KARTI DOĞRULAMA (LUHN ALGORİTMASI) ---

/**
 * Kredi kartı numarasını Luhn Algoritması (Mod 10) ile doğrular.
 * @param {string} kart_no - Kredi kartı numarası (13-19 hane).
 * @returns {object} { sonucMetni: string, hataMi: boolean, durum: 'default'|'success'|'error' }
 */
function luhnAlgoritmasiKontrolu(kart_no) {
    kart_no = kart_no.replace(/\s/g, ''); // Boşlukları kaldır
    const uzunluk = kart_no.length;

    if (uzunluk < 13) {
        return { sonucMetni: `Geçerli bir kart numarası 13-19 hane olmalıdır.`, hataMi: false, durum: 'default' };
    }
    
    if (uzunluk > 19) {
        return { sonucMetni: `Hata: Kart numarası 19 haneden fazla olamaz.`, hataMi: true, durum: 'error' };
    }

    let toplam = 0;
    let cift_hane = false; // Sağdan başlayarak her ikinci hane

    // Sağdan sola döngü
    for (let i = uzunluk - 1; i >= 0; i--) {
        let rakam = parseInt(kart_no.charAt(i), 10);

        if (cift_hane) {
            rakam *= 2;
            if (rakam > 9) {
                rakam -= 9; // Veya rakam = rakam - 9
            }
        }

        toplam += rakam;
        cift_hane = !cift_hane; // Bir sonraki hane için durumu değiştir
    }

    if (toplam % 10 === 0) {
        return { sonucMetni: `✔ Kart Numarası Luhn Algoritmasını GEÇTİ.`, hataMi: false, durum: 'success' };
    } else {
        return { sonucMetni: `❌ Kart Numarası Luhn Algoritmasında BAŞARISIZ.`, hataMi: true, durum: 'error' };
    }
}


// --- TCKN DOĞRULAMA & TAMAMLAMA ---

/**
 * TCKN Algoritma Kontrollerini Gerçekleştirir.
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

    // (TCKN hesaplama mantığı önceki yanıttaki gibi devam eder)
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


// --- ANA YÖNLENDİRİCİ FONKSİYONLAR ---

/**
 * Seçilen projeye göre HTML arayüzünü günceller (Sadece etiket ve max uzunluk).
 */
function resetAndChangeProject() {
    const secim = document.getElementById('proje-secim').value;
    const inputAlan = document.getElementById('input-alan');
    const inputLabel = document.getElementById('input-label');
    
    // Değerleri temizle
    inputAlan.value = '';
    
    if (secim === 'tckn') {
        inputLabel.innerHTML = "TC Kimlik No'nun İlk 9 VEYA Tamamını (11 hane) Girin:";
        inputAlan.placeholder = "9 hane tamamlama yapar, 11 hane doğrular";
        inputAlan.maxLength = 11;
    } else if (secim === 'kredi_karti') {
        inputLabel.innerHTML = "Kredi Kartı Numarasını Girin (13-19 hane):";
        inputAlan.placeholder = "Doğrulama için tüm haneleri girin (Boşluksuz)";
        inputAlan.maxLength = 19; 
    }
    
    // Arayüzü temizle ve varsayılan başlatıcıyı çağır
    calistirici(); 
}


/**
 * Ana çalıştırıcı. Seçime göre doğru algoritma fonksiyonunu çağırır.
 */
function calistirici() {
    const inputElement = document.getElementById('input-alan');
    const sonucElement = document.getElementById('sonuc');
    const secim = document.getElementById('proje-secim').value;
    
    const input_degeri = inputElement.value.trim();
    let sonuc;

    // Yönlendirme
    if (secim === 'tckn') {
        sonuc = tcknAlgoritmaKontrolu(input_degeri);
    } else if (secim === 'kredi_karti') {
        sonuc = luhnAlgoritmasiKontrolu(input_degeri);
    } else {
        sonuc = { sonucMetni: 'Lütfen bir proje seçin.', hataMi: false, durum: 'default' };
    }

    sonucElement.innerHTML = sonuc.sonucMetni;
    
    // Sınıflandırma ve Vurgulama Yönetimi (Input ve Sonuç Kutusu)
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

// Sayfa yüklendiğinde bir kez çalıştır
document.addEventListener('DOMContentLoaded', calistirici);