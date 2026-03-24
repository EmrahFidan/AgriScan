# AgriScan Backend

FastAPI + YOLOv11 tabanlı domates yaprak hastalığı tespit API'si.

## Kurulum

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Çalıştırma

```bash
uvicorn main:app --reload
# http://localhost:8000
```

## Endpoint'ler

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | API durumu |
| GET | `/health` | Health check |
| POST | `/analyze` | Dosya yükleyerek analiz |
| POST | `/analyze-base64` | Base64 string ile analiz |

### POST /analyze-base64

```json
{ "image": "data:image/jpeg;base64,..." }
```

**Yanıt:**
```json
{
  "success": true,
  "predictions": [
    { "class": "Early_blight", "confidence": 0.92, "bbox": [x, y, w, h] }
  ],
  "image_size": { "width": 640, "height": 480 },
  "all_classes": ["healthy", "Early_blight", ...]
}
```

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|-----------|----------|
| `ALLOWED_ORIGINS` | `https://agriscan-app.netlify.app,http://localhost:5173` | CORS izinli URL'ler |
| `PORT` | `8000` | Sunucu portu |

## Docker

```bash
docker build -t agriscan-backend .
docker run -p 8000:8000 agriscan-backend
```

## Model

`best.pt` — YOLOv11x ile eğitilmiş, 9 hastalık sınıfı:
`healthy`, `Early_blight`, `Late_blight`, `Leaf_Mold`, `Septoria_leaf_spot`, `Spider_mites`, `Tomato_Yellow_Leaf_Curl_Virus`, `Tomato_mosaic_virus`, `Bacterial_spot`
