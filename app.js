const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = "mongodb://localhost:27018/data";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connexion à la base de données MongoDB réussie."))
  .catch((err) => {
    console.error("Erreur de connexion à la base de données MongoDB :", err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  color: String,
  profilePicture: String,
  initials: String,
  role: Number,
  custom_role: String,
  last_active: String,
  date_joined: String,
  date_invited: String,
});

const listSchema = new mongoose.Schema({
  id: String,
  name: String,
  orderindex: Number,
  content: String,
  status: String,
  priority: String,
  assignee: String,
  task_count: Number,
  due_date: String,
  start_date: String,
});

const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  color: String,
  avatar: String,
  members: [userSchema],
  lists: [listSchema],
});

const Project = mongoose.model("Project", projectSchema);

const token = "pk_62642127_F8YVWWSYN7FFFOYOQ7HEYEYDLZ6PXXD3";

async function fetchAndSaveData(res) {
  try {
    const projectsResponse = await axios.get(
      "https://api.clickup.com/api/v2/team",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const projects = projectsResponse.data.teams;

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const listsResponse = await axios.get(
          `https://api.clickup.com/api/v2/team/${project.id}/list`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const lists = listsResponse.data.lists;

        const obj = { ...project, lists };

        console.log("hhhh ", obj);
        return obj;
      })
    );

    await Project.insertMany(projectsWithDetails);
    console.log(
      "Données des projets enregistrées avec succès dans la base de données."
    );

    res.send(
      "Données des projets enregistrées avec succès dans la base de données."
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération ou de l'enregistrement des données des projets:",
      error.response.data
    );
    res.status(500).json({
      error:
        "Erreur lors de la récupération ou de l'enregistrement des données des projets",
    });
  }
}

cron.schedule("0 22 * * *", async () => {
  console.log("Exécution du job à 22h...");
  await fetchAndSaveData();
});

app.get("/projects", async (req, res) => {
  try {
    console.log("hhhhhhh win win");
    await fetchAndSaveData(res);
  } catch (error) {
    res
      .status(500)
      .send(
        "Une erreur est survenue lors de la récupération et de l'enregistrement des données des projets."
      );
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
