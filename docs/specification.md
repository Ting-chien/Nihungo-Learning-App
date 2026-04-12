# Product Specification

> This document describes existing features from a product/business perspective.
> For UI implementation details, see [`docs/design-system.md`](design-system.md).
> For HTTP contracts and examples, see [`docs/api-document.md`](api-document.md).
> For system layout (frontend / backend / cloud), see [`docs/architecture.md`](architecture.md).

---

## Overview

**大家來學日本語** is a web-based Japanese learning app targeting Mandarin-speaking beginners. It covers Japanese phonetics (hiragana) through reference charts, interactive quizzes, and **persisted quiz history** stored on the server.

---

## 1. Home

**Route**: `/`

A minimal landing view with the app title **大家來學日本語** (entry point only; no quiz logic on this page).

---

## 2. Navigation

A sticky top navbar is present on all pages.

- The **logo** ("大家來學日本語") links back to the home page (`/`).
- A **五十音** nav item expands into a dropdown with links to **五十音總表**、**小測驗**, and **測驗紀錄**.
- On **mobile** (viewport < 640px), the nav items are replaced by a hamburger button. Tapping it opens a panel below the navbar with the same 五十音 section as an accordion — the user taps the section heading to expand its links.
- The active route is visually highlighted in the nav.

---

## 3. 五十音

### 3-1. 五十音總表 (Hiragana Chart)

**Route**: `/gojuuon`

A reference chart displaying all hiragana characters arranged in the traditional 五十音 (gojuuon) grid.

**Behaviour**:
- Characters are laid out in a 5-column grid (vowel columns: a / i / u / e / o), one row per consonant group.
- Each cell shows the hiragana character and its romanization (romaji) below it.
- Empty cells (where no character exists in the standard table) are rendered as blank placeholders to preserve grid alignment.
- The chart is read-only; there is no interaction beyond scrolling.

---

### 3-2. 小測驗 (Hiragana Quiz)

**Route**: `/gojuuon/quiz`

An interactive quiz that tests the user's ability to romanize hiragana characters.

**Quiz flow**:

1. **Idle** — The user sees the quiz title and a description, then taps 開始 to begin.
2. **Answering** — One hiragana character is displayed per question. The user types its romaji into a text input and submits via the 送出 button or the Enter key.
3. **Feedback** — The result of the answer is shown immediately:
   - **Correct**: green "正確！" message.
   - **Incorrect**: red "錯誤" message with the correct answer displayed.
   - **Timed out**: red "時間到！" message with the correct answer displayed.
   The user advances to the next question via the 下一題 button or the Enter key.
4. **Done** — The final score is shown out of the total question count, with an encouraging message based on performance. The user can restart with 再來一次.

**Rules**:
- Each quiz session draws **10 questions** sampled randomly from the hiragana set.
- Each question has a **10-second countdown timer**. If the timer reaches zero before the user submits, the question is marked incorrect and treated as a timeout.
- The timer is visible in the top-right of the question area and turns red when 3 or fewer seconds remain.
- The user may tap **結束測驗** at any point during the quiz (answering or feedback state) to skip to the results screen immediately, with the score counting only questions answered so far.
- Answer matching is **case-insensitive** and ignores leading/trailing whitespace.

**Persistence**:
- When the quiz reaches the **Done** state, the client sends the full session (score, total, and per-question records) to the backend API. Saving is **best-effort**: if the API is unavailable, the UI still completes normally; no blocking error is shown for save failure.

---

### 3-3. 測驗紀錄 (Quiz History)

**Route**: `/gojuuon/history`

A page for reviewing past **五十音小測驗** attempts stored on the server.

**Behaviour**:
- On load, the client fetches the list of sessions (most recent first). If the request fails, an inline error message is shown.
- The left column (or stacked list on small screens) shows each session’s score, accuracy (precision), and timestamp.
- Selecting a session loads **detail** for that session: the same summary plus every question’s kana, what the user entered (or timeout), expected romaji, and whether each answer was correct.
- Tapping the same session again collapses the selection (mobile shows detail inline under the row; desktop shows detail in a right-hand panel).