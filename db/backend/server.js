const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
    origin:"*"
}));

app.use(express.json());

// FRONTEND CONNECTION

app.use(express.static(path.join(__dirname, "../frontend")));

// ROUTES

app.use("/patients", require("./routes/patients"));

app.use("/doctors", require("./routes/doctors"));

app.use("/hospitals", require("./routes/hospitals"));

app.use("/diagnosis", require("./routes/diagnosis"));

app.use("/treatments", require("./routes/treatments"));

app.use("/reports", require("./routes/reports"));

app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
