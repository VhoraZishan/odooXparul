from fastapi import FastAPI

from app.database import engine, Base
from app.routers import trips, auth, users, explore, itinerary, expenses, checklists, notes, community

# Generate local database tables on startup
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Server is running"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(explore.router)
app.include_router(itinerary.router)
app.include_router(expenses.router)
app.include_router(checklists.router)
app.include_router(notes.router)
app.include_router(community.router)