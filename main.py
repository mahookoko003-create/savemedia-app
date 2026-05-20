from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {"status": "Sistem Aktif", "mesaj": "Sosyal Medya İndirici Motoru Aktif!"}

@app.post("/analyze")
def analyze_video(request: VideoRequest):
    video_url = request.url
    
    # YouTube dışındaki platformlar için optimize edilmiş ayarlar
    ydl_opts = {
        'format': 'best',
        'noplaylist': True,
        'quiet': True,
        # YouTube engelini tetiklememek için extractor'ları kısıtlayabiliriz ama yt-dlp otomatik seçer
    }
    
    # Güvenlik kontrolü: Eğer kullanıcı hala YouTube linki girerse uyaralım
    if "youtube.com" in video_url or "youtu.be" in video_url:
        raise HTTPException(
            status_code=400, 
            detail="YouTube telif ve bot engelleri nedeniyle geçici olarak devre dışıdır. Lütfen TikTok, Instagram veya Twitter linki deneyin!"
        )
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            title = info.get('title', 'Sosyal Medya Videosu')
            # Bazı platformlarda başlık çok uzun olur, ilk 50 karakteri alalım şık dursun
            if len(title) > 50:
                title = title[:50] + "..."
                
            thumbnail = info.get('thumbnail', '')
            download_url = info.get('url', '')
            
            # Eğer doğrudan url çıkmadıysa formatların içine bakalım
            if not download_url and info.get('formats'):
                download_url = info.get('formats')[-1].get('url', '')

            if not download_url:
                raise Exception("İndirme linki bulunamadı.")
            
            return {
                "success": True,
                "title": title,
                "thumbnail": thumbnail,
                "download_url": download_url
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Desteklenmeyen link veya erişim engeli: {str(e)}")
        
