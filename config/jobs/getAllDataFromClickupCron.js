const cron = require("node-cron");

const {
  GenarateDataBaseFromClickup,
} = require("../../controllers/workspaceController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

cron.schedule("55 13 * * *", async () => {
  console.log("Executing cron job at 1:00 AM...");
  try {
    await GenarateDataBaseFromClickup(api_url + "team", token, null);
    console.log("Data processed successfully.");
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});
