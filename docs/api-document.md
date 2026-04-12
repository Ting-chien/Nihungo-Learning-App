# API Document

後端 **FastAPI** 的 HTTP 介面說明。所有路徑皆以 **`/api/v1`** 為前綴（在 `app/main.py` 掛載）。

---

## 共通格式

### 成功回應

多數端點使用統一信封（與前端 `ApiResponse<T>` 對齊）：

```json
{
  "success": true,
  "message": "字串說明",
  "data": {}
}
```

`data` 的型別依端點而定（見下方各節）。

### 錯誤回應

由 `AppException` 處理器轉成 JSON（無 `success: true` 時可視為失敗）：

```json
{
  "success": false,
  "message": "錯誤說明",
  "data": null
}
```

| HTTP 狀態 | 情境（目前實作） |
|-----------|------------------|
| `404` | 找不到測驗 session（`QuizSessionNotFoundError`） |
| `400` | 其他業務層 `AppException` |

一般驗證錯誤（例如 body 不符合 Pydantic）會由 FastAPI 回傳 `422` 與預設的驗證錯誤本文。

---

## Quiz history

**Base path**: `/api/v1/quiz-history`

與「五十音小測驗」完成後寫入、以及測驗紀錄頁讀取的資料一致。對應程式：`app/api/v1/endpoints/quiz_history.py`、schemas 見 `app/schemas/quiz_history.py`。

### 資料模型（摘要）

**建立一筆 session（Request body）** — `QuizSessionCreate`

| 欄位 | 型別 | 說明 |
|------|------|------|
| `score` | int | 答對題數 |
| `total` | int | 總題數（目前前端固定 10） |
| `answers` | array | 每題一筆，見下表 |

**`answers[]` 單筆** — `QuizAnswerCreate`

| 欄位 | 型別 | 說明 |
|------|------|------|
| `kana` | string | 題目假名 |
| `romaji_expected` | string | 標準答案（羅馬字） |
| `romaji_given` | string | 使用者輸入；逾時可為空字串 |
| `is_correct` | bool | 是否答對 |
| `timed_out` | bool | 是否因倒數結束而未送出 |

**列表／詳情中的 session（Response `data`）**

- 列表元素為 **summary**：`id`, `taken_at`（ISO 8601）, `score`, `total`, **`precision`**（`score/total`，`total` 為 0 時為 `0.0`）。
- 詳情在 summary 之外多了 **`answers`**，每筆含 `id`（資料庫產生的 answer id）與上述對應欄位。

---

### `POST /api/v1/quiz-history`

建立一筆已完成的測驗 session。

- **Status**: `201 Created`
- **`data`**: session summary（含新建立的 `id`、`taken_at`）

**cURL 範例**（本機直連後端）：

```bash
curl -s -X POST "http://localhost:8000/api/v1/quiz-history" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 8,
    "total": 10,
    "answers": [
      {
        "kana": "あ",
        "romaji_expected": "a",
        "romaji_given": "a",
        "is_correct": true,
        "timed_out": false
      }
    ]
  }'
```

**透過 Vite 開發代理**（瀏覽器同源、或由本機對 5173 發送）：

```bash
curl -s -X POST "http://localhost:5173/api/v1/quiz-history" \
  -H "Content-Type: application/json" \
  -d '{"score":1,"total":1,"answers":[{"kana":"い","romaji_expected":"i","romaji_given":"i","is_correct":true,"timed_out":false}]}'
```

---

### `GET /api/v1/quiz-history`

取得所有測驗 session，**新到舊**排序。

- **Status**: `200 OK`
- **`data`**: `QuizSessionSummaryResponse` 的陣列

**cURL 範例**：

```bash
curl -s "http://localhost:8000/api/v1/quiz-history"
```

---

### `GET /api/v1/quiz-history/{session_id}`

取得單一 session 與每題明細。

- **Status**: `200 OK`
- **`data`**: `QuizSessionDetailResponse`（含 `answers`）

**cURL 範例**（將 `1` 換成實際 id）：

```bash
curl -s "http://localhost:8000/api/v1/quiz-history/1"
```

**不存在時**（範例）：

```bash
curl -s -o /dev/stderr -w "%{http_code}" "http://localhost:8000/api/v1/quiz-history/999999"
# 預期 HTTP 404 與 success: false 的 JSON body
```

---

## 前端對應

`frontend/src/services/quizHistoryService.ts` 以相對路徑 **`/api/v1/quiz-history`** 呼叫上述端點；本機開發依賴 `vite.config.ts` 的 `/api` proxy，正式環境依賴 nginx 將 `/api` 轉到後端。

---

## 版本與文件維護

- API 前綴版本：**v1**（路徑 `/api/v1`）。
- 新增或變更端點時，請同步更新本檔與 [`specification.md`](specification.md) 中與產品行為相關的描述。
