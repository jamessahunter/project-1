
var movie;

var popularClicked = false;
var count = 0;

var popularArr = [];
var moviePosterURL = "";
var movieSearchHistory = [];


// button pointer variables

var searchButton = $("#button-search");
var popularButton = $("#button-popular");
var saveConfigButton = $("#button-save-configuration");
var clearConfigButton = $("#button-clear-configuration");
var resetHistoryButton = $("#button-reset-history");

var criteriaSection = $("#criteria");
var movieInput = $("#search");
var movieCardsContainer = $("#movie-cards-container");

var movieSearchHistoryContainerLargeEl = $("#search-history-container-lg");
var movieSearchHistoryContainerSmallEl = $("#search-history-container-sm");


// checkbox pointer variables

var posterBox    = $( "#cb-poster"     );
var yearBox      = $( "#cb-year"       );
var ratingBox    = $( "#cb-rating"     );
var runtimeBox   = $( "#cb-runtime"    );
var genreBox     = $( "#cb-genre"      );
var directorBox  = $( "#cb-director"   );
var castBox      = $( "#cb-cast"       );
var summaryBox   = $( "#cb-summary"    );
var scoresBox    = $( "#cb-scores"     );
var nytReviewBox = $( "#cb-review-nyt" );
var servicesBox  = $( "#cb-services"   );

var checkboxConfig = {};


// foundMovie is used to gather the current search result data from our set of queries
var foundMovie = {
  cast: "",
  director: "",
  genre: "",
  mpaaRating: "",
  posterURL: "",
  reviews: { nyt: { author: "", snippet: "" } },
  runtime: 0,
  scores: [],
  streamingServices: "",
  summary: "",
  title: "",
  year: 0
};

var pinnedMovies = {};
var currentMovieList = {};


// searchbutton click event listener
searchButton.on("click", function(event) {
  handleSearch(event);
});

// search input field "enter key" event listener
movieInput.on("keypress", function(event) {
  const enterKey = 13;
  if (event.which === enterKey) {
    handleSearch(event);
  }
});

function handleSearch(event) {
  event.preventDefault();
  popularClicked = false;
  var movieSearchQuery = movieInput.val();

  if(movieSearchQuery === ""){
    // MODAL HERE ********************************** (or nothing happens if you click when it's empty?)
    return;
  }
  // console.log(scoresBox[0].checked);
  // console.log(movieSearchQuery);
  fetchOMDB(movieSearchQuery);
  addToSearchHistory(movieSearchQuery);

  // Clear the input field
  movieInput.val("");
}

// event listener for popular button
popularButton.on("click", function() {
  // console.log("works");
  popularClicked = true;
  fetchPopular();
});


// event listener for checkbox change
$(".boxId").on("change", function() {
  // update checkbox config
  checkboxConfig[$(this).attr("value")] = $(this).prop("checked");

  // checkboxId = $(this).attr("value");
  // isChecked = $(this).prop("checked");
  // console.log(checkboxId + " is now " + (isChecked ? "checked" : "unchecked"));
  buildMovieCards(currentMovieList);

});

// event listener for save configuration button
saveConfigButton.on("click", function() {
  saveCheckboxConfig();
});

// event listener for clear configuration button
clearConfigButton.on("click", function() {
  resetCheckboxConfig();
  updateCheckboxConfig();
  localStorage.removeItem("checkboxConfigStringify");
  buildMovieCards(currentMovieList);
});

// event listener for reset history button
resetHistoryButton.on("click", function() {
  movieSearchHistory = [];
  buildMovieSearchHistory();
  localStorage.removeItem("movieSearchHistoryStringify");
});


function fetchPopular(){
  //fetch for popular movies
  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
  .then(function(response){
    if (response.ok){
      // console.log(response);
      return response.json().then(function(data){
        // console.log("popular movies")
        //   console.log(data);
        //   console.log(data.results);
        for(var i=data.results.length-1;i>=0;i--){
          // console.log(wait);
          popularArr.push(data.results[i].title);

          // var movieTitle = data.results[i].title;
          // fetchOMDB(movieTitle);
          // console.log(data.results[i]);
        }
        // console.log(popularArr);
        fetchOMDB(popularArr[count]);
      });
    }
  });
}


function fetchOMDB(movieSearchQuery){
  debugger;
  // fetches based on title
  var omdbUrl = "https://www.omdbapi.com/?t="+ movieSearchQuery +"&plot=short&apikey=704a2c08"
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      // console.log(response);
      return response.json().then(function(data){
        // console.log("omdb");
        // console.log(data);
        
        foundMovie.scores = data.Ratings;

        foundMovie.year = parseInt(data.Year);
        foundMovie.mpaaRating = data.Rated;
        foundMovie.runtime = parseInt(data.Runtime);
        foundMovie.genre = data.Genre;
        foundMovie.director = data.Director;
        foundMovie.cast = data.Actors;
        // console.log(data.imdbRating);
        // console.log(data.Ratings);
        fetchTMDB(movieSearchQuery);
      });
    }
  });
}


function fetchTMDB(movie){
  //fetches to TMDB
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  };
  fetch('https://api.themoviedb.org/3/search/movie?query='+movie+'&include_adult=false&language=en-US', options)
  .then(function(response){
    if (response.ok){
      //console.log(response);
      return response.json().then(function(data){
        // console.log("TMDB specific movie");
        // console.log(data);
        foundMovie.title = data.results[0].title;
        // foundMovie.score.tmdb = data.results[0].vote_average;
        foundMovie.summary = data.results[0].overview;
        // console.log(data);
        // console.log(data.original_title);
        // console.log(data.vote_average);
        // console.log(data.poster_path);
        // console.log(data.runtime);
        foundMovie.posterURL = "https://image.tmdb.org/t/p/w500" + data.results[0].poster_path;

        fetchNYTReview(foundMovie.title);

      });
    }
  });
}
    

function fetchNYTReview(movie){
  //fetch to nyt review of movie
  reviewUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22&q="+movie+"&api-key=pf1jPMp9J2Gq6kH3AyhwAUUl2zEIlDBm";
  // fetch(reviewUrl)
  // .then(function(response){
  //   if (response.ok) {
  //     console.log(response);
  //     return response.json().then( function(data) {
  //       console.log("nyt review")
  //       console.log(data);
  //       console.log(data.response);
  //       console.log(data.response.docs[0]);
  //       console.log(data.response.docs[0].lead_paragraph);
  //       console.log(data.response.docs[0].snippet);
  //       foundMovie.reviews.nyt.snippet=data.response.docs[0].snippet;
  //       foundMovie.reviews.nyt.author=data.response.docs[0].byline.original;
  //       fetchServices(movie);
  //     });
  //   }
  // });
  fetchServices(foundMovie.title);
}


function fetchServices(movie){
  // sees if movie is streaming based on movie title
  const urlStreaming = 'https://streaming-availability.p.rapidapi.com/search/title?title='+movie+'&country=us&show_type=movie&output_language=en';
  const options1={
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '325e143123msh6e7bf9effd3a82dp190444jsn2a9f8b54b6f6',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };
  // console.log("services section");
  //commenting out to reduce number of calls
  // fetch(urlStreaming,options1)
  //   .then(function(response){
  //     if (response.ok){
  //       console.log(response);
  //       return response.json().then( function(data) {
  //         console.log("streaming service")
  //         console.log(data.result)
  //         console.log(data.result[0].streamingInfo)
  //         foundMovie.streamingServices = data.result[0].streamingInfo.us[0].service;
  //       });
  //     }
  //   });
  console.log("found movie");
  console.log(foundMovie);
  console.log("current movie list");
  console.log(currentMovieList);
  insertMovie(foundMovie, currentMovieList);

  appendCard(foundMovie);

  if ( popularClicked && count < popularArr.length - 1 ) {
    count++;
    fetchOMDB(popularArr[count]);
  } else {
    // buildMovieCards(currentMovieList);
  }
}

function insertMovie(movieObj, targetMoviesObj) {
  // insert movieObj into the first position of targetObj
    
  console.log("movie object");
  console.log(movieObj);

  console.log("target movies object")
  console.log(targetMoviesObj);

  
  for (var i = Object.keys(targetMoviesObj).length; i > 0; i--) {

    targetMoviesObj[i] = targetMoviesObj[i-1];
  }
  targetMoviesObj[0] = movieObj;
}

function buildMovieCards(targetMoviesObj) {
  movieCardsContainer.empty();
  for (var i = 0; i < Object.keys(targetMoviesObj).length; i++) {
    appendCard(targetMoviesObj[i]);
  }
}

// function addPin(movieObj) {
//   insertMovie(movieObj, pinnedMovies);
// }

// function updateMovieList() {
//   currentMovieList = {};
//   for (var i = 0; i < Object.keys(pinnedMovies).length; i++) {
//     currentMovieList[i] = pinnedMovies[i];
//   }
//   buildMovieCards(currentMovieList);
// }






function appendCard(movieObj){
  // console.log("works");
  // movieCardsContainer.text("");

  var movieCard=$("<section>").addClass("movie-card");

  var titleEl=$("<h2>").text(movieObj.title);
  titleEl.addClass("movie-card-title");


  // movie details

  var posterImage  = $("<img>").attr("src", movieObj.posterURL).attr("alt", "Movie Poster");
  var yearEl       = $("<p>").text(`Year: ${movieObj.year}`        );
  var mpaaRatingEl = $("<p>").text(`Rated ${movieObj.mpaaRating}`  );
  var runtimeEl    = $("<p>").text(getHourMin(movieObj.runtime)    );
  var genreEl      = $("<p>").text(`Genre: ${movieObj.genre}`      );
  var directorEl   = $("<p>").text(`Director: ${movieObj.director}`);
  var castEl       = $("<p>").text(`Cast: ${movieObj.cast}`        );
  var summaryEl    = $("<p>").text(movieObj.summary                );

  if( posterBox[0].checked   ) { movieCard.append(posterImage); }
  if( yearBox[0].checked     ) { titleEl.append(yearEl);        }
  if( ratingBox[0].checked   ) { titleEl.append(mpaaRatingEl);  }
  if( runtimeBox[0].checked  ) { titleEl.append(runtimeEl);     }
  if( genreBox[0].checked    ) { titleEl.append(genreEl);       }
  if( directorBox[0].checked ) { titleEl.append(directorEl);    }
  if( castBox[0].checked     ) { titleEl.append(castEl);        }
  if( summaryBox[0].checked  ) { titleEl.append(summaryEl);     }

  movieCard.append(titleEl);


  // scores
  
  var scoresEl =      $("<h3>").text("Scores:");
  
  if ( scoresBox[0].checked && movieObj.scores.length > 0 ) {
    var scoreEl = [];
    for (var i = 0; i < movieObj.scores.length; i++ ){
      scoreEl[i] = $("<p>").text(`${movieObj.scores[i].Source}: ${movieObj.scores[i].Value}`);
      scoresEl.append( scoreEl[i] );
    }

    movieCard.append( scoresEl );
  }


  // reviews

  var nytSnippetEl=$("<p>").text(`Review: ${movieObj.reviews.nyt.snippet}`);
  var nytAuthorEl=$("<p>").text(`Author: ${movieObj.reviews.nyt.author}`);

  if( nytReviewBox[0].checked && movieObj.reviews.nyt.snippet ) {
    nytSnippetEl.append(nytAuthorEl);
    movieCard.append(nytSnippetEl);
  }


  // streaming services

  var streamingServicesEl=$("<p>").text(`Streaming Services: ${movieObj.streamingServices}`);

  if( servicesBox[0].checked && movieObj.streamingServices ) { 
    movieCard.append(streamingServicesEl);
  }

  // console.log(movieCard);

  movieCardsContainer.prepend(movieCard);

  //   movieCard.text("");

  
  // if ( popularClicked && count < popularArr.length - 1 ) {
  //   count++;
  //   fetchOMDB(popularArr[count]);
  // }
  // console.log("movie card");
  // console.log(movieCardsContainer);
}


function getHourMin(minutes) {
  var hr = Math.floor(minutes / 60);
  var min = minutes % 60;
  return `${hr}h ${min}m`;
}






// localStorage: Movie Search History

function loadMovieSearchHistory() {
  movieSearchHistory = JSON.parse(localStorage.getItem("movieSearchHistoryStringify"));

  // if search history isn't saved in local storage, initialize the array variable
  if (!movieSearchHistory) {
    movieSearchHistory = [];
  }
  buildMovieSearchHistory();
}

function addToSearchHistory(searchQuery) {
  console.log(searchQuery);
  isUnique = true;
  for (var i = 0; i < movieSearchHistory.length; i++) {
    if (searchQuery === movieSearchHistory[i]) {
      isUnique = false;
    }
  }
  if (isUnique === true) {
    movieSearchHistory.push(searchQuery);
    saveMovieSearchHistory();
  }
}

function saveMovieSearchHistory() {
  localStorage.setItem("movieSearchHistoryStringify", JSON.stringify(movieSearchHistory));
  buildMovieSearchHistory();
}

function buildMovieSearchHistory() {
  // console.log(movieSearchHistoryContainerLargeEl);
  // console.log(movieSearchHistoryContainerSmallEl);
  movieSearchHistoryContainerLargeEl.empty();
  movieSearchHistoryContainerSmallEl.empty();
  // console.log(movieSearchHistory.length);
  for (var i = 0; i < movieSearchHistory.length; i++) {
    addMovieSearchHistoryButton(i);
    // console.log(i);
  }
}


// Add button for each successful search
function addMovieSearchHistoryButton(j) {
  // console.log("works");
  var newButtonLarge = $(document.createElement("button"));
  newButtonLarge.text(movieSearchHistory[j])
  newButtonLarge.addClass("bg-blue-500 text-white px-10 py-2 rounded-md mb-2 mr-2");
  newButtonLarge.attr("data-query", movieSearchHistory[j]);

  var newButtonSmall = $(document.createElement("button"));
  newButtonSmall.text(movieSearchHistory[j])
  newButtonSmall.addClass("bg-blue-500 text-white w-full py-2 rounded-md mb-2");
  newButtonSmall.attr("data-query", movieSearchHistory[j]);

  movieSearchHistoryContainerLargeEl.append(newButtonLarge);
  movieSearchHistoryContainerSmallEl.append(newButtonSmall);
}

// event listener for search history buttons, large screens
movieSearchHistoryContainerLargeEl.on("click", function(event) {
  // console.log(event.target);
  handleMovieSearchHistoryClick(event.target);
});
// event listener for search history buttons, small screens
movieSearchHistoryContainerSmallEl.on("click", function(event) {
  // console.log(event.target);
  handleMovieSearchHistoryClick(event.target);
});

function handleMovieSearchHistoryClick(element) {
  // console.log(element);
  if (element.matches("button")) {
    // console.log("match");
    var searchQuery = element.getAttribute("data-query");
    // console.log(searchQuery);
    fetchOMDB(searchQuery);
  }
}


// localStorage: Checkbox Configuration

function loadCheckboxConfig() {
  checkboxConfig = JSON.parse(localStorage.getItem("checkboxConfigStringify"));

  // if checkbox config isn't saved in local storage, initialize the array variable
  if (!checkboxConfig) {
    resetCheckboxConfig();
  }
  updateCheckboxConfig();
}

function resetCheckboxConfig() {
  checkboxConfig = {
    poster:     true,
    year:       true,
    rating:     true,
    runtime:    true,
    genre:      true,
    director:   true,
    cast:       true,
    summary:    true,
    scores:     true,
    nytReview: true,
    services:   true
  };
}

function saveCheckboxConfig() {
  localStorage.setItem("checkboxConfigStringify", JSON.stringify(checkboxConfig));
  updateCheckboxConfig();
}

function updateCheckboxConfig() {
  posterBox[0].checked    = checkboxConfig.poster;
  yearBox[0].checked      = checkboxConfig.year;
  ratingBox[0].checked    = checkboxConfig.rating;
  runtimeBox[0].checked   = checkboxConfig.runtime;
  genreBox[0].checked     = checkboxConfig.genre;
  directorBox[0].checked  = checkboxConfig.director;
  castBox[0].checked      = checkboxConfig.cast;
  summaryBox[0].checked   = checkboxConfig.summary;
  scoresBox[0].checked    = checkboxConfig.scores;
  nytReviewBox[0].checked = checkboxConfig.nytReview;
  servicesBox[0].checked  = checkboxConfig.services;
}



// run on page load

loadMovieSearchHistory();
loadCheckboxConfig();
