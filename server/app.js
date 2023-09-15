const express = require('express');
const app = express();
const morgan = require('morgan');
const pool = require('./config/dbConfig.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const port = 3443;
const routes = require('./routes');

app.use(cors());
const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb' }));

app.use(
  fileupload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  morgan('dev', {
    skip: function (req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  })
);

const userController = routes.userController;
const accountController = routes.accountController;
const conversationController = routes.conversationController;

// Define the webhook route before other routes
// app.get('/webhook', (req, res) => {
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];
//   console.log('mode', mode);
//   console.log('token', token);
//   console.log('challenge', challenge);
//   if (mode && token) {
//     if (mode === 'subscribe' && token === '123456789') {
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send({
// 		challenge
// 	  });
//     } else {
//       res.status(403).send('Forbidden');
//     }
//   }
// });

const API_URL = '/api/v1/';
app.use(API_URL, userController);
app.use(API_URL, accountController);
app.use(API_URL, conversationController);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
