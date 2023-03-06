const express = require('express');
const app = express();
const port = process.env.PORT || 1997;
const bodyParser = require('body-parser');
const cors = require('cors');
const { router: routerWorker } = require('./controller/app.js');

app.use(cors());

app.use(express.json({ extended: true, limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(
  bodyParser.json({
    extended: true,
    limit: '50mb',
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.json({
    msg: 'selamat datang di API',
  });
});
app.use('worker', routerWorker);

app.use('/users', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log('server berjalan di port' + port);
});
