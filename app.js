const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Create Task
app.post('/create',(req, res) => {

  console.log(req,body);
  res.send('Recibido');

})
// STATIC Files

app.use(express.static(__dirname + '/src/app/components/login'));

module.exports = app;
