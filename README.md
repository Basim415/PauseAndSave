# ⏸️ PauseAndSave - YouTube Video Bookmark & Summary Extension

**PauseAndSave** is a Chrome extension that lets users bookmark specific moments in any YouTube video and add descriptions to revisit them later. It also provides full-video summarization with adjustable summary length, offering a streamlined experience for learners, researchers, and casual viewers alike.

---

## 🚀 Features

- 🏷️ Save and manage bookmarks with custom labels for any timestamp  
- ▶️ Click-to-jump directly to saved moments  
- 🗑️ One-click delete for bookmarks  
- 📄 Summarize entire YouTube videos using selectable summary lengths  
- 🧠 Summaries generated locally using `whisper.cpp` and the **Cohere API**  
- 🎨 Dark-themed UI for modern browsing  

---

## 🛠️ Tech Stack

- JavaScript (ES6+)  
- HTML5 & CSS3  
- Chrome Extension APIs  
- Node.js & Express (local summary server)  
- Python (transcription server)  
- ffmpeg (for audio processing)  
- `whisper.cpp` for transcription  
- **Cohere API** for summarization

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

3. **Add your Cohere API key:**
   - Create a `.env` file in the root directory.
   - Add the following line:
     ```
     COHERE_API_KEY=your_api_key_here
     ```

4. **Run the summary server:**
   ```bash
   node transcript_server/server.js
   ```

5. **(Optional) Run the Python transcription server:**
   ```bash
   cd python_server
   python3 app.py
   ```

6. **Load the extension in Chrome:**
   - Go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `PauseAndSave` folder

---

📝 **Note**  
The summarization feature requires a **Cohere API key**. Summaries are generated locally using transcribed audio and Cohere’s large language models. Ensure your `.env` file is listed in `.gitignore`.

📄 **License**  
This project is open source and intended for educational and personal use only.

---

👨‍💻 **Author**  
Created by **Basim Shahzad**  
GitHub: [@Basim415](https://github.com/Basim415)
