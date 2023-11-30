const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Dummy data for tasks
const tasks = [
  { id: 1, title: 'Meeting at 2 PM', deadline: '2023-12-01T14:00:00' },
  { id: 2, title: 'Submit Report', deadline: '2023-12-05T17:00:00' },
  // Add more tasks as needed
];

// API endpoint to get upcoming tasks
app.get('/tasks', (req, res) => {
  const upcomingTasks = tasks.filter(task => new Date(task.deadline) > new Date());
  res.json(upcomingTasks);
});

// API endpoint to set a notification for a specific task
app.post('/setNotification', (req, res) => {
  const { taskId, notificationType } = req.body;

  // Here, you would implement logic to set a notification for the task
  // This might involve scheduling emails or push notifications

  res.json({ success: true, message: 'Notification set successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
