const cron = require("node-cron");

const { fetchAndSaveData } = require("../../controllers/projectControlller");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

cron.schedule("19 10 * * *", async () => {
  console.log("api_url", api_url);
  console.log("Executing cron job at 1:00 AM...");
  try {
    await fetchAndSaveData(api_url, token, null);
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});
