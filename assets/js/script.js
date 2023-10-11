

var movie="barbie";
var imdbID="tt11858890";
var title;
var runtime;
var rated;
var imdbScore;
var rottenScore;
var metaScore;
var userScore;
var director;
var cast;
var nytSnippet;
var nytAuthor
var services;
var summary;
var genre;

//fetch for popular movies
fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
.then(function(response){
    if (response.ok){
      //   console.log(response);
          return response.json().then(function(data){
          console.log("popular movies")
          console.log(data);
          console.log(data.results);
          for(var i=0;i<data.results.length;i++){
            movie=data.results[i].title;
            // console.log("test");
            // console.log(data.results[i]);
          }
          })
      }
    })

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
        console.log("specific movie")
        title=data.original_title;
        userScore=data.vote_average;
        runtime=data.runtime;
        summary=data.overview;
        console.log(data);
        console.log(data.original_title);
        console.log(data.vote_average);
        console.log(data.poster_path);
        console.log(data.runtime);
        })
    }
  })

    
    // fetches based on title
var omdbUrl = "https://www.omdbapi.com/?t="+ movie +"&plot=short&apikey=704a2c08"
fetch(omdbUrl)
.then(function(response){
    if (response.ok){
        //   console.log(response);
            return response.json().then(function(data){
            console.log("omdb")
            imdbID=data.imdbID;
            imdbScore=data.imdbRating;
            rottenScore=data.Ratings[1].Value;
            metaScore=data.Ratings[2].Value;
            genre=data.genre;
            rated=data.Rated;
            cast=data.Actors;
            director=data.Director;
            console.log(data);
            console.log(data.imdbRating);
            console.log(data.imdbID);
            console.log(data.Ratings);
            })
        }
    })

//fetch to nyt review of movie
reviewUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22&q="+movie+"&api-key=pf1jPMp9J2Gq6kH3AyhwAUUl2zEIlDBm";
fetch(reviewUrl)
.then(function(response){
    if (response.ok){
        //   console.log(response);
            return response.json().then(function(data){
            console.log("nyt review")
            console.log(data);
            console.log(data.response);
            console.log(data.response.docs[0]);
            console.log(data.response.docs[0].lead_paragraph);
            console.log(data.response.docs[0].snippet);
            nytSnippet=data.response.docs[0].snippet;
            nytAuthor=data.response.docs[0].byline.original;
            })
        }
    })


// sees if movie is streaming based on imdb id
const urlStreaming = 'https://streaming-availability.p.rapidapi.com/search/title?title='+movie+'&country=us&show_type=movie&output_language=en';
const options1={
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '325e143123msh6e7bf9effd3a82dp190444jsn2a9f8b54b6f6',
		'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
	}
};

fetch(urlStreaming,options1)
    .then(function(response){
        if (response.ok){
    //   console.log(response);
        return response.json().then(function(data){
        console.log("streaming service")
        console.log(data.result)
        console.log(data.result[0].streamingInfo)
        services=data.result[0].streamingInfo.us[0].service;
        })
    }
})