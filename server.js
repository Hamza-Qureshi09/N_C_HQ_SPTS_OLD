const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const cors = require('cors');
const app = express();
const path = require("path")
const port = process.env.PORT || 5000;
require("./connection/conn");
const Routes = require("./router/Router")

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"))
app.use(cookieParser({ limit: '30mb' }))
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))


// for static images or avatar url
app.use('/Storage', express.static(path.join(__dirname, './Storage')));

// api routes
app.use("/api", Routes)

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
