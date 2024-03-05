const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    id: {
      type: Number, // Utiliser Number si l'ID est un nombre
      required: true, // Vous pouvez ajuster cela en fonction de vos besoins
      unique: true, // Assurez-vous qu'aucun autre utilisateur n'a le même ID
    },
    assigneess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assurez-vous de remplacer 'User' par le nom de votre modèle utilisateur
      },
    ],
  },
  { strict: false }
); // Permet un schéma dynamique

module.exports = mongoose.model("List", listSchema);
