const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');
const app = express();
const port = 3000;

const vapidKeys = {
  publicKey: 'BOYk_pBY1EOA2F8rr_9yG3IoyFk64b0QEEmPb6z5Udz8BuJ2ihVhx_yviRVzzwprGdzzIUbrmByc7Tgm6Eu7Do4',
  privateKey: 'OAoJfBpgZbN2ruHZdkdm-w98RG0XDQHdA8O-Hfqk76w',
};

const subscriptions = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

webpush.setVapidDetails(
  'mailto:your_email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/sendNotification', (req, res) => {

  const origin = req.body.endpoint;

  const notificationPayload = {
    notification: {
      title: req.body.title,
      content: req.body.content,
    },
  };

  subscriptions.forEach(subscription => {
    if (subscription !== origin){
      webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
        .catch(error => {
          console.error('Error sending notification:', error);
        });
    }
  });

  res.status(200).json({ message: 'Notifications sent successfully' });
});

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  const endpoint = subscription.endpoint;
  const clientIP = req.socket.remoteAddress;
  const clientPort = req.socket.remotePort;

  if (!subscriptions.find(sub => sub.endpoint === endpoint)) {
    subscriptions.push(subscription);
  }

  console.log(`Client Endpoint: ${endpoint}`);
  console.log(`Client IP: ${clientIP}`);
  console.log(`Client Port: ${clientPort}`);

  res.status(200).json({ message: 'Subscription successful' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
