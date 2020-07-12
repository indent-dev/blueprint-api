require("dotenv").config();
import { connectDB } from "./utils/database";
import app from "./app";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log(` -> Database connected!`);
    app.listen(port, () => {
      console.log(` -> Blueprint API started at http://localhost:${port}/`);
    });
  })
  .catch((err: string) => {
    console.log(err);
  });
