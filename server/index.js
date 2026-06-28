import dotenv from "dotenv";
dotenv.config();
const app = (await import("./src/app.js")).default;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
