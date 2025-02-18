# Canvas Grade Calculator Extension

This Chrome extension calculates or "What-Ifs" your total grade in a Canvas course.  

## Setup

1. Clone or download this folder to your computer.
2. In Google Chrome, go to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select this folder (`canvas-grade-extension`).
5. The extension (named "Canvas Grade Calculator") should appear in your toolbar.

## Usage

1. Go to your Canvas course’s **Grades** page (where all your assignments and scores are listed).
2. Click the extension icon, then click **“Calculate Grades.”**
3. Open the Developer Tools console (`Ctrl+Shift+J` on Windows / `Cmd+Option+J` on Mac) to see the logs.  

- If the course has **weighted assignment groups**, the script computes a partial weighted average for only “graded” items.
- Otherwise, it simply sums all visible scores vs. possible points from the table to give a total percentage.
