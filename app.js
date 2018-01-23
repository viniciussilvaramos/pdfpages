const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


app.set("view engine","jade");
app.set("views","./views");

app.use('/libs', express.static(__dirname + '/public/libs'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/pdf', express.static(__dirname + '/public/pdf'));

const models = require('./models')
const userRoutes = require("./routes/users")

app.use("/:userId?", userRoutes);

models.sequelize.sync().then(()=>{

    const port = process.env.PORT || 8080;
    const ip = process.env.IP || '0.0.0.0';
    
    app.listen(port, ip, () =>{
        console.log(`Listening on ${ip}:${port}`);
    });
});
