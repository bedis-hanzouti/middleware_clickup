const axios = require("axios");

const User = require("../models/userSchema");
const Task = require("../models/taskSchema");

async function getUserLists(apiUrl, token, list_id) {
  try {
    const userListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/list/${list_id}/member`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const users = userListsResponse.data;
    for (const userData of users.members) {
      if (userData && userData.length > 0) {
        const memberId = userData.id;

        let user = await User.findOne({ clickup_id: memberId });
        if (!user) {
          user = new User({
            clickup_id: memberId,
            username: userData.username,
            color: userData.color,
            email: userData.email,
            profilePicture: userData.profilePicture,
          });

          await user.save();
        }
      }
    }
    // Supprimer tous les utilisateurs existants
    await User.deleteMany();
    // Insérer les nouveaux utilisateurs dans la base de données
    await User.insertMany(users.members);

    const response = {
      message: "User lists saved successfully",
      status: 200,
      count: users.members.length,
    };

    return response;
  } catch (error) {
    console.error("Error fetching user lists:", error);
    throw error;
  }
}

async function saveUser(user) {
  const memberId = user.id;
  let createUser = user;
  await User.findOneAndUpdate({ id: memberId }, createUser, {
    upsert: true,
    new: true,
  });
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserByTask(req, res) {
  try {
    const { taskId } = req.params;

    // Recherche de la tâche par ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const assignees = task.assignees;

    const user = await User.findById(assignees);

    res.json(user);
  } catch (error) {
    console.error("Error fetching assignees by task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getUserLists,
  getUserById,
  getUserEmail,
  getUserByTask,
  saveUser,
};
