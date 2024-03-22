const mongoose = require("mongoose");
const db = mongoose
  .connect(
    process.env.DB_URL ||
      "mongodb+srv://RootDB:root@restapi.ii97j.mongodb.net/Clickup_DATA?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log(
      `MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`
    );
  })
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err}`);
    process.exit(1);
  });
