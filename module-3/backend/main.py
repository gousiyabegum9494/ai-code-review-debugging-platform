from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.debugging import router as debugging_router


app = FastAPI(
    title="AI Debugging & Fix Generation",
    description="Module 3 - Educational debugging, fix generation, and optional practice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(debugging_router)


@app.get("/")
def home():
    return {
        "message": "AI Debugging & Fix Generation is running",
        "module": "Module 3",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8003, reload=True)
