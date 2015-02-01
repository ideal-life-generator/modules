(function() {
  var User, app, bodyParser, cars, count, express, http, server;

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

  cars = [
    {
      id: 0,
      descriptor: "BMW",
      price: "19000"
    }, {
      id: 1,
      descriptor: "Mazda",
      price: "13000"
    }, {
      id: 2,
      descriptor: "Mercedes",
      price: "30000"
    }
  ];

  app.use("/cars/:id", function(req, res) {
    var success;
    success = false;
    cars.forEach(function(car) {
      if (~~req.params.id === car.id) {
        return success = true;
      }
    });
    if (success) {
      return res.send(cars[req.params.id]);
    } else {
      return res.status(404).send({
        content: "No data"
      });
    }
  });

  app["delete"]("/cars/:id", function(req, res) {
    return res.send();
  });

  app.get("/cars", function(req, res) {
    return setTimeout(function() {
      return res.status(404).send({
        content: "No data"
      });
    }, 1600);
  });

  count = 0;

  app.use("/data1", function(req, res) {
    return setTimeout(function() {
      return res.send([count++]);
    }, 600 / count);
  });

  app.use("/data2", function(req, res) {
    return setTimeout(function() {
      return res.send(["Dnepr", "Done", "Nil"]);
    }, 900);
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
