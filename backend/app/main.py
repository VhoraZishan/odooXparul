from fastapi import FastAPI

from app.routers import trips

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Server is running"}


app.include_router(trips.router)