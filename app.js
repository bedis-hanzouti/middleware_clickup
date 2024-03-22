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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.get("/", (req, res) => {
  figlet("Proxym Clickup ...", function (err, data) {
    if (err) {
      console.log(
        "\x1b[31mErreur lors de la génération du texte ASCII :",
        err,
        "\x1b[0m"
      );
      return;
    }

    const nameText =
      "<span style='color: white; font-weight: bold;font-size: 45px;'>Badis-Hanzouti</span>";

    const figletStyle = "color: white; font-weight: bold";

    const animatedData = data
      .split("")
      .map(
        (char, index) =>
          `<span class="char-${index}" style="opacity: 0;">${char}</span>`
      )
      .join("");

    const output = `
      <div style="text-align:center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
        <video autoplay muted loop style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100%; min-height: 100%;">
          <source src="./uploads//Welcome to the Game - Hacking Alert.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
          <pre style="${figletStyle}" id="figletText">${animatedData}</pre>
          <div>${nameText}</div>
          
         
        </div>
      </div>
      <script>
        const charElements = document.querySelectorAll('[class^="char-"]');
        charElements.forEach((charElement, index) => {
          setTimeout(() => {
            charElement.style.opacity = 1;
          }, index * 10); // Reduced delay for faster animation
        });
      </script>
    `;

    res.send(output);
  });
});

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
