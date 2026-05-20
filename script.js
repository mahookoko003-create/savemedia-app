function downloadMedia() {
    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');

    // Kullanıcı boş link girdiyse uyaralım
    if (!urlInput) {
        resultDiv.innerHTML = "<p style='color: red;'>Lütfen bir link yapıştırın!</p>";
        return;
    }

    // Kullanıcıya işlemin başladığını gösterelim
    resultDiv.innerHTML = "<p>Medya analiz ediliyor, lütfen bekleyin...</p>";

    // İleride buraya Python backend linkimizi bağlayacağız.
    // Şimdilik sistemin çalıştığını görmek için basit bir test mesajı yazdıralım:
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                <p style="color: green; font-weight: bold;">✔ Link Başarıyla Analiz Edildi!</p>
                <p style="font-size: 14px; color: #555;">Girilen Link: ${urlInput}</p>
                <p style="font-size: 12px; color: #888;">(Python motorumuz bağlandığında indirme butonları burada belirecek)</p>
            </div>
        `;
    }, 1500); // 1.5 saniye sonra çalışır (sanki sunucudan cevap bekliyormuş gibi simüle ettik)
}
