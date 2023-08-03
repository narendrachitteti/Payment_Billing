const express = require('express');
const app = express();
const port = 3001;
const billing_model = require('./server_model');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  billing_model
    .getInvoices()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post('/invoice', (req, res) => {
  billing_model
    .createInvoice(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.delete('/invoice/:id', (req, res) => {
  billing_model
    .deleteInvoice(req.params.id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
