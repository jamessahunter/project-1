
var movie;

var popularClicked = false;
var count = 0;

var popularArr = [];
var moviePosterURL = "";

var searchButton = $(".btn");
var popularButton = $(".btn-popular");
var criteriaSection = $("#criteria");
var movieInput = $("#search");
var movieCards = $("#movie-cards");

var movieSearchHistoryContainerLargeEl = $("#search-history-container-lg");
var movieSearchHistoryContainerSmallEl = $("#search-history-container-sm");

// queryResult is used to gather the current search result data from our set of queries
var queryResult = {
  cast: "",
  director: "",
  genre: "",
  mpaaRating: "",
  reviews: { nyt: { author: "", snippet: "" } },
  runtime: 0,
  scores: [],
  streamingServices: "",
  summary: "",
  title: "",
  year: 0
};


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
  saveMovieSearchHistory(movieSearchQuery);

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
  // Handle checkbox change here
  var checkboxId = $(this).attr("id");
  var isChecked = $(this).prop("checked");

  // console.log(checkboxId + " is now " + (isChecked ? "checked" : "unchecked"));
  // Additional actions based on the checkbox state
});




function fetchPopular(){
  //fetch for popular movies
  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
  .then(function(response){
    if (response.ok){
      // console.log(response);
      return response.json().then(function(data){
        console.log("popular movies")
        //   console.log(data);
        //   console.log(data.results);
        for(var i=data.results.length-1;i>=0;i--){
          // console.log(wait);
          popularArr.push(data.results[i].title);

          // var movieTitle = data.results[i].title;
          // fetchOMDB(movieTitle);
          // console.log(data.results[i]);
        }
        console.log(popularArr);
        fetchOMDB(popularArr[count]);
      });
    }
  });
}


function fetchOMDB(movieSearchQuery){
  // fetches based on title
  var omdbUrl = "https://www.omdbapi.com/?t="+ movieSearchQuery +"&plot=short&apikey=704a2c08"
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      // console.log(response);
      return response.json().then(function(data){
        // console.log("omdb");
        // console.log(data);
        
        queryResult.scores = data.Ratings;

        queryResult.year = parseInt(data.Year);
        queryResult.mpaaRating = data.Rated;
        queryResult.runtime = parseInt(data.Runtime);
        queryResult.genre = data.Genre;
        queryResult.director = data.Director;
        queryResult.cast = data.Actors;
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
        queryResult.title = data.results[0].title;
        // queryResult.score.tmdb = data.results[0].vote_average;
        queryResult.summary = data.results[0].overview;
        // console.log(data);
        // console.log(data.original_title);
        // console.log(data.vote_average);
        // console.log(data.poster_path);
        // console.log(data.runtime);
         moviePosterURL = "https://image.tmdb.org/t/p/w500" + data.results[0].poster_path;

        fetchNYTReview(queryResult.title);

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
  //       queryResult.reviews.nyt.snippet=data.response.docs[0].snippet;
  //       queryResult.reviews.nyt.author=data.response.docs[0].byline.original;
  //       fetchServices(movie);
  //     });
  //   }
  // });
  fetchServices(queryResult.title);
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
  console.log("services section");
  //commenting out to reduce number of calls
  // fetch(urlStreaming,options1)
  //   .then(function(response){
  //     if (response.ok){
  //       console.log(response);
  //       return response.json().then( function(data) {
  //         console.log("streaming service")
  //         console.log(data.result)
  //         console.log(data.result[0].streamingInfo)
  //         queryResult.streamingServices = data.result[0].streamingInfo.us[0].service;
  //       });
  //     }
  //   });

  appendCard();
}

function appendCard(){
  // console.log("works");
  // movieCards.text("");

  var movieCard=$("<section>").addClass("movie-card");

  var titleEl=$("<h2>").text(queryResult.title);
  titleEl.addClass("movie-card-title");


  // movie details

  var posterImage  = $("<img>").attr("src", moviePosterURL).attr("alt", "Movie Poster");
  var yearEl       = $("<p>").text(`Year: ${queryResult.year}`        );
  var mpaaRatingEl = $("<p>").text(`Rated ${queryResult.mpaaRating}`  );
  var runtimeEl    = $("<p>").text(getHourMin(queryResult.runtime)    );
  var genreEl      = $("<p>").text(`Genre: ${queryResult.genre}`      );
  var directorEl   = $("<p>").text(`Director: ${queryResult.director}`);
  var castEl       = $("<p>").text(`Cast: ${queryResult.cast}`        );
  var summaryEl    = $("<p>").text(queryResult.summary                );

  var posterBox   = $( "#cb-poster"   );
  var yearBox     = $( "#cb-year"     );
  var ratingBox   = $( "#cb-rating"   );
  var runtimeBox  = $( "#cb-runtime"  );
  var genreBox    = $( "#cb-genre"    );
  var directorBox = $( "#cb-director" );
  var castBox     = $( "#cb-cast"     );
  var summaryBox  = $( "#cb-summary"  );

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
  
  var scoresBox = $("#cb-scores");
  var scoresEl =      $("<h3>").text("Scores:");
  
  if ( scoresBox[0].checked && queryResult.scores.length > 0 ) {
    var scoreEl = [];
    for (var i = 0; i < queryResult.scores.length; i++ ){
      scoreEl[i] = $("<p>").text(`${queryResult.scores[i].Source}: ${queryResult.scores[i].Value}`);
      scoresEl.append( scoreEl[i] );
    }

    movieCard.append( scoresEl );
  }


  // reviews

  var nytSnippetEl=$("<p>").text(`Review: ${queryResult.reviews.nyt.snippet}`);
  var nytAuthorEl=$("<p>").text(`Author: ${queryResult.reviews.nyt.author}`);

  var nytReviewBox=$("#cb-review-nyt");

  if( nytReviewBox[0].checked && queryResult.reviews.nyt.snippet ) {
    nytSnippetEl.append(nytAuthorEl);
    movieCard.append(nytSnippetEl);
  }


  // streaming services

  var streamingServicesEl=$("<p>").text(`Streaming Services: ${queryResult.streamingServices}`);
  var servicesBox=$("#cb-services");

  if( servicesBox[0].checked && queryResult.streamingServices ) { 
    movieCard.append(streamingServicesEl);
  }

  // console.log(movieCard);

  movieCards.prepend(movieCard);

  //   movieCard.text("");

  
  if ( popularClicked && count < popularArr.length - 1 ) {
    count++;
    fetchOMDB(popularArr[count]);
  }
  // console.log("movie card");
  // console.log(movieCards);
}


function getHourMin(minutes) {
  var hr = Math.floor(minutes / 60);
  var min = minutes % 60;
  return `${hr}h ${min}m`;
}




// localStorage: movieSearchHistory

var movieSearchHistory = [];
loadMovieSearchHistory();

function loadMovieSearchHistory() {
  movieSearchHistory = JSON.parse(localStorage.getItem("movieSearchHistoryStringify"));

  // if search history isn't saved in local storage, initialize the array variable
  if (!movieSearchHistory) {
    movieSearchHistory = [];
  }
  buildMovieSearchHistory();
}

function saveMovieSearchHistory(searchQuery) {
  console.log(searchQuery);
  isUnique = true;
  for (var i = 0; i < movieSearchHistory.length; i++) {
    if (searchQuery === movieSearchHistory[i]) {
      isUnique = false;
    }
  }
  if (isUnique === true) {
    movieSearchHistory.push(searchQuery);
    localStorage.setItem("movieSearchHistoryStringify", JSON.stringify(movieSearchHistory));
    buildMovieSearchHistory();
  }
}

function buildMovieSearchHistory() {
  // console.log(movieSearchHistoryContainerLargeEl);
  // console.log(movieSearchHistoryContainerSmallEl);
  movieSearchHistoryContainerLargeEl.empty();
  movieSearchHistoryContainerSmallEl.empty();
  // console.log(movieSearchHistory.length);
  for (var i = 0; i < movieSearchHistory.length; i++) {
    addMovieSearchHistoryButton(i);
    console.log(i);
  }
}


// Add button for each successful search
function addMovieSearchHistoryButton(j) {
  console.log("works");
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
  console.log(event.target);
  handleMovieSearchHistoryClick(event.target);
});
// event listener for search history buttons, small screens
movieSearchHistoryContainerSmallEl.on("click", function(event) {
  console.log(event.target);
  handleMovieSearchHistoryClick(event.target);
});

function handleMovieSearchHistoryClick(element) {
  console.log(element);
  if (element.matches("button")) {
    console.log("match");
    var searchQuery = element.getAttribute("data-query");
    console.log(searchQuery);
    fetchOMDB(searchQuery);
  }
}
