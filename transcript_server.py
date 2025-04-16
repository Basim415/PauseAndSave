from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows your Node.js backend or Chrome extension to call this API

@app.route("/transcript", methods=["GET"])
def get_transcript():
    video_id = request.args.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        # Fetch the transcript from YouTube
        transcript = YouTubeTranscriptApi.get_transcript(video_id)

        # Combine all text into one big string
        full_text = " ".join([entry['text'] for entry in transcript])

        return jsonify({ "transcript": full_text })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(port=4000)
