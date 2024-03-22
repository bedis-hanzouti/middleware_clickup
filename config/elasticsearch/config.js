const asyncHandler = require("express-async-handler");
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9300" });
// const indexName = "categoryindex";

// Définition de la configuration et des mappings des champs de l'indice
const settingsIndex = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      //   name: { type: "text" },
    },
  },
};
// Fonction pour créer l'indice
const createIndex = asyncHandler(async (req, res) => {
  try {
    const indexName = req.body.index;
    const indiceExiste = await client.indices.exists({ index: indexName });

    if (indiceExiste.body) {
      return res
        .status(400)
        .json({ message: `L'indice "${indexName}" existe déjà.` });
    }

    // Crée l'indice avec la configuration fournie
    const reponse = await client.indices.create({
      index: indexName,
      body: settingsIndex,
    });

    return res.status(200).json({
      message: `Indice "${indexName}" créé avec succès.`,
      response: reponse.body,
    });
  } catch (erreur) {
    return res.status(500).json({
      message: "Erreur lors de la création de l'indice.",
      error: erreur.message,
    });
  }
});

module.exports = {
  //   indexName,
  //   settingsIndex,
  createIndex,
  client,
};
