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

## Database Migration

Migrations are managed manually via Alembic and must be run before deploying a new version that includes schema changes.

```bash
cd backend
source venv/bin/activate

# Check current revision
alembic current

# Create a new migration (after modifying SQLAlchemy models)
alembic revision --autogenerate -m "description of change"

# Apply all pending migrations
alembic upgrade head
```

## Deployment

This project is deployed on an AWS EC2 instance using Docker Compose. Images are built for `linux/amd64` and stored in AWS ECR. The database is an external PostgreSQL server (not managed by Docker Compose).

### Prerequisites

- Docker with BuildKit support (for `--platform` cross-compilation)
- AWS CLI configured with ECR access (`ecr:GetAuthorizationToken`, `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer`, `ecr:PutImage`)
- Two ECR repositories created: `nihongo-frontend` and `nihongo-backend`

### Build and Push Images to ECR

Run these commands locally whenever you want to release a new version. Images are built for `linux/amd64` to ensure compatibility with EC2 instances when developing on Apple Silicon.

```bash
# Set your ECR registry (replace with your values)
export ECR_REGISTRY=<aws-account-id>.dkr.ecr.<region>.amazonaws.com
export IMAGE_TAG=latest  # or a specific version/commit SHA
export AWS_REGION=<region>

# Authenticate Docker with ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

# Build and push backend
docker buildx build --platform linux/amd64 \
  -t $ECR_REGISTRY/nihongo-backend:$IMAGE_TAG ./backend --push

# Build and push frontend
docker buildx build --platform linux/amd64 \
  -t $ECR_REGISTRY/nihongo-frontend:$IMAGE_TAG ./frontend --push
```

### Deploy on EC2

1. SSH into the EC2 instance and copy `docker-compose.yml` to the server.

2. Create a `.env` file from the example:

```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Authenticate Docker with ECR on the EC2 instance:

```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
```

4. Pull the latest images and start services:

```bash
docker compose pull
docker compose up -d
```

The app will be available on port 80.

### Service Architecture

```
Browser → nginx (port 80)
            ├── /api/*  → backend (FastAPI, port 8000)
            └── /*      → React SPA (static files)

backend → PostgreSQL (external server)
```

---

## Documents

Documents are written under `docs/`.

- See [`docs/design-system.md`](docs/design-system.md) for color tokens, spacing, and typography guidelines.
- See [`docs/specification.md`](docs/specification.md) for feature descriptions and business logic.
