(function() {
  var User, app, bodyParser, express, http, server;

  http = require("http");

  express = require("express");

  bodyParser = require('body-parser');

  app = express();

  server = http.Server(app);

  app.use(express["static"](__dirname));

  app.use(bodyParser.json());

  User = {
    username: "allofmind",
    password: "California"
  };

  app.use("/authorization", function(req, res) {
    if (req.body.username === User.username && req.body.password === User.password) {
      return res.status(200).send({
        username: "allofmind",
        firstname: "Vladislav",
        lastname: "Tkachenko",
        email: "1allofmind@gmail.com"
      });
    } else {
      return res.status(404).send({
        content: "Don't find user"
      });
    }
  });

  app.use("/title", function(req, res) {
    return res.send({
      content: "Cache module"
    });
  });

  app.use("/textarea", function(req, res) {
    return res.send({
      content: "Third content"
    });
  });

  app.post("/textarea", function(req, res) {
    console.log(req.body);
    return res.send("OK");
  });

  app.use("/", function(req, res) {
    return res.sendFile("" + __dirname + "/index.html");
  });

  server.listen(3000, function() {
    return console.log("Server is listening");
  });

}).call(this);
