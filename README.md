# Flashcard Learning App

A single-page web application that allows users to create, manage, and study flashcards. Users can create question-answer cards, organize them by category, click to reveal answers, and perform full CRUD operations.

## Live Demo

- Frontend: https://flashcard-app-jet-seven.vercel.app
- Backend API: https://flashcard-app-q1pb.onrender.com

## Features

- View all flashcards on a single page
- Create a new flashcard with a question, answer, and optional category
- Edit an existing flashcard
- Delete a flashcard permanently
- Click a card to flip and reveal the answer
- Click the revealed card again to dismiss it from view
- Filter cards by category

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Axios, CSS3 |
| Backend | Python, FastAPI, Uvicorn |
| Database | MongoDB Atlas (cloud-hosted) |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
flashcard-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main component with state and API calls
│   │   ├── App.css         # Styles including card flip animation
│   │   └── components/
│   │       ├── FlashcardForm.jsx   # Create/edit form
│   │       └── FlashcardItem.jsx   # Card display with flip animation
│   ├── index.html
│   └── package.json
├── backend/                # FastAPI backend
│   ├── main.py             # API server with CRUD endpoints
│   └── requirements.txt
└── flashcards_export.json  # Sample database export
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flashcards` | Get all flashcards |
| POST | `/api/flashcards` | Create a new flashcard |
| PUT | `/api/flashcards/{id}` | Update a flashcard |
| DELETE | `/api/flashcards/{id}` | Delete a flashcard |

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- A MongoDB Atlas account (or local MongoDB instance)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=flashcard_db
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Database Export

A sample export of the database collection is provided in `flashcards_export.json`. It contains example flashcard documents in MongoDB JSON format.

To import into MongoDB:

```bash
mongoimport --uri "your_connection_string" --db flashcard_db --collection flashcards --file flashcards_export.json --jsonArray
```
