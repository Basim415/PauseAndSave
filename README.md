# ⏸️ PauseAndSave - YouTube Video Bookmark & Summary Extension

**PauseAndSave** is a Chrome extension that lets users bookmark specific moments in any YouTube video and add descriptions to revisit them later. It also provides full-video summarization with adjustable summary length, offering a streamlined experience for learners, researchers, and casual viewers alike.

---

## 🚀 Features

- 🏷️ Save and manage bookmarks with custom labels for any timestamp  
- ▶️ Click-to-jump directly to saved moments  
- 🗑️ One-click delete for bookmarks  
- 📄 Summarize entire YouTube videos using selectable summary lengths  
- 🧠 Summaries generated locally with no OpenAI usage  
- 🎨 Dark-themed UI for modern browsing  
- 🔐 API keys hidden with `.gitignore` (if applicable)

---

## 🛠️ Tech Stack

- JavaScript (ES6+)  
- HTML5 & CSS3  
- Chrome Extension APIs  
- Node.js & Express (local summary server)  
- Python (transcription server)  
- ffmpeg (for audio processing)  
- `whisper.cpp` for transcription  

---

## 🔧 Setup Instructions

1. **Clone the repository and unzip the contents:**
   ```bash
   git clone https://github.com/yourusername/PauseAndSave.git
   ```

2. **Install Node.js dependencies:**
   ```bash
   cd PauseAndSave
   npm install
   ```

3. **Run the summary server:**
   ```bash
   node transcript_server/server.js
   ```

4. **(Optional) Run the Python transcription server:**
   ```bash
   cd python_server
   python3 app.py
   ```

5. **Load the extension in Chrome:**
   - Go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `PauseAndSave` folder

---

📝 **Note**  
The summary feature is powered by `whisper.cpp` locally. API keys (if used) should be stored in a `.env` file and listed in `.gitignore`.

📄 **License**  
This project is open source and intended for educational and personal use only.

---

👨‍💻 **Author**  
Created by **Basim Shahzad**  
GitHub: [@Basim415](https://github.com/Basim415)
