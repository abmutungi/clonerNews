const handleStories = () => {
  fetch("https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty")
    .then((showStoriesData) => showStoriesData.json())
    .then((sData) => [...sData].sort((a, b) => a > b ? -1 : 1))
    .then((sortedData) => sortedData.slice(0, 10))
    .then(slicedData => console.log(slicedData));
};
