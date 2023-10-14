
// var movie;

var popularClicked = false;
var popularArr = [];
var count = 0;
var duplicateCount=0;
var repeat=true;

var movies=[];
var popularArr = [];

var searchButton = $("#button-search");
var popularButton = $("#button-popular");
var saveConfigButton = $("#button-save-configuration");
var clearConfigButton = $("#button-clear-configuration");
var resetHistoryButton = $("#button-reset-history");
var movieSearchInput = $("#search");
var blankSearchModal=$("#blank-search");
var notFoundModal=$("#movie-not-found");
var duplicateTitlesModal=$("#title-duplicate");

// var criteriaSection = $("#criteria");

var movieSearchHistoryContainerLargeEl = $("#search-history-container-lg");
var movieSearchHistoryContainerSmallEl = $("#search-history-container-sm");
var movieCardsContainer = $("#movie-cards-container");
var movieSearchHistory=[];

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
var carousel=$(".carousel");

$(blankSearchModal).dialog({
  autoOpen:false,
})
$(notFoundModal).dialog({
  autoOpen:false,
})
$(duplicateTitlesModal).dialog({
  autoOpen:false,
})

carousel.slick({
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll:3,
});

// init();
// initial function
function init(){
    // retrieves movies already stored locally
    var storedMovies=JSON.parse(localStorage.getItem("movies"));

    //checks to see if the object is poplated
      if (storedMovies!==null){
        //put the array into the events variable
        movies=storedMovies;
      }
      console.log(movies);
    // calls display movies
      displayMovies();
}

// function to display the cities
function displayMovies(){
  var slideIndex=movies.length;
  for(var i=0;i<movies.length;i++){
  carousel.slick('slickRemove',slideIndex - 1);
  if (slideIndex !== 0){
    slideIndex--;
  }
  }
  // for loop for the length of the stored movies
  for (let i = 0; i < movies.length; i++) {

      carousel.slick('slickAdd','<div><h3>' + movies[i] + '</h3></div>');
  }
  repeat=false;
}

function storeMovies(){
  // puts the items into a string
  localStorage.setItem("movies",JSON.stringify(movies));
}

// searchbutton click event listener
searchButton.on("click", function(event) {
  handleSearch(event);
});

// search input field "enter key" event listener
movieSearchInput.on("keypress", function(event) {
  const enterKey = 13;
  if (event.which === enterKey) {
    handleSearch(event);
  }
});

var movieSearchQuery;

function handleSearch(event) {
  var currentMovieList = {};
  event.preventDefault();
  popularClicked = false;
  //define global instead
  var movieSearchQuery = movieSearchInput.val();

  if(movieSearchQuery === ""){
    // MODAL HERE ********************************** (or nothing happens if you click when it's empty?)
    $(blankSearchModal).dialog("open");
    return;
  }
  console.log("search")
  fetchOMDB(movieSearchQuery);
  

  addToSearchHistory(movieSearchQuery);

  // Clear the input field
  movieSearchInput.val("");
}

// event listener for popular button
popularButton.on("click", function() {
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
// event listener for clicking on carousel items
carousel.on("click","h3",function(event){
  // console.log(event.target);
  var movieClicked=event.target.textContent;
  // repeat=true;
  // console.log(movieClicked);
  if (movieClicked==null){
    console.log("no null");
    return;
  }

  fetchOMDB(movieClicked);
  // console.log("works");
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
  var slideIndex=movieSearchHistory.length;
  for(var i=0;i<movieSearchHistory.length;i++){
  carousel.slick('slickRemove',slideIndex - 1);
  if (slideIndex !== 0){
    slideIndex--;
  }
  }
  console.log("clear searches")
  movieSearchHistory = [];
  buildMovieSearchHistory();
  localStorage.removeItem("movieSearchHistoryStringify");
});


function fetchPopular(){
  //fetch for popular movies
  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
  .then(function(response){
    if (response.ok){
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

var movieToPass;

function selectYear(data,movieSearchQuery){
  // console.log(data);
  for(var i = 0; i<data.length;i++){
    if(movieSearchQuery==data[i].Title.toLowerCase()){
      var yearP=$("<p>").text(data[i].Year).addClass("year");
      $(duplicateTitlesModal).append(yearP);
    }
  }

  // const variable=$(movieSearchQuery.target).data(movieToPass);

  $(duplicateTitlesModal).dialog("open");
}

duplicateTitlesModal.on("click",".year",{movieToPass: movieToPass},function(event){
  // console.log("works");
  // console.log(event.target.textContent);
  repeat=false;
  var yearChosen=event.target.textContent;
  console.log(movieToPass);
  fetchOMDBSpecific(movieToPass,yearChosen);
  $(duplicateTitlesModal).dialog("close");
})


function fetchOMDB(movieSearchQuery,year){
  console.log(movieSearchQuery);
  movieToPass=movieSearchQuery;
  // fetches based on title
  var omdbUrl = "https://www.omdbapi.com/?s="+ movieSearchQuery +"&apikey=704a2c08"
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      //   console.log(response);
      return response.json().then(function(data){

        console.log("omdb");
        console.log(data);
        if(data.Response=="False"){
          $(notFoundModal).dialog("open");
          console.log("not found");
          return;
        }
        // console.log(movieSearchQuery);
        for(var i=0;i<data.Search.length;i++){
          // console.log(data.Search[i].Title.toLowerCase());
          if(movieSearchQuery==data.Search[i].Title.toLowerCase()){
            duplicateCount++;
          }
        }
        if(duplicateCount>1&&repeat){
          selectYear(data.Search,movieSearchQuery);
          return;
        }

        // console.log(data.Search);
        // console.log(data.Search[0])
        // foundMovie.scores = data.Search[0].Ratings;
        // foundMovie.year = parseInt(data.Search[0].Year);
        // foundMovie.mpaaRating = data.Search[0].Rated;
        // foundMovie.runtime = parseInt(data.Search[0].Runtime);
        // foundMovie.genre = data.Search[0].Genre;
        // foundMovie.director = data.Search[0].Director;
        // foundMovie.cast = data.Search[0].Actors;

        console.log(foundMovie);
        fetchOMDBSpecific(movieSearchQuery);
        // console.log(data.imdbRating);
        // console.log(data.Ratings);
        // fetchTMDB(data.Search[0].Title,year);
      });
    }
  });

}


function fetchOMDBSpecific(movieSearchQuery,year){
  var omdbUrl = "https://www.omdbapi.com/?t="+ movieSearchQuery +"&apikey=704a2c08&y="+year;
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      //   console.log(response);
      return response.json().then(function(data){ 

        console.log("omdb specific");
        console.log(data);
        // console.log(data.Search);
        // console.log(data.Search[0])
        foundMovie.scores = data.Ratings;
        foundMovie.year = parseInt(data.Year);
        foundMovie.mpaaRating = data.Rated;
        foundMovie.runtime = parseInt(data.Runtime);
        foundMovie.genre = data.Genre;
        foundMovie.director = data.Director;
        foundMovie.cast = data.Actors;
        fetchTMDB(data.Title,year);
      })
    }
  })
}




function fetchTMDB(movie,year){
  //fetches to TMDB
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  };
  console.log(movie);
  // console.log(year);
  fetch('https://api.themoviedb.org/3/search/movie?query='+movie+'&include_adult=false&language=en-US&year='+year, options)
  .then(function(response){
    if (response.ok){
      //console.log(response);
      return response.json().then(function(data){
        console.log("TMDB specific movie");
        console.log(data);
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
  console.log("NYT");
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
  console.log("services");
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

  insertMovie(foundMovie, currentMovieList);

  if ( popularClicked && count < popularArr.length - 1 ) {
    count++;
    fetchOMDB(popularArr[count]);
  } else {
    buildMovieCards(currentMovieList);
  }
}


function insertMovie(movieObj, list) {
  for (var i = 0; i < Object.keys(list).length; i++) {
    if ( movieObj.title === list[i].title ) {
    console.log("identical");
    return;
    }
  }

  // insert movieObj into the first position of targetObj using deepCopy
  for (let i = Object.keys(list).length; i > 0; i--) {
    list[i] = deepCopy(list[i - 1]);
  }
  list[0] = deepCopy(movieObj);
}


function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy);
  }

  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }

  return newObj;
}


function buildMovieCards(targetMoviesObj) {
  movieCardsContainer.empty();
  for (var i = Object.keys(targetMoviesObj).length - 1; i >= 0; i--) {
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
  console.log(movieObj);
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

  // put the new card at the top
  movieCardsContainer.prepend(movieCard);
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
  var isUnique = true;
  for (var i = 0; i < movieSearchHistory.length; i++) {
    if (searchQuery.toLowerCase() === movieSearchHistory[i].toLowerCase()) {
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
  // movieSearchHistoryContainerLargeEl.empty();
  // movieSearchHistoryContainerSmallEl.empty();
  var slideIndex=movieSearchHistory.length;
  for(var i=0;i<movieSearchHistory.length;i++){
  carousel.slick('slickRemove',slideIndex - 1);
  if (slideIndex !== 0){
    slideIndex--;
  }
  }
  // for loop for the length of the stored movies
  for (let i = 0; i < movieSearchHistory.length; i++) {

      carousel.slick('slickAdd','<div><h3>' + movieSearchHistory[i] + '</h3></div>');
  }
  // for (var i = 0; i < movieSearchHistory.length; i++) {
    // addMovieSearchHistoryButton(i);
  }



// Add button for each successful search
function addMovieSearchHistoryButton(j) {
  // add button to large page location
  var newButtonLarge = $(document.createElement("button"));
  newButtonLarge.text(movieSearchHistory[j])
  newButtonLarge.addClass("bg-blue-500 text-white px-10 py-2 rounded-md mb-2 mr-2");
  newButtonLarge.attr("data-query", movieSearchHistory[j]);

  // add button to small page location
  var newButtonSmall = $(document.createElement("button"));
  newButtonSmall.text(movieSearchHistory[j])
  newButtonSmall.addClass("bg-blue-500 text-white w-full py-2 rounded-md mb-2");
  newButtonSmall.attr("data-query", movieSearchHistory[j]);

  // append both new button elements; only one is displayed, depending on page width breakpoint
  movieSearchHistoryContainerLargeEl.append(newButtonLarge);
  movieSearchHistoryContainerSmallEl.append(newButtonSmall);
}

// event listener for search history buttons, large screens
// movieSearchHistoryContainerLargeEl.on("click", function(event) {
//   // console.log(event.target);
//   console.log("large click");
//   handleMovieSearchHistoryClick(event.target);
// });
// event listener for search history buttons, small screens
// movieSearchHistoryContainerSmallEl.on("click", function(event) {
//   // console.log(event.target);
//   console.log("small click");
//   handleMovieSearchHistoryClick(event.target);
// });

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
    nytReview:  true,
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
