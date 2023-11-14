const express = require('express');
const webpush = require('web-push');
const path = require('path');
const app = express();
const port = 3000;

const subscriptions = [];

const vapidKeys = {
  publicKey : "BLtGZU_KZQutcsBoNSNULHUAsARrTPwqtrDB9PKzIBLsZ9wzd9xPGkiwBe7HUaTYQ3seine-GU3HXiWziZFRAjw",
  privateKey : "0RF8ypW6gYJczwiPZVqBCFsKy9oXqVKwaDK_e09fEm8"
};

webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'service-worker.js'));
});

app.post('/subscribe', (req, res) => {
  console.log("new subscribe");
  console.log(req.body);
  subscriptions.push(req.body);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({data: {success: true}}));
});

app.post('/pushMessage', (req, res) => {
  console.log(req.body);
  subscriptions.forEach((sub) => {
    webpush.sendNotification(sub, JSON.stringify(req.body));
  });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({data: {success: true}}));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
