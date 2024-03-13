const mongoose = require("mongoose");
async function clearData() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (let collection of collections) {
      await db.collection(collection.name).drop();
      console.log(
        `\x1b[32mCollection ${collection.name} dropped successfully.\x1b[0m`
      );
    }

    console.log("\x1b[33mAll collections dropped successfully.\x1b[0m");
  } catch (error) {
    console.error("Error dropping collections:", error);
    throw error;
  }
}
module.exports = { clearData };
