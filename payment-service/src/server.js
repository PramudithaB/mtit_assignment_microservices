const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
