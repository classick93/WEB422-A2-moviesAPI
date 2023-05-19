/**********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jason Shin
*  Student ID: 111569216
*  Date: May 18, 2023
*  Cyclic Link: https://white-gosling-hat.cyclic.app/
*
**********************************************************************************/ 
const express = require('express');
const cors = require('cors');
require("dotenv").config();
// database set up
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
// initialize app and port
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// help prevent cross-origin restrictions and ensure API can be accessed from different sources
app.use(cors());
// ensure server can parse the JSON provided in the request body for routes
app.use(express.json());

// initialize module before server starts
db.initialize(process.env.MONGODB_CONN_STRING)
.then(()=>{
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
})
.catch((err)=>{
    console.log(err);
});

// home page route
app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

// add new movie - POST /api/movies
app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body)
    .then((data) => {
        res.status(201).json(data)
    })
    .catch(() => {
        res.status(500).json({error: err})
    });
});

// get movies by id - GET /api/movies
app.get("/api/movies/:id", (req, res) => {
    const movieId = req.params.id; 
    db.getMovieById(movieId)
      .then((data) => {
        if (data) {
          res.json({ message: `Get movie with ID: ${data}` }); 
        } else {
          res.status(204).end(); 
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to get movie" });
      });
  });

// get movies by page, perPage, and title - GET /api/movies 
// example--> /api/movies?page=1&perPage=5&title=The Avengers
app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

// update movie by given id - PUT /api/movies/:id
// example --> /api/movies/573a1391f29313caabcd956e
app.put("/api/movies/:id", (req, res) => {
    const movId = req.params.id; 
    const movData = req.body; 
    db.updateMovieById(movData, movId)
      .then((result) => {
        if (result.nModified === 0) {
          res.status(204).end(); 
        } else {
          res.json({ message: `Updated movie ID: ${movID}` });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to update movie" });
      });
  });

// delete movie by given id - DELETE /api/movies/:id
app.delete("/api/movies/:id", (req, res) => {
    const id = req.params.id;
    db.deleteMovieById(id)
    .then(() => {
        res.status(201).json({ message: `Movie ID: ${id} has been deleted` });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

// page not found 
app.use((req, res) => {
    res.status(404).json({ message: "Page not found" });
}); 



