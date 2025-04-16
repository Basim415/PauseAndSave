(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            waitForYouTubeElements();
        } else if (type === "PLAY") {
            const timeInSeconds = parseFloat(value);

            // Always reselect video element
            const player = document.querySelector("video.video-stream");
            if (player && !isNaN(timeInSeconds)) {
                player.pause(); // ← this helps on some browsers
                player.currentTime = timeInSeconds;

                // defer playing slightly to ensure seek takes effect
                setTimeout(() => player.play().catch(e => console.error("Playback failed", e)), 200);
            } else {
                console.warn("No video player found or invalid time", player, timeInSeconds);
            }
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
        }

        return true;
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    const newVideoLoaded = async () => {
        youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
        youtubePlayer = document.getElementsByClassName("video-stream")[0];

        if (!youtubeLeftControls || !youtubePlayer) return;

        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls.appendChild(bookmarkBtn);

            bookmarkBtn.addEventListener("click", async () => {
                const currentTime = youtubePlayer.currentTime;
                currentVideoBookmarks = await fetchBookmarks();

                const alreadyExists = currentVideoBookmarks.some(
                    (b) => Math.floor(b.time) === Math.floor(currentTime)
                );
                if (alreadyExists) return;

                const newBookmark = {
                    time: currentTime,
                    desc: "Bookmark at " + getTime(currentTime)
                };

                chrome.storage.sync.set({
                    [currentVideo]: JSON.stringify(
                        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
                    )
                });
            });
        }

        currentVideoBookmarks = await fetchBookmarks();
    };

    const waitForYouTubeElements = () => {
        const interval = setInterval(() => {
            const leftControls = document.getElementsByClassName("ytp-left-controls")[0];
            const video = document.getElementsByClassName("video-stream")[0];
    
            if (leftControls && video) {
                youtubeLeftControls = leftControls;
                youtubePlayer = video;
    
                const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
                if (!bookmarkBtnExists) {
                    clearInterval(interval);
                    newVideoLoaded(); 
                }
            }
        }, 300);
    };    

    const getTime = (t) => {
        const date = new Date(0);
        date.setSeconds(t);
        return date.toISOString().substr(11, 8);
    };
})();
