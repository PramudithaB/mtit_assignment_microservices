const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
