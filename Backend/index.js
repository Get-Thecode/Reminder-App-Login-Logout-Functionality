require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// APP config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// DB config
mongoose.connect('mongodb://localhost/my-database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const reminderSchema = new mongoose.Schema({
  reminderMsg: String,
  remindAt: String,
  isReminded: Boolean
});
const Reminder = mongoose.model("reminder", reminderSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// Whatsapp reminding functionality
setInterval(async () => {
  try {
    const reminderList = await Reminder.find({});
    if (reminderList) {
      for (const reminder of reminderList) {
        if (!reminder.isReminded) {
          const now = new Date();
          if ((new Date(reminder.remindAt) - now) < 0) {
            await Reminder.findByIdAndUpdate(reminder._id, { isReminded: true });
            const accountSid = process.env.ACCOUNT_SID;
            const authToken = process.env.AUTH_TOKEN;
            const client = require('twilio')(accountSid, authToken);
            client.messages
              .create({
                body: reminder.reminderMsg,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+918888888888' // YOUR PHONE NUMBER INSTEAD OF 8888888888
              })
              .then(message => console.log(message.sid))
              .catch(error => console.log(error));
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}, 1000);

// API routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error during login");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      await newUser.save();
      res.send({ message: "Successfully Registered, Please login now." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error during registration");
  }
});

app.get("/getAllReminder", async (req, res) => {
  try {
    const reminderList = await Reminder.find({});
    res.send(reminderList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving reminders");
  }
});

app.post("/addReminder", async (req, res) => {
  try {
    const { reminderMsg, remindAt } = req.body;
    const reminder = new Reminder({
      reminderMsg,
      remindAt,
      isReminded: false
    });
    await reminder.save();
    const updatedReminderList = await Reminder.find({});
    res.send(updatedReminderList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding reminder");
  }
});

app.post("/deleteReminder", async (req, res) => {
  try {
    await Reminder.deleteOne({ _id: req.body.id });
    const updatedReminderList = await Reminder.find({});
    res.send(updatedReminderList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting reminder");
  }
});

app.listen(9000, () => console.log("Server started"));
