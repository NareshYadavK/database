import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // IMPORTANT: to read JSON body

app.post("/api/personDetails", async (req, res) => {
  const { uidNum } = req.body;

  // Validation
  if (!uidNum) {
    return res.status(400).json({
      error: "uidNum is required"
    });
  }

  const url =
    "https://gsws-nbm.ap.gov.in/JKCSpandana/api/Spandana/personDetails";

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({ uidNum }),
      signal: controller.signal
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Upstream API error"
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({
      error: "Failed to fetch person details"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Proxy running on http://localhost:${PORT}`)
);
