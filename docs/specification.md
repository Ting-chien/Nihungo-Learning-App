# Product Specification

> This document describes existing features from a product/business perspective.
> For UI implementation details, see `docs/design-system.md`.

---

## Overview

**大家來學日本語** is a web-based Japanese learning app targeting Mandarin-speaking beginners. It covers Japanese phonetics (hiragana) through reference charts and interactive quizzes.

---

## Features

### 1. 五十音總表 (Hiragana Chart)

**Route**: `/gojuuon`

A reference chart displaying all hiragana characters arranged in the traditional 五十音 (gojuuon) grid.

**Behaviour**:
- Characters are laid out in a 5-column grid (vowel columns: a / i / u / e / o), one row per consonant group.
- Each cell shows the hiragana character and its romanization (romaji) below it.
- Empty cells (where no character exists in the standard table) are rendered as blank placeholders to preserve grid alignment.
- The chart is read-only; there is no interaction beyond scrolling.

---

### 2. 小測驗 (Hiragana Quiz)

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

---

## Navigation

A sticky top navbar is present on all pages.

- The **logo** ("大家來學日本語") links back to the home page.
- A **五十音** nav item expands into a dropdown with links to 五十音總表 and 小測驗.
- On **mobile** (viewport < 640px), the nav items are replaced by a hamburger button. Tapping it opens a panel below the navbar with the same 五十音 section as an accordion — the user taps the section heading to expand its links.
- The active route is visually highlighted in the nav.
