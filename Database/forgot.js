const express = require('express')
const app = express()
const port = 3002
const mer_model = require('./for_model')
app.use(express.json())
app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');

next();
});
app.get('/', (req, res) => {
mer_model.getMerchants()
.then(response => {
res.status(200).send(response);
})
.catch(error => {
res.status(500).send(error);
})
})
app.post('/forgot_page', (req, res) => {
mer_model.createMerchant(req.body)
.then(response => {
res.status(200).send(response);
})
.catch(error => {
res.status(500).send(error);
})
})
app.delete('/login_page/:id', (req, res) => {
mer_model.deleteMerchant(req.params.id)
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