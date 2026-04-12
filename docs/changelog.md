# Changelog

本文件記錄專案版本、發佈時間與變更摘要。版號遵循語意化版本（MAJOR.MINOR.PATCH）。

變更類型：

| 標籤 | 說明 |
|------|------|
| **New** | 新功能或新模組 |
| **Update** | 既有行為或體驗的調整（相容範圍內） |
| **Fix** | 錯誤修復 |
| **Doc** | 僅文件、註解、規格敘述 |
| **Refactor** | 重構；對外行為不變 |

---

## [0.0.1] — 2026-04-12

首版 MVP：五十音學習、小測驗、測驗紀錄與後端 API，以及 Docker／雲端部署流程。

### New

- **前端**：首頁、五十音總表、五十音小測驗（計時、計分、結束測驗）、測驗紀錄列表與明細；全站導覽列（含手機選單）；Vite 開發環境與 `/api` 開發代理。
- **後端**：FastAPI `v1`、測驗紀錄 CRUD（建立 session、列表、單筆詳情）；PostgreSQL 持久化（SQLAlchemy）；統一 API 回應信封與領域例外處理。
- **部署**：前端多階段 Docker（建置 SPA + nginx 靜態服務與 `/api` 反向代理）；後端 Docker（uvicorn）；`docker-compose` 串接前後端；README 記載 ECR／EC2 發佈與 Alembic 遷移流程。

### Doc

- `docs/specification.md`（產品規格）、`docs/design-system.md`（UI token）、`docs/architecture.md`（系統架構）、`docs/api-document.md`（HTTP API 與範例）；根目錄 `README.md`、`CLAUDE.md` 開發指引。

此版尚無 **Update**、**Fix**、**Refactor** 項目。
