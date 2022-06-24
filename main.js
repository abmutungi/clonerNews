const handleStories = () => {
  fetch("https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty")
    .then((showStoriesData) => showStoriesData.json())
    .then((sData) => {
      console.log(sData,  typeof sData[1]);
      
      const sortedData = [...sData].sort((a, b) => a > b ? -1 : 1)
      console.log(sortedData);
      return sortedData;
    })
    .then((sordedData) => {
      console.log(sordedData);
    });
};
