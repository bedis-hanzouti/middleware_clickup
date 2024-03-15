require("dotenv").config();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const express = require("express");
const figlet = require("figlet");
const apiRouter = require("./routes/router");
const app = express();
const PORT = process.env.PORT;
require("./config/dataBase/dbConfig");
require("./config/jobs/getAllDataFromClickupCron");

app.use(express.json({ limit: "20kb" }));
const stream = fs.createWriteStream(path.join(__dirname, "logger.log"), {
  flags: "a",
});
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("combined", {
      stream: stream,
    })
  );
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
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
