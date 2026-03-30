const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
