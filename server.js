/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: ____Seonghoon Kim________ Student ID: ___shkim61___ Date: __2023-05-19
 *  Cyclic Link: _____https://angry-puce-kitten.cyclic.app______________________________
 *
 ********************************************************************************/

// Setup
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// POST /api/movies (Add new)
app.post("/api/movies", (req, res) => {
  const movie = req.body; // Get the movie data from the request body
  db.addNewMovie(movie)
    .then((newMovie) => {
      res.status(201).json({ message: `Added a new movie: ${newMovie}` }); // Return the newly created movie object
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to add new movie" });
    });
});

// GET /api/movies (Get all)
app.get("/api/movies", (req, res) => {
  const page = parseInt(req.query.page); // Get the page parameter (integer)
  const perPage = parseInt(req.query.perPage); // Get the perPage parameter (integer)
  const title = req.query.title; // Get the title parameter (string)
  db.getAllMovies(page, perPage, title)
    .then((movies) => {
      res.json(movies); // Return the movies array to the client
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to get movies" });
    });
});

// GET /api/movies/:id (Get one)
app.get("/api/movies/:id", (req, res) => {
  const movieId = req.params.id; // Get the movieId from the route parameter
  db.getMovieById(movieId)
    .then((movie) => {
      if (movie) {
        res.json({ message: `Get a movie with ID: ${movie}` }); // Return the movie object to the client
      } else {
        res.status(204).end(); // Return a status code 204 if movie not found
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to get movie" });
    });
});

// PUT /api/movies/:id
app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id; // Get the movieId from the route parameter
  const movieData = req.body; // Get the updated movie data from the request body
  db.updateMovieById(movieData, movieId)
    .then((result) => {
      if (result.nModified === 0) {
        res.status(204).end(); // Return a status code 204 if no movie was updated
      } else {
        res.json({ message: `Updated a movie with ID: ${movieID}` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update movie" });
    });
});

// DELETE /api/movies/:id
app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id; // Get the movieId from the route parameter
  db.deleteMovieById(movieId)
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(204).end(); // Return a status code 204 if no movie was deleted
      } else {
        res.json({
          message: `Deleted a movie with ID: ${movieID}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to delete movie" });
    });
});
