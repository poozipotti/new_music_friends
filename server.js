//this is a change to see if it works
const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const configRoutes = require("./routes");
const port = 4000;
const path = require("path");

app.use(express.static(path.join(__dirname,"client","build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//middlewear to allow access to the api from our localhost
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

configRoutes(app);

app.get("*", (req,res) => {
	res.sendFile(path.join(__dirname,"client","build","index.html"));
});
app.listen(port, () => {
            console.log("connected to api sever listening on http://localhost:"+port);

});
