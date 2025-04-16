import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

dotenv.config();

const app = express();
const PORT = 3000;

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

const MAX_TOKENS_PER_REQUEST = 3500;
const AVG_CHARS_PER_TOKEN = 4;

function chunkTranscript(transcript, maxTokens = MAX_TOKENS_PER_REQUEST) {
  const chunkSize = maxTokens * AVG_CHARS_PER_TOKEN;
  const chunks = [];
  for (let i = 0; i < transcript.length; i += chunkSize) {
    chunks.push(transcript.slice(i, i + chunkSize));
  }
  return chunks;
}

function buildPrompt(chunk, style) {
  const promptMap = {
    short: "Summarize the following transcript in 1-2 sentences.",
    medium: "Summarize the following transcript in a concise paragraph.",
    long: "Summarize the following transcript in detail using multiple paragraphs and main points.",
  };
  return `${promptMap[style] || promptMap.short}\n\n${chunk}`;
}

async function summarizeChunk(chunk, style) {
  const prompt = buildPrompt(chunk, style);

  const response = await cohere.generate({
    model: "command",
    prompt,
    maxTokens: 300,
    temperature: 0.5,
  });

  return response.generations[0].text.trim();
}

app.post("/summarize", async (req, res) => {
  const { transcript, length } = req.body;

  console.log("Incoming summarize request:", { length });
  console.log("Transcript length:", transcript.length);

  try {
    const chunks = chunkTranscript(transcript);
    console.log(`Transcript split into ${chunks.length} chunks.`);

    const chunkSummaries = [];
    for (const [i, chunk] of chunks.entries()) {
      console.log(`Summarizing chunk ${i + 1}/${chunks.length}...`);
      const summary = await summarizeChunk(chunk, length);
      chunkSummaries.push(summary);
    }

    const combined = chunkSummaries.join("\n\n");
    const finalPrompt = buildPrompt(combined, length);
    const finalResponse = await cohere.generate({
      model: "command",
      prompt: finalPrompt,
      maxTokens: 300,
      temperature: 0.5,
    });

    const finalSummary = finalResponse.generations[0].text.trim();
    res.json({ summary: finalSummary });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ error: "Summary failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Summarizer running at http://localhost:${PORT}`);
});
