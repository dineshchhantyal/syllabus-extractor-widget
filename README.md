# Syllabus Scraper 🗓️

A smart widget that automatically extracts deadlines and events from university syllabi and converts them into a universal calendar file (.ics), saving students time and preventing missed deadlines.

## Problem

Students receive syllabi in various formats—typically PDFs or images—at the beginning of every semester. These documents contain critical dates for assignments, exams, and projects. Manually transferring these dates into a personal calendar like Google Calendar or Apple Calendar is tedious, time-consuming, and error-prone. A single mistake can lead to a missed deadline.

## Solution

Syllabus Scraper bridges the gap between static documents and a student's dynamic digital life. It provides a simple drag-and-drop interface for uploading syllabus files. Using an AI-powered backend, it intelligently parses the document, extracts key events, and presents them in a clean, interactive list for review. Once confirmed, the user can export all events in a single click to an .ics file, ready for import into any standard calendar application.

The core principle is to respect existing workflows. Students already have their preferred calendar systems; this tool acts as a powerful, one-time import utility—not another calendar to manage.

## Features

-   **Multi-Format Upload:** Supports both PDF and image (.png, .jpg) files.
-   **AI-Powered Parsing:** Leverages a Large Language Model (LLM) on the backend for highly accurate and context-aware extraction of event details (title, date, time, type).
-   **Interactive Review Interface:** Displays extracted events in an editable list, allowing users to quickly verify, modify, or delete entries before export.
-   **One-Click Export:** Generates a universal .ics calendar file compatible with Google Calendar, Apple Calendar, Outlook, and more.
-   **Privacy-Focused:** The backend is stateless. No personal data or syllabus contents are stored on the server after processing is complete.

## Tech Stack & Architecture

This project is built using a modern full-stack approach with Next.js.

**Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
**Backend:** Next.js API Routes (Serverless Functions)
**Parsing Engine:** External Large Language Model (e.g., GPT, Claude, Llama) for intelligent text analysis

**Key Libraries:**

-   `ics.js` for generating the calendar file on the client-side
-   `react-dropzone` for the file upload interface

### Architecture Overview

1. A user uploads a file via the Next.js frontend.
2. The file is securely sent to a Next.js API Route.
3. The API route extracts the text and sends it to an LLM API for parsing.
4. The LLM returns structured JSON data (a list of events).
5. The API route sends the clean JSON back to the frontend for display.
6. The user confirms the events, and the .ics file is generated entirely in the browser.

This design ensures the user's browser remains fast and responsive while leveraging powerful server-side AI for maximum accuracy.

## Getting Started

### Prerequisites

-   Node.js (v18.0 or later)
-   pnpm or yarn
-   An API key from your chosen LLM provider

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/syllabus-scraper.git
    cd syllabus-scraper
    ```
2. **Install dependencies:**
    ```bash
    pnpm install
    # or
    yarn install
    ```
3. **Set up environment variables:**
   Create a file named `.env.local` in the root of the project and add your LLM API key:
    ```env
    LLM_API_KEY="your_api_key_here"
    ```
4. **Run the development server:**
    ```bash
    pnpm dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
