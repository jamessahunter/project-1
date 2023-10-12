
var movie;

// var wait=0; // NOT USED?
var popularClicked = false;
var count = 0;

var popularArr = [];

var searchButton = $(".btn");
var popularButton = $(".btn-popular");
var movieInput = $("#search");
var movieCards = $("#movie-cards");
var scoresBox = $("#scores");

searchButton.on("click", function(event){
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
  })


popularButton.on("click",function(){
    // console.log("works");
    popularClicked = true;
    fetchPopular();
})

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

            // console.log(movieTitle);
            // movieEl=$("<p>").text(movieTitle);
            // movieCards.prepend(movieEl);

            // console.log("test");
            // console.log(data.results[i]);
          }
          console.log(popularArr);
          fetchOMDB(popularArr[count]);
        //   loopWithFetch(popularArr);
          })
      }
    })
}


function fetchOMDB(movie){
    // fetches based on title
var omdbUrl = "https://www.omdbapi.com/?t="+ movie +"&plot=short&apikey=704a2c08"
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

            // console.log(data.imdbRating);
            // console.log(data.imdbID);
            // console.log(data.Ratings);
            fetchTMDB(queryResult.imdbID);
            })
        }
    });
}


function fetchTMDB(imdbID){
//fetches based on imdb id
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  };
  fetch('https://api.themoviedb.org/3/movie/'+ imdbID+'?language=en-US', options)
  .then(function(response){
  if (response.ok){
    //   console.log(response);
        return response.json().then(function(data){
        console.log("TMDB specific movie");
        queryResult.title = data.original_title;
        queryResult.score.tmdb = data.vote_average;
        queryResult.runtime = data.runtime;
        queryResult.summary = data.overview;
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


function appendCard(){
  // console.log("works");
  // movieCards.text("");

  // title and details
  var titleEl=$("<h2>").text(queryResult.title);

  // var runtimeEl=$("<p>").text("Runtime: "+ queryResult.runtime+" minutes");
  var runtimeEl=$("<p>").text(`Runtime: ${queryResult.runtime} minutes`);
  // var mpaaRatingEl=$("<p>").text("Rated: "+queryResult.mpaaRating);
  var mpaaRatingEl=$("<p>").text(`Rated: ${queryResult.mpaaRating}`);
  // var genreEl=$("<p>").text("Genre: "+ queryResult.genre);
  var genreEl=$("<p>").text(`Genre: ${queryResult.genre}`);
  // var directorEl=$("<p>").text("Director: "+ queryResult.director);
  var directorEl=$("<p>").text(`Director: ${queryResult.director}`);
  // var castEl=$("<p>").text("Cast: "+queryResult.cast);
  var castEl=$("<p>").text(`Cast: ${queryResult.cast}`);
  var summaryEl=$("<p>").text(queryResult.summary);

  titleEl.append(runtimeEl, mpaaRatingEl, genreEl, directorEl, castEl, summaryEl);


  // scores
  var scoresEl=$("<h3>").text("Scores:");

  // var imdbScoreEl=$("<p>").text("IMDB: "+ queryResult.score.imdb);
  var imdbScoreEl=$("<p>").text(`IMDB Score: ${queryResult.score.imdb}`);
  // var rottenScoreEl=$("<p>").text("Rotten Tomatoes: "+queryResult.score.rotten);
  var rottenScoreEl=$("<p>").text(`Rotten Tomatoes Score: ${queryResult.score.rotten}`);
  // var metaScoreEl=$("<p>").text("Meta Critic: "+queryResult.score.meta);
  var metaScoreEl=$("<p>").text(`Meta Critic: ${queryResult.score.meta}`);
  // var tmdbScoreEl=$("<p>").text("User Score: "+queryResult.score.tmdb);
  var tmdbScoreEl=$("<p>").text(`TMDB Score: ${queryResult.score.tmdb}`);

  scoresEl.append(imdbScoreEl, rottenScoreEl, metaScoreEl, tmdbScoreEl);


  // reviews

  // var nytSnippetEl=$("<p>").text("Review: "+queryResult.reviews.nyt.snippet);
  var nytSnippetEl=$("<p>").text(`Review: ${queryResult.reviews.nyt.snippet}`);
  // var nytAuthorEl=$("<p>").text("Author: "+queryResult.reviews.nyt.author);
  var nytAuthorEl=$("<p>").text(`Author: ${queryResult.reviews.nyt.author}`);
  // var streamingServicesEl=$("<p>").text("Streaming Services: " +queryResult.streamingServices);
  var streamingServicesEl=$("<p>").text(`Streaming Services: ${queryResult.streamingServices}`);

  nytSnippetEl.append(nytAuthorEl);


  // movie card
  var movieCard=$("<section>").addClass("movie-card");
  movieCard.append(titleEl, scoresEl, nytSnippetEl);

  movieCards.prepend(movieCard);

  
  if ( popularClicked && count < popularArr.length ){
    count++;
    fetchOMDB(popularArr[count]);
  }
  // console.log("movie card");
  // console.log(movieCards);
}


