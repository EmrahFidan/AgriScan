from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import base64
import io
from PIL import Image
import os

app = FastAPI(title="AgriScan API", description="Tomato Leaf Disease Detection API")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "https://agriscan-app.netlify.app,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
model = None

def get_model():
    global model
    if model is None:
        model = YOLO(MODEL_PATH)
    return model

@app.get("/")
def root():
    return {"message": "AgriScan API - Tomato Leaf Disease Detection", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Goruntu analizi yap ve hastalik tespit et"""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if image.mode != "RGB":
            image = image.convert("RGB")

        yolo_model = get_model()
        results = yolo_model(image)

        predictions = []
        for result in results:
            if result.boxes is not None and len(result.boxes) > 0:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    class_name = result.names[class_id]
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    predictions.append({
                        "class": class_name,
                        "confidence": confidence,
                        "bbox": [x1, y1, x2 - x1, y2 - y1]
                    })

        return {
            "success": True,
            "predictions": predictions,
            "image_size": {"width": image.width, "height": image.height}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-base64")
async def analyze_base64(data: dict):
    """Base64 formatinda goruntu analizi"""
    try:
        base64_string = data.get("image", "")

        if "," in base64_string:
            base64_string = base64_string.split(",")[1]

        image_bytes = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_bytes))

        if image.mode != "RGB":
            image = image.convert("RGB")

        yolo_model = get_model()
        results = yolo_model(image)

        predictions = []
        for result in results:
            if result.boxes is not None and len(result.boxes) > 0:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    class_name = result.names[class_id]
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    predictions.append({
                        "class": class_name,
                        "confidence": confidence,
                        "bbox": [x1, y1, x2 - x1, y2 - y1]
                    })

        all_classes = list(results[0].names.values()) if results else []

        return {
            "success": True,
            "predictions": predictions,
            "image_size": {"width": image.width, "height": image.height},
            "all_classes": all_classes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
