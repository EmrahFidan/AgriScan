# AgriScan 🌿

Yaprak hastalığı tespit sistemi — YOLOv11 AI ile domates yaprak analizi.

## Yapı

```
AgriScan/
├── frontend/   # React 19 + TypeScript + Vite
└── backend/    # FastAPI + YOLOv11 + Docker
```

## Kurulum

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Teknolojiler
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite
- **Backend:** FastAPI, YOLOv11, PyTorch, Docker
- **Deploy:** Netlify (frontend), Railway (backend)
