import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: "https://smartsavvy.eu" }));

// Endpunkt für das Meta-Pixel
app.post("/track", async (req, res) => {
  const {
    event_name,
    event_time,
    user_data,
    event_id,
    pixel_id,
    access_token,
  } = req.body;

  if (!pixel_id || !access_token) {
    res.status(400).json({
      success: false,
      error: "Pixel-ID und Access-Token sind erforderlich.",
    });
  } else {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v13.0/${pixel_id}/events`,
        {
          data: [
            {
              event_name,
              event_time,
              user_data,
              event_id,
              action_source: "website",
            },
          ],
          access_token,
        }
      );

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error forwarding to Meta:", error.message);
        res.status(500).json({ success: false, error: error.message });
      } else {
        console.error("Unknown error occurred:", error);
        res.status(500).json({ success: false, error: error });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`First Party API running at http://localhost:${PORT}`);
});
