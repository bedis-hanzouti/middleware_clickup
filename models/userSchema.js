const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number, // Utiliser Number si l'ID est un nombre
      required: true, // Vous pouvez ajuster cela en fonction de vos besoins
      unique: true, // Assurez-vous qu'aucun autre utilisateur n'a le même ID
    },
  },
  { strict: false }
); // Permet un schéma dynamique

const User = mongoose.model("User", userSchema);

module.exports = User;
