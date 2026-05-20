from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yt_dlp
import requests

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
    return {"status": "Sistem Aktif", "mesaj": "Tünel Motoru Hazır!"}

@app.post("/analyze")
def analyze_video(request: VideoRequest):
    video_url = request.url
    
    if "youtube.com" in video_url or "youtu.be" in video_url:
        raise HTTPException(status_code=400, detail="YouTube engeller nedeniyle kapalıdır. TikTok veya Instagram deneyin!")
    
    ydl_opts = {
        'format': 'best',
        'noplaylist': True,
        'quiet': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            title = info.get('title', 'Sosyal Medya Videosu')[:50]
            thumbnail = info.get('thumbnail', '')
            download_url = info.get('url', '')
            
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
        raise HTTPException(status_code=400, detail=f"Hata: {str(e)}")

# İŞTE HACKER TÜNELİ: Videoyu TikTok'tan bizim sunucu çekip kullanıcıya fırlatacak
@app.get("/proxy")
def proxy_download(url: str):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        # Sunucumuz videoya istek atıyor (TikTok bunu normal tarayıcı sanacak)
        req = requests.get(url, headers=headers, stream=True)
        
        # Dosyayı parça parça kullanıcının tarayıcısına akıtıyoruz
        return StreamingResponse(
            req.iter_content(chunk_size=1024*1024), 
            media_type="video/mp4",
            headers={"Content-Disposition": "attachment; filename=video.mp4"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tünel hatası: {str(e)}")
        
