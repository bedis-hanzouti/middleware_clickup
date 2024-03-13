const Tracker = require("../models/trackerSchema");

async function getTrackers(req, res) {
  try {
    const tracker = await Tracker.find();
    if (!tracker) {
      return res.status(400).json({ error: "tracker not found" });
    }
    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function getTrackerById(req, res) {
  try {
    const trackerId = req.params.id;
    const tracker = await Tracker.findById(trackerId);
    if (!tracker) {
      return res.status(400).json({ error: "tracker not found" });
    }
    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
module.exports = { getTrackers, getTrackerById };
