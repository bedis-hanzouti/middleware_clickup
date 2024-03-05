require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT;
const db = require("./config/dataBase/dbConfig");

const cronJob = require("./config/jobs/getProjectCron");

const workspaceRoute = require("./routes/workspaceRoute");
const spaceRoutes = require("./routes/spaceRoute");
const folderRoutes = require("./routes/folderRoute");
const listRoutes = require("./routes/listRoute");
const taskRoutes = require("./routes/taskRoute");
const userRoutes = require("./routes/userRoute");

app.use(`/api/workspace`, workspaceRoute);
app.use(`/api/spaces/`, spaceRoutes);
app.use(`/api/folders/`, folderRoutes);
app.use(`/api/lists/`, listRoutes);
app.use(`/api/tasks/`, taskRoutes);
app.use(`/api/users/`, userRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
