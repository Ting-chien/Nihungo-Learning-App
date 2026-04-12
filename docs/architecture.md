# Architecture

本文件以 **high level** 說明 Nihongo Learning App 的前端、後端模組分工，以及部署到雲端時各元件的關係。實作細節仍以程式與 [`CLAUDE.md`](../CLAUDE.md) 為準。

相關文件：

- 產品行為：[`specification.md`](specification.md)
- HTTP 合約：[`api-document.md`](api-document.md)
- UI token：[`design-system.md`](design-system.md)

---

## 系統總覽（邏輯層）

```
┌─────────────┐         HTTP(S)          ┌──────────────────────────────────┐
│   Browser   │ ───────────────────────► │  Host (e.g. EC2 + Docker Compose) │
└─────────────┘                          │                                   │
       │                                 │  ┌──────────┐    ┌─────────────┐  │
       │  HTML/JS/CSS (SPA)              │  │ frontend │    │  backend    │  │
       │  /api/*  JSON                   │  │ (nginx)  │───►│  (FastAPI)  │  │
       └────────────────────────────────►│  │  :80     │    │  :8000      │  │
                                         │  └──────────┘    └──────┬──────┘  │
                                         └────────────────────────┼─────────┘
                                                                  │ SQL
                                                                  ▼
                                                         ┌─────────────────┐
                                                         │   PostgreSQL    │
                                                         │ (external DB)   │
                                                         └─────────────────┘
```

- 使用者只對 **對外 80**（或本機對應 port）連線；**API 路徑與靜態站同源**，由 nginx 分流。
- **PostgreSQL** 不在 Compose 內，由環境變數指定連線（見 README / `.env.example`）。

---

## 前端（`frontend/`）

### 技術棧（摘要）

React 18、TypeScript、Vite、Tailwind、React Router；UI 基底為 shadcn/ui（`src/components/ui/`）。

### 目錄與責任（概念）

```
Browser
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  App shell                                               │
│  • Router (pages)                                        │
│  • NavBar (feature component)                            │
└─────────────────────────────────────────────────────────┘
   │
   ├── pages/          畫面組裝：首頁、五十音表、測驗、紀錄
   ├── hooks/          可複用流程（例：小測驗狀態機）
   ├── services/       集中 API 呼叫（quiz history）
   ├── types/          與後端 JSON 對齊的型別
   ├── lib/            純資料／工具（例：假名表、抽題）
   └── components/
         ├── ui/       設計系統元件
         └── features/  與功能綁定的 UI（例：導覽列）
```

### 開發 vs 正式（請求怎麼到後端）

```
【本機開發】
  Browser ──► http://localhost:5173/api/...  ──► Vite dev server (proxy) ──► :8000 FastAPI

【Docker / 雲端】
  Browser ──► http://<host>/api/...  ──► nginx (frontend 容器) ──► backend:8000
```

- **`vite.config.ts`**：僅開發模式，把 `/api` 轉發到本機後端。
- **`nginx.conf`**：正式映像內，靜態檔 + `/api` 反向代理 + SPA fallback。

---

## 後端（`backend/`）

### 技術棧（摘要）

FastAPI、SQLAlchemy（同步）、Pydantic、pydantic-settings；遷移使用 Alembic（見 README）。

### 分層（請求流向）

```
HTTP Request
     │
     ▼
┌─────────────────┐
│  api/v1/        │  Router：路由、依賴注入、回傳 envelope
│  endpoints/     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  services/      │  Use case / 業務規則
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  repositories/  │  資料存取（SQLAlchemy session）
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  models/        │  ORM 實體（例：quiz_sessions, quiz_answers）
└─────────────────┘

  schemas/     ← 請求/回應與 ORM 分離
  core/        ← 設定、DB session、例外型別
```

目前 MVP 的 API  surface 以 **quiz-history** 為主：`POST/GET /api/v1/quiz-history` 等（細節見 [`api-document.md`](api-document.md)）。

---

## 部署與雲端架構

### 建置與映像

```
開發者機器
    │
    │  docker buildx (linux/amd64) + push
    ▼
┌─────────────────┐
│     AWS ECR     │
│  nihongo-frontend
│  nihongo-backend
└────────┬────────┘
         │  pull
         ▼
┌─────────────────┐
│   AWS EC2       │
│  docker compose │
└─────────────────┘
```

- 映像標籤與 registry 由環境變數控制（`ECR_REGISTRY`、`IMAGE_TAG`）。
- Apple Silicon 開發機常以 **`linux/amd64`** 建置以相容常見 EC2。

### 執行時（Compose 概念）

```
                    ┌─────────────────────┐
                    │  docker network     │
                    │  (external name     │
                    │   in compose file)  │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
   ┌─────▼─────┐                               ┌─────▼─────┐
   │ frontend  │  proxy /api/*                 │ backend   │
   │ container │ ─────────────────────────────►│ container │
   │ nginx:80  │                               │ uvicorn   │
   └───────────┘                               └───────────┘
                                                       │
                                                       └──► PostgreSQL (外部)
```

- **frontend** 對外開 **80**；**backend** 通常僅在內部網路被 nginx 存取。
- 資料庫連線由 **backend 容器環境變數**（`DB_*`）提供。

---

## 延伸閱讀

- 本機與 EC2 操作步驟：專案根目錄 [`README.md`](../README.md) 的 **Deployment**、**Database Migration** 小節。
