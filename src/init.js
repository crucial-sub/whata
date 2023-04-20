import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 8000;

const handleListening = () =>
  console.log(`✅ server listening on http://localhost:${PORT}💥`);

app.listen(PORT, handleListening);
