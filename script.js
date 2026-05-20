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

        const data = await response.json();

        if (data.success) {
            // HACKER DOKUNUŞU: href kısmını bizim proxy tüneline yönlendirdik!
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
            resultDiv.innerHTML = `<p style='color: red;'>❌ Hata: ${data.detail || 'Link çözülemedi.'}</p>`;
        }

    } catch (error) {
        resultDiv.innerHTML = "<p style='color: red;'>❌ Sunucuya bağlanılamadı.</p>";
    }
}
