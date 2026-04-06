# Nihongo Learning App

Nihongo Learning App 是一個學習日文的 app，它可以幫助你學習、測驗你的日文知識，並記錄你每次的學習成果。

## Project Overview

### Tech Stack

Frontend
- **React 18** + **TypeScript**
- **Vite** — dev server and bundler
- **Tailwind CSS v3** — utility-first styling with design token variables
- **React Router v6** — client-side routing
- **shadcn/ui** — base UI components (`src/components/ui/`)

Backend
- **FastAPI** — API framework
- **SQLAlchemy** — ORM
- **Pydantic** — schema validation
- **pydantic-settings** — environment configuration

### Structure

This project includes frontend and backend features, and it is bootstrap by AI (mostly Claude).

```
nihongo-learning-app
├── .claude/skills      ← 特定的 AI 技能，像是測試、撰寫文件、重構等
├── docs/               ← 特定內容的詳細文件，像是規格書(sepcification.md)、設計文件(design-system.md)等
├── backend/            ← 後端服務資料夾
├── frontend/           ← 前端服務資料夾
├── CLAUDE.md           ← AI 代理閱讀的入口，盡量以一些通則為主，詳細的資料可以依照用途、領域寫在 docs/ 或 skills/ 底下
└── README.md           ← 一般開發者閱的入口
```

## Development

### Frontend

We use `npm` to manipulate the frontend project.

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### Backend

We use `pip` to manipulate libraries under `venv`, and running server with `uvicorn`.

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start dev server
uvicorn app.main:app --reload
```

## Documents

Documents are written under `docs/`.

- See [`docs/design-system.md`](docs/design-system.md) for color tokens, spacing, and typography guidelines.
- See [`docs/specification.md`](docs/specification.md) for feature descriptions and business logic.
