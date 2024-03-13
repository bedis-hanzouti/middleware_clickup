require("dotenv").config();
const express = require("express");
const figlet = require("figlet");
const apiRouter = require("./routes/router");
const app = express();
const PORT = process.env.PORT;
require("./config/dataBase/dbConfig");
require("./config/jobs/getProjectCron");

app.use(express.json({ limit: "20kb" }));

app.use("/api/v1", apiRouter);

try {
  app.listen(PORT, () => {
    figlet("Proxym Clickup", function (err, data) {
      if (err) {
        console.log(
          "\x1b[31mErreur lors de la génération du texte ASCII :",
          err,
          "\x1b[0m"
        );

        return;
      }
      console.log(data);
    });
    console.log(`\x1b[32mServeur démarré sur le port ${PORT}\x1b[0m`);
  });
} catch (error) {
  console.error(
    "\x1b[31mErreur lors du démarrage du serveur :",
    error,
    "\x1b[0m"
  );
}
