http = require "http"
express = require "express"

bodyParser = require 'body-parser'

app = express()
server = http.Server app

app.use express.static __dirname

app.use bodyParser.json()

User =
  username: "allofmind"
  password: "California"

app.use "/authorization", (req, res) ->
  if req.body.username is User.username and req.body.password is User.password
    res
      .status 200
      .send
        username: "allofmind"
        firstname: "Vladislav"
        lastname: "Tkachenko"
        email: "1allofmind@gmail.com"
  else
    res
      .status 404
      .send content: "Don't find user"

cars = [
    id: 0
    descriptor: "BMW"
    price: "19000"
  ,
    id: 1
    descriptor: "Mazda"
    price: "13000"
  ,
    id: 2
    descriptor: "Mercedes"
    price: "30000"
]

app.use "/cars/:id", (req, res) ->
  success = off
  cars.forEach (car) ->
    success = on if ~~req.params.id is car.id
  if success
    res.send cars[req.params.id]
  else
    res
      .status 404
      .send content: "No data"
  # res
  #   .status 404
  #   .send content: "No data"

app.delete "/cars/:id", (req, res) ->
  res.send()

app.get "/cars", (req, res) ->
  # setTimeout ->
  #   res.send cars
  # , 1600
  setTimeout ->
    res
      .status 404
      .send content: "No data"
  , 1600

count = 0
app.use "/data1", (req, res) ->
  setTimeout ->
    res.send [ count++ ]
  , 600 / count
  # setTimeout ->
  #   res
  #     .status 404
  #     .send content: "No data"
  # , 600

app.use "/data2", (req, res) ->
  setTimeout ->
    res.send [ "Dnepr", "Done", "Nil" ]
  , 900
  # setTimeout ->
  #   res
  #     .status 404
  #     .send content: "No data"
  # , 900

app.use "/textarea", (req, res) ->
  res.send content: "Third content"
  # res
  #   .status 404
  #   .send content: "No data"

app.post "/textarea", (req, res) ->
  console.log req.body
  res.send "OK"

app.use "/", (req, res) ->
  res.sendFile "#{__dirname}/index.html"

server.listen 3000, ->
  console.log "Server is listening"