from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

# Sitemizin (Frontend) backend ile güvenli konuşabilmesi için izin (CORS) veriyoruz
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Gerçek hayatta buraya sadece kendi github.io linkini yazacağız
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tarayıcıdan gelecek link verisi için şablon
class VideoRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {"status": "Sistem Aktif", "mesaj": "Medya İndirici Motoruna Hoş Geldiniz!"}

@app.post("/analyze")
def analyze_video(request: VideoRequest):
    video_url = request.url
    
    # Sunucuyu yormamak için videoyu İNDİRMİYORUZ, sadece linkleri ayıklıyoruz
    ydl_opts = {
        'format': 'best',
        'noplaylist': True,
        'quiet': True
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Video bilgilerini YouTube'dan çek
            info = ydl.extract_info(video_url, download=False)
            
            # Bize lazım olan ham bilgileri ayıkla
            title = info.get('title', 'Bilinmeyen Video')
            thumbnail = info.get('thumbnail', '')
            
            # Doğrudan indirme (stream) linkleri
            download_url = info.get('url', '')
            
            return {
                "success": True,
                "title": title,
                "thumbnail": thumbnail,
                "download_url": download_url
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Link çözülemedi veya desteklenmiyor: {str(e)}")
      
