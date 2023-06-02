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
// elements
const pagination = document.querySelector(".pagination");
const previous = document.querySelector("#previous-page");
const next = document.querySelector("#next-page");
const submit = document.querySelector("#searchForm");
const clear = document.querySelector("button[type='reset']");

// const value used to reference number of movies we wish to view on each page
const perPage = 10;
// to keep track of current page
var page = 1;
// function used to set page to default 1 when first opened
function setPageToDefault() {
  page = 1;
}
// separate event listener setup into dedicated function, goes into loadMovieData
function MovieRowClickEventListeners() {
  document.querySelectorAll("#moviesTable tbody tr").forEach((row) => {
    row.addEventListener("click", (event) => {
      movieClick(row.getAttribute("data-id"));
    });
  });
}

function loadMovieData(title = null) {
  let movieApi = `/api/movies?page=${page}&perPage=${perPage}`;
  if (title) {
    movieApi += `&title=${title}`;
    page = 1;
    pagination.classList.add("d-none");
  } else {
    pagination.classList.remove("d-none");
  }
  fetch(movieApi)
    .then((res) => res.json())
    .then((movies) => {
      console.log(movies);
      const movieRows = movies
        .map(
          (data) =>
            `<tr data-id=${data._id}>
              <td>${data.year}</td>
              <td>${data.title}</td>
              <td>${data.plot ? data.plot : "N/A"}</td>
              <td>${data.rated ? data.rated : "N/A"}</td>
              <td>${Math.floor(data.runtime / 60)}:${(data.runtime % 60)
              .toString()
              .padStart(2, "0")}</td>
            </tr>`
        )
        .join("");
      document.querySelector("tbody").innerHTML = movieRows;
      document.querySelector("#current-page").innerHTML = page;
      MovieRowClickEventListeners();
    })
    .catch(() => {});
}

function movieClick(id) {
  fetch(`/api/movies/${id}`)
    .then((res) => res.json())
    .then((movie) => {
      const modalTitle = document.querySelector(".modal-title");
      const modalBody = document.querySelector(".modal-body");
      modalTitle.innerHTML = movie.title;
      modalBody.innerHTML = `
        <img class="img-fluid w-100" src="${movie.poster}"><br><br>
        <strong>Directed By: </strong>${
          movie.directors ? movie.directors.join(", ") : "N/A"
        }<br><br>
        <p>${movie.fullplot}</p>
        <strong>Cast: </strong>${
          movie.cast ? movie.cast.join(", ") : "N/A"
        }<br><br>
        <strong>Awards: </strong>${movie.awards.text}<br>
        <strong>IMDB Rating: </strong> ${movie.imdb.rating} (${
        movie.imdb.votes
      } votes)
      `;
    });

  const theModal = new bootstrap.Modal(
    document.querySelector("#detailsModal"),
    {
      focus: true,
    }
  );
  theModal.show();
}

document.addEventListener("DOMContentLoaded", (event) => {
  setPageToDefault(); // Set the page to 1 page loads
  loadMovieData(); // call loadMovieData() with page 1
  submit.addEventListener("submit", (event) => {
    event.preventDefault();
    let form = event.target;
    title = form.querySelector("#title").value;
    console.log(title);
    loadMovieData(title);
  });
  clear.addEventListener("click", (event) => {
    loadMovieData();
  });
  previous.addEventListener("click", (event) => {
    if (page > 1) {
      page -= 1;
      loadMovieData();
    }
  });
  next.addEventListener("click", (event) => {
    page += 1;
    loadMovieData();
  });
});
