import app from "./app.js"
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const PORT = process.env.PORT || 8000;

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
});
