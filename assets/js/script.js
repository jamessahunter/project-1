
// don't need -- putting all these into object variable queryResult
// var movie;
// var imdbID;
// var title;
// var runtime;
// var rated;
// var imdbScore;
// var rottenScore;
// var metaScore;
// var tmdbScore;
// var director;
// var cast;
// var nytSnippet;
// var nytAuthor
// var services;
// var summary;
// var genre;

var wait=0;
var popularClicked=0;
var count=0;

var popularArr=[];

var searchButton=$(".btn");
var popularButton=$(".btn-popular");
var movieInput=$("#search");
var movieCards=$("#movie-cards");
var scoresBox=$("#scores");

searchButton.on("click",function(event){
    event.preventDefault();
    popularClicked=0;
    if(movieInput.val()=== ""){
      //modal here
      return;
    }
    // console.log(scoresBox[0].checked);
    console.log(movieInput.val());
    movie=movieInput.val();
    fetchOMDB(movie)
  })


popularButton.on("click",function(){
    // console.log("works");
    popularClicked=1;
    fetchPopular();
})

// queryResult is used to gather the current search result data from our set of queries
var queryResult = {
  cast: "",
  director: "",
  genre: ""
  rating: "",
  review: { nyt: { author: "", snippet: "" } },
  runtime: 0,
  score: { imdb: 0, rotten: 0, tmdb: 0 },
  streaming: "",
  summary: "",
  title: "",
};



function appendCard(){
  // console.log("works");
  // movieCards.text("");
  var movieCard=$("<section>").addClass("movie-card");
  var scoresEl=$("<h3>").text("Scores:");
  titleEl=$("<h2>").text(title);
  runtimeEl=$("<p>").text("Runtime: "+ runtime+" minutes");
  ratedEl=$("<p>").text("Rated: "+rated);
  imdbScoreEl=$("<p>").text("IMDB: "+ imdbScore);
  rottenScoreEl=$("<p>").text("Rotten Tomatoes: "+rottenScore);
  metaScoreEl=$("<p>").text("Meta Critic: "+metaScore);
  tmdbScoreEl=$("<p>").text("User Score: "+tmdbScore);
  directorEl=$("<p>").text("Director: "+ director);
  castEl=$("<p>").text("Cast: "+cast);
  nytSnippetEl=$("<p>").text("Review: "+nytSnippet);
  nytAuthorEl=$("<p>").text("Author: "+nytAuthor);
  servicesEl=$("<p>").text("services: " +services);
  summaryEl=$("<p>").text(summary);
  genreEl=$("<p>").text("Genre: "+ genre);
  titleEl.append(runtimeEl,ratedEl,genreEl,directorEl,castEl,summaryEl);
  scoresEl.append(imdbScoreEl,rottenScoreEl,metaScoreEl,tmdbScoreEl);
  nytSnippetEl.append(nytAuthorEl);
  movieCard.append(titleEl,scoresEl,nytSnippetEl);
  movieCards.prepend(movieCard);
  
  if (popularClicked&&count<popularArr.length){
      count++
  fetchOMDB(popularArr[count])
  }
  // console.log("movie card")
  // console.log(movieCards);
}


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
            movie=data.results[i].title;
            // fetchOMDB(movie);

            // console.log(movie);
            // movieEl=$("<p>").text(movie);
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
        console.log("TMDB specific movie")
        queryResult.title = data.original_title;
        queryResult.score.tmdb = data.vote_average;
        queryResult.runtime = data.runtime;
        queryResult.summary = data.overview;
        // console.log(data);
        // console.log(data.original_title);
        // console.log(data.vote_average);
        // console.log(data.poster_path);
        // console.log(data.runtime);
            fetchNYTReview(movie);
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
            console.log("omdb")
            console.log(data);
            imdbID=data.imdbID;
            imdbScore=data.imdbRating;
            if(data.Ratings.length===2){
                rottenScore=data.Ratings[1].Value;
                metaScore="not found";
              }
              else if(data.Ratings.length===1||data.Ratings.length===0){
                rottenScore="not found";
                metaScore="not found";
              }
              else{
                rottenScore=data.Ratings[1].Value;
                metaScore=data.Ratings[2].Value;
              }
            genre=data.Genre;
            rated=data.Rated;
            cast=data.Actors;
            director=data.Director;

            // console.log(data.imdbRating);
            // console.log(data.imdbID);
            // console.log(data.Ratings);
            fetchTMDB(imdbID);
            })
        }
    })
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
  //             nytSnippet=data.response.docs[0].snippet;
  //             nytAuthor=data.response.docs[0].byline.original;
  //             fetchServices(movie);
  //             })
  //         }
  //     })
  fetchServices(movie);
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
  //         services=data.result[0].streamingInfo.us[0].service;
  //         })
  //     }
  // })
  appendCard();
}