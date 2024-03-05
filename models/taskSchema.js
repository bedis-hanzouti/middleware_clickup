const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Vos champs dynamiques pour les tâches
    assigneess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assurez-vous de remplacer 'User' par le nom de votre modèle utilisateur
      },
    ],
  },
  { strict: false }
); // Permet un schéma dynamique

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
