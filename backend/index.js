const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const connectDB = require("./utils/database");

const app = express();

dotenv.config({});

const port = process.env.PORT || 5000;

app.use(cors({}));

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "PUT", "POST", "DELETE"],
//   })
// );
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/movie", searchRoutes);
app.use("/auth", userRoutes);
app.use("/playlist", playlistRoutes);

//Connecting to DB
connectDB(process.env.DB_URI);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
