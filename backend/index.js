import express from "express";
import { getRandomUsername } from "./getRandomUserName.js"; // ✅ Add `.js`
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const username = getRandomUsername();
  const uniqueId = nanoid();

  res.status(200).json({ username, uniqueId });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
