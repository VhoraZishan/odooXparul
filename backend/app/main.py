from fastapi import FastAPI

from app.routers import trips, auth, users, explore, itinerary, expenses, checklists, notes, community

app = FastAPI()


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