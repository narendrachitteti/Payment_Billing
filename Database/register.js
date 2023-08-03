const express = require('express')
const app = express()
const port = 3001
const reg_model = require('./register_model')
app.use(express.json())
app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');

next();
});
app.get('/', (req, res) => {
reg_model.getMerchants()
.then(response => {
res.status(200).send(response);
})
.catch(error => {
res.status(500).send(error);
})
})
app.post('/register_data', (req, res) => {
reg_model.createMerchant(req.body)
.then(response => {
res.status(200).send(response);
})
.catch(error => {
res.status(500).send(error);
})
})
app.delete('/register_data/:id', (req, res) => {
reg_model.deleteMerchant(req.params.id)
.then(response => {
res.status(200).send(response);
})
.catch(error => {
res.status(500).send(error);
})
})
app.listen(port, () => {
console.log(`App running on port ${port}.`)
})