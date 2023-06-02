/**********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Jason Shin
 *  Student ID: 111569216
 *  Date: June 2, 2023
 *  Cyclic Link: https://white-gosling-hat.cyclic.app/
 *
 **********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
// database set up
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
// initialize app and port
app = express();
app.use("/", express.static("./"));
HTTP_PORT = process.env.PORT || 8080;
// help prevent cross-origin restrictions and ensure API can be accessed from different sources
app.use(cors());
// ensure server can parse the JSON provided in the request body for routes
app.use(express.json());

// home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// add new movie - POST /api/movies
app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((data) => res.status(201).send(data))
    .catch(() => res.status(500).send("Error: Adding movie!"));
});

// get movies by id - GET /api/movies
app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => res.send(data))
    .catch(() => res.status(500).send("Error: Retrieving movie by ID!"));
});

// get movies by page, perPage, and title - GET /api/movies
// example--> /api/movies?page=1&perPage=5&title=The Avengers
app.get("/api/movies", (req, res) => {
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => res.send(data))
    .catch(() => res.status(500).send("Error: Retrieving all movies!"));
});

// update movie by given id - PUT /api/movies/:id
// example --> /api/movies/573a1391f29313caabcd956e
app.put("/api/movies/:id", (req, res) => {
  const movId = req.params.id;
  const movData = req.body;
  db.updateMovieById(movData, movId)
    .then((data) => {
      if (data.nModified === 0) {
        res.status(204).send(data);
      } else {
        res.send({ message: `Updated movie ID: ${movID}` });
      }
    })
    .catch((err) => {
      res.status(500).send("Error: Updating movie!");
    });
});

// delete movie by given id - DELETE /api/movies/:id
app.delete("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  db.deleteMovieById(id)
    .then((data) => res.status(204).send(data))
    .catch(() => res.status(500).send("Error: Deleting movie!"));
});

// page not found
app.use((req, res) => {
  res.status(404).send("Page not found!");
});

// initialize module before server starts
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
