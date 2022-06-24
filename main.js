const handleStories = () => {
  fetch("https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty")
    .then((showStoriesData) => showStoriesData.json())
    .then((sData) => {
      console.log(sData);
    });
};
