const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./models');
const fs = require('fs');
const cors = require('cors');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const {
  fnConsumerEmail
} = require('./queues/userConsumer');
const { startConsumer } = require('./queues/index');

const app = express();

dotenv.config();

app.use(cors());
app.use(morgan('dev'));

db.sequelize.sync();

//dev environ
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


//consumers for email queue
startConsumer('EMAIL_SIGNUP', fnConsumerEmail);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', postRoutes);
app.use('/', authRoutes);

app.use((err, req, res, next) => {
  if (err.name == 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port);
console.log('server is running');
