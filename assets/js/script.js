



//fetch for popular movies
fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=c1d1230036e0337907fcb53ffae91703')
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

//fetches based on imdb id
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWQxMjMwMDM2ZTAzMzc5MDdmY2I1M2ZmYWU5MTcwMyIsInN1YiI6IjY1MjMwZGRiNzQ1MDdkMDExYzEyODM2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O5EWPbqvxAEJyHaV2DsyabODm4vtfg8Bh8V_ZZUkO8M'
    }
  };
  fetch('https://api.themoviedb.org/3/movie/tt0096895?language=en-US', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));


    
    // fetches based on title
var omdbUrl = "https://www.omdbapi.com/?t=batman&plot=short&apikey=704a2c08"
fetch(omdbUrl)
.then(function(response){
    console.log(response);
    return response.json();
}).then(function(data){
    console.log(data);
})
//fetch to nyt review of movie
var movie="first man 2018"

reviewUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name%3A%22Movies%22%20AND%20type_of_material%3A%22Review%22&q="+movie+"&api-key=pf1jPMp9J2Gq6kH3AyhwAUUl2zEIlDBm";
fetch(reviewUrl)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));

// sees if movie is streaming based on imdb id
const urlStreaming = 'https://streaming-availability.p.rapidapi.com/get?output_language=en&&imdb_id=tt0120338';
const options1={
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '325e143123msh6e7bf9effd3a82dp190444jsn2a9f8b54b6f6',
		'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
	}
};

fetch(urlStreaming,options1)
.then(function(response){
  console.log(response);
  return response.json();
}).then(function(data){
  console.log(data);
})