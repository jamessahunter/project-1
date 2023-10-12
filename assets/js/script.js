
var movie;

var popularClicked = false;
var count = 0;

var popularArr = [];

var searchButton = $(".btn");
var popularButton = $(".btn-popular");
var movieInput = $("#search");
var movieCards = $("#movie-cards");
var scoresBox = $("#scores");
var summaryBox=$("#summary");
var directorBox=$("#director");
var castBox=$("#cast");
var runtimeBox=$("#runtime");
var ratedBox=$("#rated");
var nytReviewBox=$("#nyt-review");
var servicesBox=$("#services");
var genreBox=$("#genre");
var movieCard=$("<section>").addClass("movie-card");
var scoresEl=$("<h3>").text("Scores:");


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
  console.log(movieSearchQuery);
  fetchOMDB(movieSearchQuery);

  // Clear the input field
  movieInput.val("");
}


popularButton.on("click",function(){
    // console.log("works");
    popularClicked = true;
    fetchPopular();
});

// queryResult is used to gather the current search result data from our set of queries
var queryResult = {
  cast: "",
  director: "",
  genre: "",
  imdbID: "",
  mpaaRating: "",
  reviews: { nyt: { author: "", snippet: "" } },
  runtime: 0,
  score: { imdb: 0, meta: 0, rotten: 0, tmdb: 0 },
  streamingServices: "",
  summary: "",
  title: ""
};



function fetchPopular(){
  //fetch for popular movies
  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
  .then(function(response){
    if (response.ok){
      //   console.log(response);
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
  console.log(movieSearchQuery);
  var omdbUrl = "https://www.omdbapi.com/?t="+ movieSearchQuery +"&plot=short&apikey=704a2c08"
  fetch(omdbUrl)
  .then(function(response){
    if (response.ok){
      //   console.log(response);
      return response.json().then(function(data){
        console.log("omdb");
        console.log(data);
        queryResult.imdbID = data.imdbID;
        queryResult.score.imdb = data.imdbRating;
        
        if(data.Ratings.length===2){
          queryResult.score.rotten = data.Ratings[1].Value;
          queryResult.score.meta = "not found";
        }
        else if(data.Ratings.length===1||data.Ratings.length===0){
          queryResult.score.rotten = "not found";
          queryResult.score.meta = "not found";
        }
        else{
          queryResult.score.rotten = data.Ratings[1].Value;
          queryResult.score.meta = data.Ratings[2].Value;
        }

        queryResult.genre = data.Genre;
        queryResult.mpaaRating = data.Rated;
        queryResult.cast = data.Actors;
        queryResult.director = data.Director;
        queryResult.runtime = data.Runtime;
        // console.log(data.imdbRating);
        // console.log(data.imdbID);
        // console.log(data.Ratings);
        fetchTMDB(movieSearchQuery);
      });
    }
  });
}


function fetchTMDB(movie){
  //fetches based on imdb id
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
        console.log("TMDB specific movie");
        console.log(data);
        queryResult.title = data.results[0].title;
        queryResult.score.tmdb = data.results[0].vote_average;
        queryResult.summary = data.results[0].overview;
        // console.log(data);
        // console.log(data.original_title);
        // console.log(data.vote_average);
        // console.log(data.poster_path);
        // console.log(data.runtime);

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
  //     if (response.ok){
  //         //   console.log(response);
  //             return response.json().then(function(data){
  //             console.log("nyt review")
  //             // console.log(data);
  //             // console.log(data.response);
  //             // console.log(data.response.docs[0]);
  //             // console.log(data.response.docs[0].lead_paragraph);
  //             // console.log(data.response.docs[0].snippet);
  //             // queryResult.reviews.nyt.snippet=data.response.docs[0].snippet;
  //             // queryResult.reviews.nyt.author=data.response.docs[0].byline.original;
  //             fetchServices(movie);
  //             })
  //         }
  //     })
  fetchServices(queryResult.title);
}


function fetchServices(movie){
  // sees if movie is streaming based on imdb id
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
  //     .then(function(response){
  //         if (response.ok){
  //     //   console.log(response);
  //         return response.json().then(function(data){
  //         // console.log("streaming service")
  //         // console.log(data.result)
  //         // console.log(data.result[0].streamingInfo)
  //         // queryResult.streamingServices = data.result[0].streamingInfo.us[0].service;
  //         })
  //     }
  // })

  appendCard();
}
function createElements(){
      // title and details
  titleEl=$("<h2>").text(queryResult.title);

  // var runtimeEl=$("<p>").text("Runtime: "+ queryResult.runtime+" minutes");
runtimeEl=$("<p>").text(`Runtime: ${queryResult.runtime} minutes`);
  // var mpaaRatingEl=$("<p>").text("Rated: "+queryResult.mpaaRating);
  mpaaRatingEl=$("<p>").text(`Rated: ${queryResult.mpaaRating}`);
  // var genreEl=$("<p>").text("Genre: "+ queryResult.genre);
  genreEl=$("<p>").text(`Genre: ${queryResult.genre}`);
  // var directorEl=$("<p>").text("Director: "+ queryResult.director);
  directorEl=$("<p>").text(`Director: ${queryResult.director}`);
  // var castEl=$("<p>").text("Cast: "+queryResult.cast);
  castEl=$("<p>").text(`Cast: ${queryResult.cast}`);
  summaryEl=$("<p>").text(queryResult.summary);


    scoresEl=$("<h3>").text("Scores:");

    // var imdbScoreEl=$("<p>").text("IMDB: "+ queryResult.score.imdb);
    imdbScoreEl=$("<p>").text(`IMDB Score: ${queryResult.score.imdb}`);
    // var rottenScoreEl=$("<p>").text("Rotten Tomatoes: "+queryResult.score.rotten);
    rottenScoreEl=$("<p>").text(`Rotten Tomatoes Score: ${queryResult.score.rotten}`);
    // var metaScoreEl=$("<p>").text("Meta Critic: "+queryResult.score.meta);
    metaScoreEl=$("<p>").text(`Meta Critic: ${queryResult.score.meta}`);
    // var tmdbScoreEl=$("<p>").text("User Score: "+queryResult.score.tmdb);
    tmdbScoreEl=$("<p>").text(`TMDB Score: ${queryResult.score.tmdb}`);

      // var nytSnippetEl=$("<p>").text("Review: "+queryResult.reviews.nyt.snippet);
    nytSnippetEl=$("<p>").text(`Review: ${queryResult.reviews.nyt.snippet}`);
    // var nytAuthorEl=$("<p>").text("Author: "+queryResult.reviews.nyt.author);
    nytAuthorEl=$("<p>").text(`Author: ${queryResult.reviews.nyt.author}`);
    // var streamingServicesEl=$("<p>").text("Streaming Services: " +queryResult.streamingServices);
    streamingServicesEl=$("<p>").text(`Streaming Services: ${queryResult.streamingServices}`);
}

function appendCard(){
  // console.log("works");
  // movieCards.text("");
    createElements();

    if(ratedBox[0].checked){
        titleEl.append(mpaaRatingEl);
      }
      if(runtimeBox[0].checked){
        titleEl.append(runtimeEl)
      }
      if(genreBox[0].checked){
        titleEl.append(genreEl);
      }
      if(directorBox[0].checked){
        titleEl.append(directorEl);
      }
      if(castBox[0].checked){
        titleEl.append(castEl);
      }
      if(summaryBox[0].checked){
        titleEl.append(summaryEl);
      }
      movieCard.append(titleEl);
      // titleEl.append(runtimeEl,ratedEl,genreEl,directorEl,castEl,summaryEl);
      if(scoresBox[0].checked){
        scoresEl.append(imdbScoreEl,rottenScoreEl,metaScoreEl,userScoreEl);
        movieCard.append(scoresEl);
      }
      if(nytReviewBox[0].checked){
        nytSnippetEl.append(nytAuthorEl);
        movieCard.append(nytSnippetEl);
      }
      if(servicesBox[0].checked){
        movieCard.append(servicesEl);
      }
    
      movieCards.prepend(movieCard);
//   titleEl.append(runtimeEl, mpaaRatingEl, genreEl, directorEl, castEl, summaryEl);
  // scores
//   scoresEl.append(imdbScoreEl, rottenScoreEl, metaScoreEl, tmdbScoreEl);
  // reviews
//   nytSnippetEl.append(nytAuthorEl);
//   movieCard.append(titleEl, scoresEl, nytSnippetEl);
//   movieCards.prepend(movieCard);

  
  if ( popularClicked && count < popularArr.length -1 ){
    count++;
    fetchOMDB(popularArr[count]);
  }
  // console.log("movie card");
  // console.log(movieCards);
}


