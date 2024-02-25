const mongoose = require("mongoose");
const db = mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connexion à la base de données MongoDB réussie."))
  .catch((err) => {
    console.error("Erreur de connexion à la base de données MongoDB :", err);
    process.exit(1);
  });
