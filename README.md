# AgriScan - Tomato Leaf Disease Detection

AI-powered tomato leaf disease detection system using YOLOv11. Upload drone or camera images of tomato leaves and get instant disease diagnosis with treatment recommendations.

![AgriScan](https://img.shields.io/badge/AgriScan-Leaf%20Analysis-green)
![YOLOv11](https://img.shields.io/badge/AI-YOLOv11-blue)
![React](https://img.shields.io/badge/Frontend-React%2018-61dafb)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)

## Live Demo

- **Frontend:** https://agriscan-app.netlify.app
- **Backend API:** https://agriscan-backend-production.up.railway.app

## Features

- Upload multiple images (50+ at once)
- Real-time AI analysis using YOLOv11
- Detection of 9 disease classes:
  - Early Blight
  - Late Blight
  - Leaf Miner
  - Leaf Mold
  - Mosaic Virus
  - Septoria Leaf Spot
  - Spider Mites
  - Yellow Leaf Curl Virus
  - Healthy
- Detailed symptoms and treatment recommendations
- Risk level classification (Healthy, Low, Medium, High)
- Responsive design for desktop and mobile
- Drag & drop image upload

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- FastAPI (Python)
- YOLOv11 (Ultralytics)
- CPU-optimized inference

### Deployment
- Frontend: Netlify
- Backend: Railway

## Project Structure

```
AgriScan/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Dropzone.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ConfirmModal.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LabPage.tsx
│   │   └── DiseasesPage.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── public/
    └── _redirects
```

## Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://agriscan-backend-production.up.railway.app
```

### Backend
```
PORT=8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | API health status |
| POST | `/analyze-base64` | Analyze base64 encoded image |

## Model Information

- **Model:** YOLOv11 (trained on tomato leaf disease dataset)
- **Accuracy:** 85%+
- **Classes:** 9 disease categories
- **Input:** RGB images (any resolution)
- **Output:** Bounding boxes with class labels and confidence scores

## Screenshots

### Landing Page
Clean, modern landing page with feature highlights and call-to-action buttons.

### Analysis Lab
Upload images via drag & drop, view analysis results with confidence scores.

### Disease Guide
Comprehensive guide with symptoms, causes, and treatment methods for each disease.

## License

MIT License

## Author

Built with Claude Code
