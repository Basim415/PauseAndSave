import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
  const newBookmarkElement = document.createElement("div");
  newBookmarkElement.className = "bookmark";

  const playButton = document.createElement("img");
  playButton.src = "assets/play.png";
  playButton.title = "Play";
  playButton.style.cursor = "pointer";
  playButton.addEventListener("click", async () => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
      type: "PLAY",
      value: bookmark.time
    });
  });

  const deleteButton = document.createElement("img");
  deleteButton.src = "assets/delete.png";
  deleteButton.title = "Delete";
  deleteButton.style.cursor = "pointer";
  deleteButton.addEventListener("click", async () => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
      type: "DELETE",
      value: bookmark.time
    }, async () => {
      const queryParams = new URLSearchParams(activeTab.url.split("?")[1]);
      const videoId = queryParams.get("v");

      setTimeout(() => {
        chrome.storage.sync.get([videoId], (data) => {
          const updatedBookmarks = data[videoId]
            ? JSON.parse(data[videoId])
            : [];
          viewBookmarks(updatedBookmarks);
        });
      }, 100);
    });
  });

  const timeLabel = document.createElement("span");
  timeLabel.textContent = `${bookmark.desc}`;

  newBookmarkElement.appendChild(playButton);
  newBookmarkElement.appendChild(timeLabel);
  newBookmarkElement.appendChild(deleteButton);
  bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".container");
    const mainContent = document.getElementById("mainContent");
  
    let activeTab;
    try {
      activeTab = await getActiveTabURL();
    } catch (err) {
      console.error("Could not get active tab:", err);
      return;
    }
  
    const url = activeTab?.url || "";
  
    if (!url.includes("youtube.com/watch")) {
      mainContent.style.display = "none";
  
      const notYoutubeMsg = document.createElement("div");
      notYoutubeMsg.className = "not-youtube-msg";
      notYoutubeMsg.textContent = "This is not a YouTube video page.";
      container.appendChild(notYoutubeMsg);
      return;
    }
  
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");
  
    if (!currentVideo) return;
  
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
      viewBookmarks(currentVideoBookmarks);
    });
  });
  
  
document.getElementById("summarizeBtn").addEventListener("click", async () => {
    const activeTab = await getActiveTabURL();
    const summaryBox = document.getElementById("summaryResult");
  
    if (activeTab.url.includes("youtube.com/watch")) {
      const videoId = new URLSearchParams(activeTab.url.split("?")[1]).get("v");
      const length = document.getElementById("summaryLength").value;
  
      console.log("Video ID:", videoId);
      console.log("Summary length:", length);
  
      summaryBox.textContent = "Generating summary...";
  
      try {
        // Fetch transcript
        console.log("Fetching transcript...");
        const transcriptResponse = await fetch(`http://localhost:4000/transcript?video_id=${videoId}`);
        console.log("Transcript response:", transcriptResponse);
  
        if (!transcriptResponse.ok) {
          throw new Error(`Transcript fetch failed: ${transcriptResponse.status}`);
        }
  
        const transcriptData = await transcriptResponse.json();
        const transcript = transcriptData.transcript;
  
        console.log("Transcript fetched:", transcript.slice(0, 100), "...");
  
        if (!transcript) throw new Error("Transcript missing");
  
        // Send to Node summarizer
        console.log("Sending to summarizer...");
        const response = await fetch("http://localhost:3000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, length }),
        });
  
        if (!response.ok) {
          throw new Error(`Summarizer fetch failed: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Summary received:", data.summary);
        summaryBox.textContent = data.summary || "No summary returned.";
      } catch (err) {
        console.error("Error fetching summary:", err);
        summaryBox.textContent = "Error fetching summary.";
      }
    }
  });
  
