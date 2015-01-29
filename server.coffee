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

app.use "/title", (req, res) ->
  res.send content: "Cache module"
  # res
  #   .status 404
  #   .send content: "No data"

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