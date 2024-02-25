require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT;
const db = require("./config/dataBase/dbConfig");

const cronJob = require("./config/jobs/getProjectCron");

const projectRoutes = require("./routes/projectRoute");

app.use(`/`, projectRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
