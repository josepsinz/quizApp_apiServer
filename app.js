var express = require('express');
var sequelize = require('./Config')

var app = express();
app.get('/favicon.ico', (req, res) => res.send(204));

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    app.use(require("./Routes"));
    app.listen( 4000, async () => {
        console.log('Server listening on port ' + 4000);
    })
}

main();
