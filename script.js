// mho - render sunucu
const BACKEND_URL = "https://savemedia-app.onrender.com"; 

async function downloadMedia() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');

    if (!urlInput) {
        resultDiv.innerHTML = "<p style='color: red; font-weight: bold;'>Lütfen bir link yapıştırın!</p>";
        return;
    }

    resultDiv.innerHTML = "<p style='color: #555;'>⏳ Medya analiz ediliyor, lütfen bekleyin...</p>";

    try {
        // Render sunucumuza istek gönderiyoruz
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput })
        });

        const data = await response.json();

        if (data.success) {
            // Sunucudan veri başarıyla geldiyse ekranda gösteriyoruz
            resultDiv.innerHTML = `
                <div style="margin-top: 15px; border-top: 2px solid #eee; padding-top: 15px; text-align: left;">
                    <h3 style="font-size: 16px; margin-bottom: 10px; color: #333;">${data.title}</h3>
                    ${data.thumbnail ? `<img src="${data.thumbnail}" style="width: 100%; max-width: 200px; border-radius: 5px; margin-bottom: 10px; display: block;">` : ''}
                    
                    <a href="${data.download_url}" target="_blank" download style="
                        display: block; 
                        text-align: center; 
                        background: #2ecc71; 
                        color: white; 
                        padding: 12px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        margin-top: 10px;
                    ">📥 Medyayı Cihaza İndir</a>
                    
                    <p style="font-size: 11px; color: #888; text-align: center; margin-top: 8px;">
                        (Butona bastıktan sonra açılan sayfada sağ alttaki üç noktaya tıklayıp "İndir" diyebilirsiniz.)
                    </p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>❌ Hata: ${data.detail || 'Link çözülemedi.'}</p>`;
        }

    } catch (error) {
        console.error("Hata:", error);
        resultDiv.innerHTML = "<p style='color: red;'>❌ Sunucuya bağlanılamadı. Lütfen az sonra tekrar deneyin.</p>";
    }
}
