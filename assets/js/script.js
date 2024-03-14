const pinnedColor = "border-blue-500";
const unpinnedColor = "border-gray-200";

var movie;
var movies;

var popularClicked = false;
var popularArr = [];
var count = 0;
var duplicateCount=0;
var repeat=true;
var movieToPass;
var movies=[];
var popularArr = [];

var movieSearchHistory = [];

var searchButton = $("#button-search");
var popularButton = $("#button-popular");
var saveConfigButton = $("#button-save-configuration");
var clearConfigButton = $("#button-clear-configuration");
var resetHistoryButton = $("#button-reset-history");
var clearUnpinnedButton = $("#button-clear-unpinned");
var movieSearchInput = $("#search");
var blankSearchModal=$("#blank-search");
var notFoundModal=$("#movie-not-found");
var duplicateTitlesModal=$("#title-duplicate");
var popSearchModal=$(("#pop-search"));

// var criteriaSection = $("#criteria");

var movieSearchHistoryContainerLargeEl = $("#search-history-container-lg");
var movieSearchHistoryContainerSmallEl = $("#search-history-container-sm");
var movieCardsContainer = $("#movie-cards-container");
var movieSearchHistory=[];
var carouselContainer = $("#carousel-container");
var genreSelect=$("#genres");

// checkbox pointer variables

var posterBox    = $( "#cb-poster"     );
var ratingBox    = $( "#cb-rating"     );
var yearBox      = $( "#cb-year"       );
var runtimeBox   = $( "#cb-runtime"    );
var genreBox     = $( "#cb-genre"      );
var directorBox  = $( "#cb-director"   );
var castBox      = $( "#cb-cast"       );
var summaryBox   = $( "#cb-summary"    );
var nytReviewBox = $( "#cb-review-nyt" );
var servicesBox  = $( "#cb-services"   );
var scoresBox    = $( "#cb-scores"     );

var checkboxConfig = {};


// foundMovie is used to gather the current search result data from our set of queries
var foundMovie = {
  cast: "",
  director: "",
  genre: "",
  mpaaRating: "",
  pinned: false,
  posterURL: "",
  reviews: { nyt: { author: "", snippet: "" } },
  runtime: 0,
  scores: [],
  streamingServices: "",
  summary: "",
  title: "",
  year: 0
};

// object variables to hold nested collections of foundMovie objects
var pinnedMovies = {};
var currentMovieList = {};

$(blankSearchModal).dialog({
  autoOpen:false,
})
$(notFoundModal).dialog({
  autoOpen:false,
})
$(duplicateTitlesModal).dialog({
  autoOpen:false,
})
$(popSearchModal).dialog({
  autoOpen:false,
})

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
// retrieve and process search input query
function handleSearch(event) {

  event.preventDefault();
  popularClicked = false;
  //define global instead
  var movieSearchQuery = movieSearchInput.val();

  if(movieSearchQuery === ""){
    // modal to inform user of blank search query
    $(blankSearchModal).dialog("open");
    return;
  }
  console.log("search")
  fetchOMDB(movieSearchQuery);
  
  // Clear the input field
  movieSearchInput.val("");
}

// event listener for popular button
popularButton.on("click", function() {
  //sets the popular clicked to true
  popularClicked = true;
  // opens the modal to notify user that some apis are not called
  $(popSearchModal).dialog("open");
  //calls fetch popular with the a genre selected
  fetchPopular(genreSelect.val());
});


// event listener for checkbox change
$(".boxId").on("change", function() {
  // update checkbox config
  checkboxConfig[$(this).attr("value")] = $(this).prop("checked");

  // toggle between "display: block" and "display: none"
  $(`.${$(this).attr("value")}`).toggle();

  // checkboxId = $(this).attr("value");
  // isChecked = $(this).prop("checked");
  // console.log(checkboxId + " is now " + (isChecked ? "checked" : "unchecked"));
  // buildMovieCards(currentMovieList); // not necessary
});

// event listener for clicking on carouselContainer items
carouselContainer.on("click","h3", function(event) {
  //gets the name of movie clicked on
  var movieClicked = event.target.textContent;
  // calls fetchOMDB function
  fetchOMDB(movieClicked);
});

// event listener for clicking on a movie card
movieCardsContainer.on("click", ".movie-card", function(event) {
  // get the current value of "data-pinned"
  var isPinned = $(this).data("pinned");
  var index = $(this).index();

  // toggle the value of "pinned"
  $(this).data("pinned", !isPinned);
  // toggle the corresponding value of pinned in the object variable
  currentMovieList[index].pinned = !isPinned;

  if ( isPinned ) {
    $(this).removeClass(pinnedColor).addClass(unpinnedColor)
  } else {
    $(this).removeClass(unpinnedColor).addClass(pinnedColor)
  }
  updatePinnedMovies();
});

function updatePinnedMovies() {
  pinnedMovies = {};
  for (var i = 0; i < Object.keys(currentMovieList).length; i++) {
    if ( currentMovieList[i].pinned === true ) {
      insertMovie(currentMovieList[i], pinnedMovies);
    }
  }
  savePinnedMovies();
}

function savePinnedMovies() {
  localStorage.setItem("pinnedMoviesStringify", JSON.stringify(pinnedMovies));
}

function loadPinnedMovies() {
  pinnedMovies = JSON.parse(localStorage.getItem("pinnedMoviesStringify"));

  if (!pinnedMovies) {
    pinnedMovies = {};
  }
  clearUnpinnedMovies();
}


function clearUnpinnedMovies() {
  currentMovieList = {};
  for (var i = 0; i < Object.keys(pinnedMovies).length; i++) {
    insertMovie(pinnedMovies[i], currentMovieList);
  }
  buildMovieCards(currentMovieList);
}

// event listener for save configuration button
saveConfigButton.on("click", saveCheckboxConfig );


// event listener for clear configuration button
clearConfigButton.on("click", function() {
  resetCheckboxConfig();
  updateCheckboxConfig();
  localStorage.removeItem("checkboxConfigStringify");
  buildMovieCards(currentMovieList);
});

// event listener for reset history button
resetHistoryButton.on("click", function() {
  // console.log("Clear search history");
  movieSearchHistory = [];
  buildMovieSearchHistory();
  localStorage.removeItem("movieSearchHistoryStringify");
});

// event listener for clear unpinned Movies button
clearUnpinnedButton.on("click", clearUnpinnedMovies );

//function to get the id from the genre dropdown
function getGenreId(genre){
  var genreID;
  switch(genre){
    case "action":
        genreID="28"
        break;
    case "adventure":
        genreID="12"
        break;
    case "animation":
        genreID="16"
        break;
    case "comedy":
        genreID="35"
        break;
    case "crime":
        genreID="80"
        break;
    case "documentary":
        genreID="99"
        break;
    case "drama":
        genreID="18"
        break;
    case "family":
        genreID="10751"
        break;
    case "fantasy":
        genreID="14"
        break;
    case "history":
        genreID="36"
        break;
    case "horror":
        genreID="27"
        break;
    case "music":
        genreID="10402"
        break;
    case "mystery":
        genreID="9648"
        break;
    case "romance":
        genreID="10749"
        break;
    case "science fiction":
        genreID="878"
        break;
    case "thriller":
        genreID="53"
        break;
    case "war":
        genreID="10752"
        break;
    case "western":
        genreID="37";
        break;
    default:
        genreID="";

    }
    //returns the id number
    return genreID;
}

// function to get the popular movies
function fetchPopular(genre){
  //gets the genre ID
  var genreID=getGenreId(genre);
  //options for the api search
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  }
  //api url with the genre able to be changed
  var popUrl="https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres="+genreID;
  //fetches the data
  fetch(popUrl,options)
  .then(function(response){
    //checks that the response is ok
    if (response.ok){
      return response.json().then(function(data){
        //for loop to get all the results and push them into an array
        for(var i=data.results.length-1;i>=0;i--){

          popularArr.push(data.results[i].title);
        }
        //calls the specific search for the each movie
        fetchOMDBSpecific(popularArr[count]);
      });
    }
  });
}

// function to call OMDB to get list of movies
function fetchOMDB(movieSearchQuery,year){
  // setting the variable to get the movie title
  movieToPass=movieSearchQuery;
  // api url
  var omdbUrl = "https://www.omdbapi.com/?s="+ movieSearchQuery +"&type=movie&apikey=704a2c08"
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      return response.json().then(function(data){
        //checks to see if the response is good
        if(data.Response=="False"){
          //calls specific fetch
          fetchOMDBSpecific(movieSearchQuery);
        }
        //checks to see if the movie has duplicates with the same title
        for(var i=0;i<data.Search.length;i++){
          //checks to see if the movie name matches the results
          if(movieSearchQuery==data.Search[i].Title.toLowerCase()){
            duplicateCount++;
          }
        }
        //checks that there are more than 1 match
        if(duplicateCount>1&&repeat){
          //calls the select year function
          selectYear(data.Search,movieSearchQuery);
          return;
        }
        //calls the omdb specific function
        fetchOMDBSpecific(movieSearchQuery,year);
      });
    }
  });

}

//function to select the year if there are duplicates
function selectYear(data,movieSearchQuery){
  //adds all the duplicate years to a modal
  for(var i = 0; i<data.length;i++){
    if(movieSearchQuery==data[i].Title.toLowerCase()){
      //creates a new element and gives it the class of year
      var yearP=$("<p>").text(data[i].Year).addClass("year");
      $(duplicateTitlesModal).append(yearP);
    }
  }

  //opens the modal
  $(duplicateTitlesModal).dialog("open");
}
//event listener on the years for the modal
duplicateTitlesModal.on("click",".year",function(event){
  //sets repeat to false
  repeat=false;
  //gets the year that was clicked on
  var yearChosen=event.target.textContent;
  // resets the duplicate count
  duplicateCount=0;
  // calls the OMDB specific
  fetchOMDBSpecific(movieToPass,yearChosen);
  // closes the modal
  $(duplicateTitlesModal).dialog("close");
})

// function to get a specific movie from OMDB
function fetchOMDBSpecific(movieSearchQuery,year){
  // url containing movie and year
  var omdbUrl = "https://www.omdbapi.com/?t="+ movieSearchQuery +"&y="+year+"&type=movie&apikey=704a2c08";
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      return response.json().then(function(data){ 
        //checks if there is no data sent back
        if(data.Response=="False"){
          //checks to see if the popular button was clicked
          if(popularClicked){
            //opens a modal saying the movie was not found
            notFoundModal.text(movieSearchQuery+" was not found");
            $(notFoundModal).dialog("open");
            //adds one to the count
            count++;
            //calls for the next movie in the popular list
            fetchOMDBSpecific(popularArr[count]);
          return;
        }
        // same as above
        else{
          notFoundModal.text(movieSearchQuery+" was not found");
          $(notFoundModal).dialog("open");
          console.log("not found");
          return; 
        }
      }
        // resets the duplicate count
        duplicateCount=0;
        // parses the data and adds it the the found movie object
        foundMovie.scores = data.Ratings;
        foundMovie.year = parseInt(data.Year);
        foundMovie.mpaaRating = data.Rated;
        foundMovie.runtime = parseInt(data.Runtime);
        foundMovie.genre = data.Genre;
        foundMovie.director = data.Director;
        foundMovie.cast = data.Actors;
        //calls the fetchTMDB function
        fetchTMDB(data.Title,foundMovie.year);
      })
    }
  })
}



//function to get the info from TMDB
function fetchTMDB(movie,year){
  //fetches to TMDB
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  };
  //fetches using the movie and year
  fetch('https://api.themoviedb.org/3/search/movie?query='+movie+'&include_adult=false&language=en-US&year='+year, options)
  .then(function(response){
    if (response.ok){

      return response.json().then(function(data){
        //parse the data and adds it to the object
        foundMovie.title = data.results[0].title;
        foundMovie.summary = data.results[0].overview;
        foundMovie.posterURL = "https://image.tmdb.org/t/p/w500" + data.results[0].poster_path;
        foundMovie.scores.push({Source:'User Score',Value:data.results[0].vote_average});
        //calls the NYT review function
        fetchNYTReview(foundMovie.title,year);

      });
    }
  });
}
    
//gets a review from the NYT
function fetchNYTReview(movie,year){
  //checks to see if popular movie is clicked to avoid API restrictions
  if(popularClicked){
    // calls the fetch services function
    fetchServices(movie);
  }else{
    //url with input of movie and year
  reviewUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22%20AND%20pub_year%3A%22"+year+"%22&q="+movie+"&api-key=pf1jPMp9J2Gq6kH3AyhwAUUl2zEIlDBm";
  fetch(reviewUrl)
  .then(function(response){
    console.log(response);
    if (response.ok) {
      return response.json().then( function(data) {
        //checks to see if there is a review
        if(data.response.docs.length===0){

        }else{
          // parses the info
        foundMovie.reviews.nyt.snippet=data.response.docs[0].snippet;
        foundMovie.reviews.nyt.author=data.response.docs[0].byline.original;
        }
        // calls fetch services function
        fetchServices(movie);
      });
    }
  });
  }
}

// function to get the streaming services
function fetchServices(movie){
  //checks to see if popular is clicked
  if(popularClicked){
    // inserts the movie to the current movies list
    insertMovie(foundMovie, currentMovieList);
    //checks to see if there are more items to go through in the popular array
    if (count < popularArr.length - 1 ) {
      count++;
      fetchOMDB(popularArr[count]);
    } else {
      // calls the build movie card list
      buildMovieCards(currentMovieList);
    }
  }else{
    // url for streaming availability using movie
    const urlStreaming = 'https://streaming-availability.p.rapidapi.com/search/title?title='+movie+'&country=us&show_type=movie&output_language=en';
    const options1={
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '325e143123msh6e7bf9effd3a82dp190444jsn2a9f8b54b6f6',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };
    fetch(urlStreaming,options1).then(function(response){
      if (response.ok){
        return response.json().then( function(data) {
          //parse the data and adds it to the array
          foundMovie.streamingServices = {service:data.result[0].streamingInfo.us[0].service,type:data.result[0].streamingInfo.us[0].streamingType};
          if(!popularClicked){
            addToSearchHistory(movie);
          }
          insertMovie(foundMovie, currentMovieList);
  
          if ( popularClicked && count < popularArr.length - 1 ) {
            count++;
            fetchOMDB(popularArr[count]);
          } else {
            buildMovieCards(currentMovieList);
          }
        });
      }else{
        //if a bad response do the same as above
        if(!popularClicked){
          addToSearchHistory(movie);
        }
          insertMovie(foundMovie, currentMovieList);
  
          if ( popularClicked && count < popularArr.length - 1 ) {
            count++;
            fetchOMDB(popularArr[count]);
          } else {
            buildMovieCards(currentMovieList);
          }
    }

  })
}
}

function insertMovie(movieObj, list) {
  for (var i = 0; i < Object.keys(list).length; i++) {
    if ( movieObj.title === list[i].title ) {
    // console.log("identical");
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
  if (!targetMoviesObj) { return; }

  for (var i = Object.keys(targetMoviesObj).length - 1; i >= 0; i--) {
      appendCard(targetMoviesObj[i]);
  }
  console.log(nytReviewBox[0].checked);
  initializeMovieCardOptions();
}


function initializeMovieCardOptions() {
  $('.movie-poster'     ).hide();
  $('.movie-rating'     ).hide();
  $('.movie-year'       ).hide();
  $('.movie-runtime'    ).hide();
  $('.movie-genre'      ).hide();
  $('.movie-director'   ).hide();
  $('.movie-cast'       ).hide();
  $('.movie-summary'    ).hide();
  $('.movie-review' ).hide();
  $('.movie-services'   ).hide();
  $('.movie-scores'     ).hide();

  if( posterBox[0]    .checked ) { $('.movie-poster'     ).show(); }
  if( ratingBox[0]    .checked ) { $('.movie-rating'     ).show(); }
  if( yearBox[0]      .checked ) { $('.movie-year'       ).show(); }
  if( runtimeBox[0]   .checked ) { $('.movie-runtime'    ).show(); }
  if( genreBox[0]     .checked ) { $('.movie-genre'      ).show(); }
  if( directorBox[0]  .checked ) { $('.movie-director'   ).show(); }
  if( castBox[0]      .checked ) { $('.movie-cast'       ).show(); }
  if( summaryBox[0]   .checked ) { $('.movie-summary'    ).show(); }
  if( nytReviewBox[0] .checked ) { $('.movie-review'     ).show(); }
  if( servicesBox[0]  .checked ) { $('.movie-services'   ).show(); }
  if( scoresBox[0]    .checked ) { $('.movie-scores'     ).show(); }
}

// function updatePropsDivider() {
//   var elIndex;
//   for (var i = 1; i <=3; i++) {
//     elIndex = $(".props-divider" + i).index()
//     if ( $(`.movie-properties:eq(${elIndex - 1})`).css("display") === "none" && {

//     }
//   }
// }

function appendCard(movieObj){
  var borderColor = unpinnedColor;
  var isPinned = "false";
  if ( movieObj.pinned === true ) {
    borderColor = pinnedColor;
    isPinned = "true";
  }
  

  var movieCard       = $(`<div class="movie-card flex flex-col sm:flex-row snap-start box-border border-8 ${borderColor} h-200 bg-white rounded-md p-2 shadow-md" data-pinned=${isPinned}></div>`).addClass("overflow-scroll");
  
  var moviePoster     = $(`<div class="movie-poster object-left flex-none mr-2"><img class="fixed-width-image grow-0" src=${movieObj.posterURL} alt="Movie Poster"></div>`);

  var movieDetails    = $('<div class="movie-details flex-1 pr-2"></div>'); // for header, title, properties, director, cast, summary, review, services
  var movieHeader     = $('<div class="movie-header"></div>');

  var movieTitle      = $(`<div class="movie-title text-4xl">${movieObj.title}</div>`);
  var movieProperties = $('<div class="movie-properties flex -ml-6 my-1"></div>'); // for rating, year, runtime, genre

  var movieRating     = $(`<span class="movie-rating ml-6">${movieObj.mpaaRating}</span>`);
  // var propsDivider1    = $('<span class="props-divider1">  •  </span>');
  var movieYear       = $(`<span class="movie-year ml-6">${movieObj.year}</span>`);
  // var propsDivider2    = $('<span class="props-divider2">  •  </span>');
  var movieRuntime    = $(`<span class="movie-runtime ml-6">${getHourMin(movieObj.runtime)}</span>`);
  // var propsDivider3    = $('<span class="props-divider3">  •  </span>');
  var movieGenre      = $(`<span class="movie-genre ml-6">${movieObj.genre}</span>`);

  var movieDirector   = $(`<div class="movie-director"><span class="info-name">Directed by: </span>${movieObj.director}</div>`);
  var movieCast       = $(`<div class="movie-cast"><span class="info-name">Top cast: </span>${movieObj.cast}</div>`);
  var movieSummary    = $(`<div class="movie-summary mt-1 text-justify"><span class="info-name">Summary: </span>${movieObj.summary}</div>`);

  // var summaryHeading  = $('<div class="movie-summary-heading">Summary</div>');
  // var summaryText    = $(`<div class="movie-summary-text pr-2">${movieObj.summary}</div>`);

  var movieReview     = $('<div class="movie-review mt-1"></div>'); // for snippet, author

  var nytSnippet      = $(`<div class="review-snippet text-justify"><span class="info-name">Review: </span>${movieObj.reviews.nyt.snippet}</div>`);
  var nytAuthor      = $(`<div class="review-author"><span class="info-name">Author: </span>${movieObj.reviews.nyt.author}</div>`);

  var movieServices   = $(`<div class="movie-services mt-1"><span class="info-name">Streaming Services: </span>${movieObj.streamingServices.service} Type: ${movieObj.streamingServices.type}</div>`);

  var movieScores     = $('<div class="movie-scores"></div>'); // for scores

  var scoreEl = [];
  for (var i = 0; i < movieObj.scores.length; i++ ){
    scoreEl[i] = $(`<div class="score mb-2"><span class="info-name">${movieObj.scores[i].Source}: </span>${movieObj.scores[i].Value}</div>`);
    movieScores.append( scoreEl[i] );
  }


  movieProperties .append(movieRating)
                  .append(movieYear)
                  .append(movieRuntime)
                  .append(movieGenre);

  movieHeader     .append(movieTitle)
                  .append(movieProperties);
  
  movieReview     .append(nytSnippet)
                  .append(nytAuthor);

  movieDetails    .append(movieHeader)
                  .append(movieDirector)
                  .append(movieCast)
                  .append(movieSummary);

  // only append review if it includes content
  if( movieObj.reviews.nyt.snippet ) {
    movieDetails  .append(movieReview);
  }
  // only append streaming info if it includes content
  if( movieObj.streamingServices ) { 
    movieDetails  .append(movieServices);
  }

  movieCard       .append(moviePoster)
                  .append(movieDetails)
                  .append(movieScores);
  // put the new card at the top
  movieCardsContainer.prepend(movieCard);
}


function getHourMin(minutes) {
  var hr = Math.floor(minutes / 60);
  var min = minutes % 60;
  return `${hr} h ${min} m`;
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

//uses the 3rd party api Slick
carouselContainer.slick({
  // adds dots below the titles
  dots: true,
  // adds infinite scrolling
  infinite: true,
  //sets the speed of the scroll
  speed: 300,
  //shows 6 slides
  slidesToShow: 6,
  //scrolls 6 slides
  slidesToScroll:6,
  //changes slides shown and scrolled based off break points
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      }
      },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,

      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});


function buildMovieSearchHistory() {
  // movieSearchHistoryContainerLargeEl.empty();
  // movieSearchHistoryContainerSmallEl.empty();
  // var slideIndex=movieSearchHistory.length;
  // for(var i=0;i<movieSearchHistory.length;i++){
  // carouselContainer.slick('slickRemove',slideIndex - 1);
  // if (slideIndex !== 0){
  //   slideIndex--;
  carouselContainer.slick('unslick');
  carouselContainer.empty();
  // }
  carouselContainer.slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll:6,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
        },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
  
  // var slideIndex = movieSearchHistory.length;

  // for(var i = 0; i < movieSearchHistory.length; i++){
  //   carouselContainer.slick('slickRemove', slideIndex - 1);
  //   if (slideIndex !== 0){
  //     slideIndex--;
  //   }
  // }

  // for(var i = movieSearchHistory.length; i > 0; i--){
  //   carouselContainer.slick('slickRemove', i);
  // }

  // carouselContainer.slick('getslick');
  // movieSearchHistoryContainerLargeEl.empty();
  // movieSearchHistoryContainerSmallEl.empty();

  for (var i = 0; i < movieSearchHistory.length; i++) {

    carouselContainer.slick('slickAdd','<div><h3>' + movieSearchHistory[i] + '</h3></div>');

    // addMovieSearchHistoryButton(i);
  }
}


// var $status = $('.pagingInfo');
// var $slickElement = $('.slideshow');

// carouselContainer.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
//   //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
//   var i = (currentSlide ? currentSlide : 0) + 1;
//   $status.text(i + '/' + slick.slideCount);
// });

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
  checkboxConfig = {};
  checkboxConfig["movie-poster"]     = true;
  checkboxConfig["movie-rating"]     = true;
  checkboxConfig["movie-year"]       = true;
  checkboxConfig["movie-runtime"]    = true;
  checkboxConfig["movie-genre"]      = true;
  checkboxConfig["movie-director"]   = true;
  checkboxConfig["movie-cast"]       = true;
  checkboxConfig["movie-summary"]    = true;
  checkboxConfig["movie-scores"]     = true;
  checkboxConfig["movie-review-nyt"] = true;
  checkboxConfig["movie-services"]   = true;
}

function saveCheckboxConfig() {
  localStorage.setItem("checkboxConfigStringify", JSON.stringify(checkboxConfig));
  // updateCheckboxConfig(); // not necessary
}

function updateCheckboxConfig() {
  posterBox[0].checked    = checkboxConfig["movie-poster"];
  ratingBox[0].checked    = checkboxConfig["movie-rating"];
  yearBox[0].checked      = checkboxConfig["movie-year"];
  runtimeBox[0].checked   = checkboxConfig["movie-runtime"];
  genreBox[0].checked     = checkboxConfig["movie-genre"];
  directorBox[0].checked  = checkboxConfig["movie-director"];
  castBox[0].checked      = checkboxConfig["movie-cast"];
  summaryBox[0].checked   = checkboxConfig["movie-summary"];
  scoresBox[0].checked    = checkboxConfig["movie-scores"];
  nytReviewBox[0].checked = checkboxConfig["movie-review-nyt"];
  servicesBox[0].checked  = checkboxConfig["movie-services"];
}



// run on page load

loadMovieSearchHistory();
loadCheckboxConfig();
loadPinnedMovies();
