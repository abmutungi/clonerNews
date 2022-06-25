const handleStories = (e) => {
    console.log(e.innerText);
    const getStoriesData = async () => {
        const showStoriesData = await fetch(
            e.innerText === 'Stories'
                ? 'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty'
                : 'https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty'
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

// const handlePolls = () => {
//     const getPollsData = async () => {
//         const showPollsData = await fetch(
//             'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
//         );
//         const pData = await showPollsData.json();
//         const sortedData = [...pData].sort((a, b) => (a > b ? -1 : 1));
//         //const slicedData = sortedData.slice(0, 10);
//         const showPolls = await Promise.all([
//             ...sortedData.map((pollId) =>
//                 fetch(
//                     `https://hacker-news.firebaseio.com/v0/item/${pollId}.json?print=pretty`
//                 ).then((showPoll) => showPoll.json())
//             ),
//         ]);
//         return showPolls;
//     };
//     getPollsData().then((showPolls) => {
//         console.log(showPolls.map((poll) => poll.type));
//     });
// };
//start from the max level going backwards and skip the decendants, fetch 1000 at a time while counting the number of pool
// if the number of pool is less than fetch another 1000
const getPoll = ([[id, startId, maxId], count]) => {
    let newId = id;
    let newStartId = startId;
    let newCount = count;
    //console.log("hello", id);
    console.log(id, startId);
    return fetch(
        `https://hacker-news.firebaseio.com/v0/item/${newId}.json?print=pretty`
    )
        .then((data) => data.json())
        .then((data) => {
            let fetchNewId;
            let fetchNewCount;
            if (data.type === 'poll') {
                console.log(data, data.type === 'poll');
                //newCount += 1;
                fetchNewCount = newCount + 1;
            }
            if (data.type !== 'poll') {
                fetchNewCount = newCount;
                // console.log('des', data.type);
                // if (data.type === 'story') {
                //     console.log(data);
                // }
                if (data.descendants) {
                    console.log('descen', data.descendants);
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
            return [[fetchNewId, fetchNewStartId, maxId], fetchNewCount];
        });
};
const handlePolls = () => {
    const magicLoop = (magicData) => {
        let [getPollData, count] = magicData ? magicData : [[], 0];
        let newCount = count;
        if (newCount === 10) {
            return;
        }
        console.log(newCount);
        if (magicData !== undefined) {
            let newMagicData = magicData;
            getPoll(newMagicData).then((magicData) => {
                console.log(magicData, getPollData);
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
                console.log('then1');
                let startId = maxId - 1000;
                let id = startId;
                //let polls = [];
                return getPoll([[id, startId, maxId], newCount])
                    .then((getPollData) => {
                        console.log('then2');
                        return getPollData;
                    })
                    .then((magicData) => {
                        console.log(magicData);
                        magicLoop(magicData);
                    });
            });
        return;
    };

    magicLoop();
};
// console.log(maxId, typeof maxId);
// let startId = maxId - 1000;
// let id = startId;
// let polls = [];
// const getPoll = () => {
//     console.log('hello', id);
//     while (id) {
//         console.log('hello', id);
//         fetch(
//             `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
//         )
//             .then((data) => data.json())
//             .then((data) => {
//                 // console.log(data);
//                 if (data.type === 'poll') {
//                     console.log(data, data.type === 'poll');
//                 }
//                 // console.log('1');
//                 if (data.type !== 'poll') {
//                     if (data.descendants) {
//                         console.log(data.descendants);
//                         id += data.descendants;
//                     }
//                 }
//                 id += 1;
//             });
//         if (id === startId + 1000) {
//             startId = startId - 1000;
//             break;
//         }
//     }
// };
// getPoll();
// if (pool.length === 10) {
// }
