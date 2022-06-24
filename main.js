const handleStories = (e) => {
  console.log(e.innerText);
  const getStoriesData = async () => {
    const showStoriesData = await fetch(
      e.innerText === "Stories"
        ? "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty"
        : "https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty"
    );
    const sData = await showStoriesData.json();
    const sortedData = [...sData].sort((a, b) => (a > b ? -1 : 1));
    const slicedData = sortedData.slice(0, 10);
    const showStories = await Promise.all([
      ...slicedData.map((storyId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
        ).then((showStory) => showStory.json())
      ),
    ]);
    return showStories;
  };
  getStoriesData().then((showStories) => {
    console.log(showStories);
  });
};

const handlePolls = () => {
  const getPollsData = async () => {
    const showPollsData = await fetch(
      "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
    );
    const pData = await showPollsData.json();
    const sortedData = [...pData].sort((a, b) => (a > b ? -1 : 1));
    //const slicedData = sortedData.slice(0, 10);
    const showPolls = await Promise.all([
      ...sortedData.map((pollId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${pollId}.json?print=pretty`
        ).then((showPoll) => showPoll.json())
      ),
    ]);
    return showPolls;
  };
  getPollsData().then((showPolls) => {
    console.log(showPolls.map((poll) => poll.type));
  });
};
