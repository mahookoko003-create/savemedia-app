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
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });

        // Siyah ekrana düşmemek için gelen cevabı kontrol ediyoruz
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Sunucu isteği reddetti.");
        }

        const data = await response.json();

        if (data.success) {
            // Hacker Tüneli Linki
            const proxyUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(data.download_url)}`;

            resultDiv.innerHTML = `
                <div style="margin-top: 15px; border-top: 2px solid #eee; padding-top: 15px; text-align: left;">
                    <h3 style="font-size: 16px; margin-bottom: 10px; color: #333;">${data.title}</h3>
                    ${data.thumbnail ? `<img src="${data.thumbnail}" style="width: 100%; max-width: 200px; border-radius: 5px; margin-bottom: 10px; display: block;">` : ''}
                    
                    <a href="${proxyUrl}" style="
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
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>❌ Hata: Link çözülemedi.</p>`;
        }

    } catch (error) {
        console.error("Hata Detayı:", error);
        // Siyah ekrandaki hatayı burada sitemizin içine okunaklı şekilde yazdırıyoruz
        resultDiv.innerHTML = `
            <div style="margin-top: 15px; background: #fde8e8; border: 1px solid #f8b4b4; padding: 12px; border-radius: 5px; text-align: left;">
                <p style="color: #9b1c1c; font-weight: bold; margin: 0 0 5px 0;">❌ Sistem Uyarısı</p>
                <p style="color: #c81e1e; font-size: 14px; margin: 0;">${error.message}</p>
            </div>
        `;
    }
}
