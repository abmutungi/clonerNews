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

//start from the max level going backwards and skip the decendants, fetch 1000 at a time while counting the number of pool
// if the number of pool is less than fetch another 1000
const getPoll = ([[id, startId, maxId], count, polls]) => {
  let newId = id;
  let newStartId = startId;
  let newCount = count;
  let newPolls = polls ? polls : [];
  return fetch(
    `https://hacker-news.firebaseio.com/v0/item/${newId}.json?print=pretty`
  )
    .then((data) => data.json())
    .then((data) => {
      let fetchNewId;
      let fetchNewCount;
      let fetchNewPolls = polls ? [...polls] : [];
      if (data.type === "poll") {
        console.log(data, data.type === "poll");
        fetchNewPolls.push(data);
        fetchNewCount = newCount + 1;
      }
      if (data.type !== "poll") {
        fetchNewCount = newCount;
        if (data.descendants) {
          fetchNewId = newId + data.descendants;
        }
      }
      fetchNewId = fetchNewId ? fetchNewId + 1 : newId + 1;
      let fetchNewStartId;
      if (fetchNewId === newStartId + 1000) {
        fetchNewStartId = newStartId - 1000;
        fetchNewId = fetchNewStartId;
      } else {
        fetchNewStartId = newStartId;
      }
      return [[fetchNewId, fetchNewStartId, maxId], fetchNewCount, fetchNewPolls];
    });
};
const handlePolls = () => {
  const magicLoop = (magicData) => {
    let [getPollData, count, polls] = magicData ? magicData : [[], 0, []];
    let newCount = count;
    if (newCount === 10) {
      return;
    }
    if (magicData !== undefined) {
      let newMagicData = magicData;
      getPoll(newMagicData).then((magicData) => {
        magicLoop(magicData);
      });
      return;
    }
    fetch(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`)
      .then((max) => max.json())
      .then((max) => {
        maxId = max;
        return max;
      })
      .then((maxId) => {
        let startId = maxId - 1000;
        let id = startId;
        let newPolls = polls;
        return getPoll([[id, startId, maxId], newCount, newPolls])
          .then((getPollData) => {
            return getPollData;
          })
          .then((magicData) => {
            magicLoop(magicData);
          });
      });
    return;
  };

  magicLoop();
};
