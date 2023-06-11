import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SetReminder.css";

function SetReminder({ setLoginUser }) {
  const [reminderMsg, setReminderMsg] = useState("");
  const [remindAt, setRemindAt] = useState();
  const [reminderList, setReminderList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/getAllReminder")
      .then((res) => setReminderList(res.data))
      .catch((error) => console.log(error));
  }, []);

  const addReminder = () => {
    axios
      .post("http://localhost:9000/addReminder", { reminderMsg, remindAt })
      .then((res) => setReminderList(res.data))
      .catch((error) => console.log(error));
    setReminderMsg("");
    setRemindAt(null);
  };

  const deleteReminder = (id) => {
    axios
      .post("http://localhost:9000/deleteReminder", { id })
      .then((res) => setReminderList(res.data))
      .catch((error) => console.log(error));
  };

  const setAlarm = (reminder) => {
    const reminderTime = new Date(reminder.remindAt);
    const currentTime = new Date();

    if (reminderTime > currentTime) {
      const timeDifference = reminderTime - currentTime;

      setTimeout(() => {
        alert(`Reminder: ${reminder.reminderMsg}`);
      }, timeDifference);
    }
  };

  return (
    <div className="App">
      <div className="homepage">
        <div className="homepage_header">
          <h1>Remind Me</h1>
          <input
            type="text"
            placeholder="Reminder notes here..."
            value={reminderMsg}
            onChange={(e) => setReminderMsg(e.target.value)}
          />
          <DatePicker
            selected={remindAt}
            onChange={(date) => setRemindAt(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            placeholderText="Select Date and Time"
          />
          <div className="button" onClick={addReminder}>
            Add Reminder
          </div>
        </div>

        <div className="homepage_body">
          {reminderList.map((reminder) => (
            <div className="reminder_card" key={reminder._id}>
              <h2>{reminder.reminderMsg}</h2>
              <h3>Remind Me at:</h3>
              {reminder.remindAt && (
                <p>
                  {new Date(reminder.remindAt).toLocaleString(undefined, {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              )}

              <div
                className="button"
                style={{ backgroundColor: "red" }}
                onClick={() => deleteReminder(reminder._id)}
              >
                Delete
              </div>

              <div className="button" onClick={() => setAlarm(reminder)}>
                Set Alarm
              </div>
            </div>
          ))}
        </div>
        <div className="logout-button" onClick={() => setLoginUser({})}>
          Logout
        </div>
      </div>
    </div>
  );
}

export default SetReminder;
