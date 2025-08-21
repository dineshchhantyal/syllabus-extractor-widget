# AI Syllabus to Calendar Converter

Convert syllabus PDFs, screenshots, or copied text into calendar events (ICS + JSON) in seconds. Upload or paste → AI extracts dates → you review & adjust → export. One-time import helper, not a new calendar.

## Story Behind The Project

I built this after yet another semester kickoff where every professor dropped a differently formatted PDF and I spent an evening copy‑pasting dates into my calendar. OCR tools missed context, manual entry was error‑prone, and generic AI chat prompts produced messy, unstructured text. I wanted a focused, repeatable bridge: drop files in, get trustworthy structured events, review fast, and move on. The goals were: zero lock‑in, privacy (client state only), and intelligent assistance (fill obvious gaps, flag what it inferred). This repo is that workflow distilled.

## What It Does

Extracts: sessions, exams, quizzes, holidays, deadlines, readings, assignments, projects. Detects weekly patterns, infers missing routine sessions (clearly marked), lets you collapse/expand recurrence, edit details, and export.

## Core Features

-   Multi-file PDF/image upload
-   Paste raw syllabus text (no file needed)
-   File gallery + per-file delete (auto removes its events)
-   Optional context prompt for disambiguation
-   Type normalization & color legend
-   Inferred session gap fill (warnings shown)
-   Collapse/expand weekly recurrence
-   Month / Week / Agenda / List views (drag & drop dates)
-   Inline edit modal (type, times, notes)
-   Reset + debug JSON view
-   Export: .ics + JSON
-   Client-only state (privacy)

## Quick Start

```bash
pnpm install
cp .env.local.example .env.local   # create and add GOOGLE_GENERATIVE_AI_API_KEY
pnpm dev
```

Open http://localhost:3000 and drop your syllabus files.

`.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## Usage Flow

1. Choose Upload Files (drag/drop PDFs or images) OR Paste Text and paste copied syllabus content.
2. (Optional) Add context (course code, meeting pattern hints).
3. Extract & review events; inferred sessions are labeled.
4. Toggle recurrence to see all occurrences if needed.
5. Edit titles/times/types as desired.
6. Export `.ics` and/or JSON.

## Tech Stack

Next.js (App Router) · React 19 · TypeScript · Tailwind · Gemini via Vercel AI SDK · `ics` · `zod` · `react-dropzone`.

## Roadmap (see `/todo` page)

Light mode • Biweekly/monthly recurrence • Timezones • Bulk edit • Hide inferred toggle • Local persistence • Accessibility audit • Canvas/LMS import.

## Author

Built by [Dinesh Chhantyal](https://dineshchhantyal.com). Issues & PRs welcome.

---

Minimal on purpose. Need more detail? Check the code.
