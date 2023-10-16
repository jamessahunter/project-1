# What to Watch

## Description 

[Supportive Gif of your App doing it]

What to Watch is a web application to search for movies and only display the specific result information the user is iterested in. 


Your GitHub profile is an extremely important aspect of your public identity as a developer. A well-crafted one allows you to show off your work to other developers as well as potential employers. An important component of your GitHub profile—and one that many new developers often overlook—is the README.md file.

The quality of a README often differentiates a good project from a bad project. A good one takes advantage of the opportunity to explain and showcase what your application does, justify the technologies used, and even talk about some of the challenges you faced and features you hope to implement in the future. A good README helps you stand out among the large crowd of developers putting their work on GitHub.

There's no one right way to structure a good README. There is one very wrong way, however, and that is to not include a README at all or to create a very anemic one. This guide outlines a few best practices. As you progress in your career, you will develop your own ideas about what makes a good README.

At a minimum, your project README needs a title and a short description explaining the what, why, and how. What was your motivation? Why did you build this project? (Note: The answer is not "Because it was a homework assignment.") What problem does it solve? What did you learn? What makes your project stand out? 



We deployed the application on [GitHub](https://github.com/) [Pages](https://pages.github.com/), and it can be found [here](https://jamessahunter.github.io/What-to-watch/).



If you're new to Markdown, read the GitHub guide on [Mastering Markdown](https://guides.github.com/features/mastering-markdown/).

If you need an example of a good README, check out [the VSCode repository](https://github.com/microsoft/vscode).


## Table of Contents (Optional)

If your README is very long, add a table of contents to make it easy for users to find what they need.

* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)


## Technologies Used



## User Stories

![Supportive Gif of that feature](assets/images/screenshot.png)
![Supportive Gif of that feature](assets/images/screenshot.png)
![Supportive Gif of that feature](assets/images/screenshot.png)

```javascript
// Any relevant code snippets
```

## User Stories Related to API Calls



## Description of CSS Framework Tailwind



## Learning Objectives



## Authors / Contact





## Usage 

On page load, the user is presented in the left column with a search input field and **Search** button, a **Popular movies** button, a set of *Features* checkboxes labeled with movie information categories, and a *Genres* drop down. There are four additional buttons at the bottom: **Save Config**, **Clear Config**, **Clear Search History**, and **Clear Unpinned Movies**.

Upon searching for a movie title using the search field, the designated film is presented in a movie card on the right column. The search query is also added to the *Search History* carousel at the top of the right column. Additional searches will continue to populate the right colum with additional movie cards.

Changing checkbox selections will alter the information displayed on the movie cards. For example, unchecking the *Poster* checkbox will remove the movie poster image from the collection of movie cards. The user can save the current checkbox selection to local storage by clicking the **Save Config** button, while the **Clear Config** button will reset the checkboxes to a state of "all on".

If desired, the searh history carousel can be cleared by clicking the **Clear Search History** button.

The user can click on individual movie cards to pin them to the page. A pinned card is designated by a blue border. The set of pinned movie cards is also saved to local storage and will be generated again when the page is reloaded or revisited from the same browser, together with the search history carousel and any saved checkbox configuration.

At any time, the user can click the **Clear Unpinned Movies** button, and any unpinned movie card will be removed. If a previously searched for movie was removed, the user can recover that title by clicking on the query term in the search history carousel.

Finally, clicking on the **Popular movies** button will present the user with movie cards for the current top 20 movies from [TMDB](https://www.themoviedb.org/?language=en-US). If the




To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

```md
![alt text](assets/images/screenshot.png)
```


## Credits

James Hunter: [github.com/jamessahunter](https://github.com/jamessahunter)
Fiqre Tezare: [github.com/Fiqre-Ab](https://github.com/Fiqre-Ab)
David Wright: [github.com/d-a-v-i-d-w-r-i-g-h-t](https://github.com/d-a-v-i-d-w-r-i-g-h-t)



If you used any third-party assets that require attribution, list the creators with links to their primary web presence in this section.

If you followed tutorials, include links to those here as well.


## License

MIT License

Copyright (c) 2023 James Hunter, David Wright, Fiqre Tezare

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---
