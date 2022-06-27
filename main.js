
const timeConverter = (UNIX_timestamp) => {
    let a = new Date(UNIX_timestamp * 1000);
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate() < 10 ? `0${a.getDate()}` : a.getDate();
    let hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    let min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : a.getMinutes();
    let sec = a.getSeconds() < 10 ? `0${a.getSeconds()}` : a.getSeconds();
    let time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
    return time;
};
const throttle = (func, wait) => {
    let isWaiting = false;
    return (...args) => {
        if (isWaiting) return;
        func(...args);
        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
        }, wait);
    };
};
const displayComments = (kid) => {
    if (kid.dead === true || kid.deleted === true) {
        return;
    }
    const parent = document.getElementById(kid.parent);
    const commentDiv = document.createElement('div');
    const commentContent = document.createElement('div');
    const commentAuthor = document.createElement('div');
    if (kid.text) {
        commentContent.innerHTML = kid.text;
        commentContent.className = 'content-class';
    }
    commentDiv.id = kid.id;
    commentDiv.className = 'story-div-class';
    commentAuthor.innerHTML = `<span><b>@${kid.by}</b> ${timeConverter(
        kid.time
    )}</span>`;
    commentDiv.append(commentAuthor);
    commentDiv.append(commentContent);
    if (kid.kids) {
        const commentBtn = document.createElement('button');
        kid.kids.length === 1
            ? (commentBtn.textContent = `${kid.kids.length} Comment`)
            : (commentBtn.textContent = `${kid.kids.length} Comments`);

        commentBtn.className = 'btn';
        commentDiv.append(commentBtn);
        commentBtn.addEventListener(
            'click',
            () => {
                handleComments(kid.kids);
            },
            { once: true }
        );
    }
    if (parent) parent.append(commentDiv);
    if (!parent) {
        const container = document.querySelector('.main-container-class');
        container.append(commentDiv);
    }
};
const handleComments = (commentIds) => {
    const getCommentsData = async (commentIds) => {
        const sortedData = [...commentIds].sort((a, b) => (a > b ? -1 : 1));
        const showComments = await Promise.all([
            ...sortedData.map((commentId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`
                ).then((showComment) => showComment.json())
            ),
        ]);
        return showComments;
    };
    getCommentsData(commentIds).then((showComments) => {
        showComments.forEach((comment) => {
            displayComments(comment);
        });
    });
};
const displayData = (story, index) => {
    if (story.dead === true || story.deleted === true) {
        return;
    }

    const container = document.querySelector('.main-container-class');
    const storyDiv = document.createElement('div');
    const storyLink = document.createElement('a');
    const storyHead = document.createElement('h3');
    const storyContent = document.createElement('div');
    const storyAuthor = document.createElement('div');
    const storyComment = document.createElement('button');
    if (story.url) {
        storyLink.href = story.url;
    }
    if (story.text) {
        storyContent.innerHTML = story.text;
        storyContent.className = 'content-class';
    }
    storyAuthor.innerHTML = `<span><b>@${story.by}</b> ${timeConverter(
        story.time
    )}</span>`;
    storyDiv.setAttribute('data-type', `${story.type}`);
    storyDiv.id = story.id;
    storyDiv.className = 'story-div-class';
    if (index >= 10) storyDiv.classList.add('hide');
    storyHead.textContent = story.title;
    storyLink.append(storyHead);
    storyDiv.append(storyLink);
    storyDiv.append(storyAuthor);
    storyDiv.append(storyContent);
    if (story.kids) {
        story.kids.length === 1
            ? (storyComment.textContent = `${story.kids.length} Comment`)
            : (storyComment.textContent = `${story.kids.length} Comments`);

        storyDiv.append(storyComment);
        storyComment.className = 'btn';
        storyComment.addEventListener(
            'click',
            (e) => {
                handleComments(story.kids);
            },
            { once: true }
        );
    }
    container.append(storyDiv);
};
const handleStories = (e) => {
    console.log(e);
    let notIncluded = document.querySelectorAll(`.main-container-class div`);
    notIncluded.forEach((element) => {
        element.remove();
    });
    const getStoriesData = async () => {
        const showStoriesData = await fetch(
            e.innerText === 'Stories'
                ? 'https://hacker-news.firebaseio.com//v0/showstories.json?print=pretty'
                : 'https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty'
        );
        const sData = await showStoriesData.json();
        const sortedData = [...sData].sort((a, b) => (a > b ? -1 : 1));
        // const slicedData = sortedData.slice(0, 10);
        const showStories = await Promise.all([
            ...sortedData.map((storyId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
                ).then((showStory) => showStory.json())
            ),
        ]);
        return showStories;
    };
    getStoriesData().then((showStories) => {
        showStories.forEach((story, index) => {
            console.log(story);
            displayData(story, index);
        });
    });
};
const displayPollOption = (option) => {
    if (option.dead === true || option.deleted === true) {
        return;
    }
    const parent = document.getElementById(option.poll);
    console.log(parent);
    const optionDiv = document.createElement('div');
    const optionContent = document.createElement('div');
    optionContent.innerHTML = option.text;
    optionContent.className = 'content-class';
    optionDiv.id = option.id;
    optionDiv.className = 'poll-divclass';
    optionDiv.append(optionContent);
    parent.append(optionDiv);
};
const handlePollOption = (pollOptions) => {
    const getPollsOption = async (pollOptions) => {
        console.log(pollOptions);
        const showPollsOption = await Promise.all([
            ...pollOptions.map((newPollOptId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${newPollOptId}.json?print=pretty`
                ).then((showItem) => showItem.json())
            ),
        ]);
        return showPollsOption;
    };
    getPollsOption(pollOptions).then((options) => {
        options.map((option) => {
            displayPollOption(option);
        });
    });
};
const displayPoll = (poll, index) => {
    if (poll.dead === true || poll.deleted === true) {
        return;
    }
    const container = document.querySelector('.main-container-class');
    const pollDiv = document.createElement('div');
    const pollLink = document.createElement('a');
    const pollHead = document.createElement('h3');
    const pollContent = document.createElement('div');
    const pollAuthor = document.createElement('div');
    const pollComment = document.createElement('button');
    if (poll.url) {
        pollLink.href = poll.url;
    }
    if (poll.text) {
        pollContent.innerHTML = poll.text;
        pollContent.className = 'content-class';
        pollDiv.append(pollContent);
    }
    handlePollOption(poll.parts);
    pollAuthor.innerHTML = `<span><b>@${poll.by}</b> ${timeConverter(
        poll.time
    )}</span>`;
    pollDiv.setAttribute('data-type', `${poll.type}`);
    pollDiv.id = poll.id;
    pollDiv.className = 'story-div-class';
    if (index >= 10) pollDiv.classList.add('hide');
    pollHead.textContent = poll.title;
    pollLink.append(pollHead);
    pollDiv.append(pollLink);
    pollDiv.append(pollAuthor);
    if (poll.kids) {
        poll.kids.length === 1
            ? (pollComment.textContent = `${poll.kids.length} Comment`)
            : (pollComment.textContent = `${poll.kids.length} Comments`);
        pollDiv.append(pollComment);
        pollComment.className = 'btn';
        pollComment.addEventListener(
            'click',
            (e) => {
                handleComments(poll.kids);
            },
            { once: true }
        );
    }
    container.append(pollDiv);
};
const handlePolls = () => {
    let notIncluded = document.querySelectorAll(`.main-container-class div`);
    notIncluded.forEach((element) => {
        element.remove();
    });
    const polls = [31869104, 31788898, 31780911, 31716715, 31598236, 31587976];
    const getPollsData = async (polls) => {
        const showPolls = await Promise.all([
            ...polls.map((newPollId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${newPollId}.json?print=pretty`
                ).then((showItem) => showItem.json())
            ),
        ]);
        return showPolls;
    };
    getPollsData(polls).then((newPolls) => {
        newPolls.forEach((poll) => {
            displayPoll(poll);
        });
    });
    // getItemsData(newItems).then((showItems) => {
    //     showItems.forEach((newItem) => {
    //         if (newItem.type === 'comment') {
    //             displayComments(newItem);
    //         } else if (newItem.type === 'story' || newItem.type === 'job') {
    //             displayData(newItem);
    //         } else {
    //             console.log(newItem);
    //         }
    //     });
    // });
};
//start from the max level going backwards and skip the decendants, fetch 1000 at a time while counting the number of pool
// if the number of pool is less than fetch another 1000
// const getPoll = ([[id, startId, maxId], count, polls]) => {
//     let newId = id;
//     let newStartId = startId;
//     let newCount = count;
//     let newPolls = polls ? polls : [];

//     if (newPolls.length) console.log(newPolls);
//     return fetch(
//         `https://hacker-news.firebaseio.com/v0/item/${newId}.json?print=pretty`
//     )
//         .then((data) => data.json())
//         .then((data) => {
//             let fetchNewId;
//             let fetchNewCount;
//             let fetchNewPolls = newPolls ? [...newPolls] : [];
//             if (data.type && data.type === 'poll') {
//                 console.log(data, data.type === 'poll');
//                 fetchNewPolls.push(data);
//                 console.log(fetchNewPolls);
//                 fetchNewCount = newCount + 1;
//             } else {
//                 fetchNewCount = newCount;
//                 if (data.descendants) {
//                     fetchNewId = newId + data.descendants;
//                 }
//             }
//             fetchNewId = fetchNewId ? fetchNewId + 1 : newId + 1;
//             let fetchNewStartId;
//             if (fetchNewId === newStartId + 1000) {
//                 fetchNewStartId = newStartId - 1000;
//                 fetchNewId = fetchNewStartId;
//             } else {
//                 fetchNewStartId = newStartId;
//             }
//             return [
//                 [fetchNewId, fetchNewStartId, maxId],
//                 fetchNewCount,
//                 fetchNewPolls,
//             ];
//         });
// };
// const handlePolls = () => {
//     const magicLoop = (magicData) => {
//         let [getPollData, count, polls] = magicData ? magicData : [[], 0, []];
//         let newCount = count;
//         if (newCount === 10) {
//             return;
//         }
//         if (magicData !== undefined) {
//             let newMagicData = magicData;
//             getPoll(newMagicData).then((magicData) => {
//                 magicLoop(magicData);
//             });
//             return;
//         }
//         fetch(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`)
//             .then((max) => max.json())
//             .then((max) => {
//                 maxId = max;
//                 return max;
//             })
//             .then((maxId) => {
//                 let startId = maxId - 1000;
//                 let id = startId;
//                 let newPolls = polls;
//                 return getPoll([[id, startId, maxId], newCount, newPolls])
//                     .then((getPollData) => {
//                         return getPollData;
//                     })
//                     .then((magicData) => {
//                         magicLoop(magicData);
//                     });
//             });
//         return;
//     };
//     magicLoop();
// };
const handleMore = () => {
    const stories = [...document.querySelectorAll('.story-div-class')];
    stories.some((story, i, arr) => {
        if (
            !story.classList.contains('hide') &&
            arr[i + 1].classList.contains('hide')
        ) {
            for (let j = i + 1; j <= i + 10 && arr[j] !== undefined; j++) {
                arr[j].classList.remove('hide');
                if (arr[j + 1] === undefined)
                    document.querySelector('.show-more').classList.add('hide');
            }
            return true;
        }
        return false;
    });
};

let inMaxId;
let currMaxId;
const fetchMaxId = () => {
    fetch(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`)
        .then((max) => max.json())
        .then((inMax) => {
            if (inMaxId === undefined) {
                inMaxId = inMax;
            } else {
                currMaxId = inMax;
            }
            if (inMaxId && currMaxId && inMaxId !== currMaxId) {
                let newId = document.querySelector('.new');
                newId.style.background = '#f73458';
            }
            setTimeout(throttle(fetchMaxId, 5000), 5000);
        });
};
const handleNew = () => {
    let notIncluded = document.querySelectorAll(`.main-container-class div`);
    notIncluded.forEach((element) => {
        element.remove();
    });
    let newItems = [];
    for (let i = inMaxId; i <= currMaxId; i++) {
        newItems.unshift(i);
    }
    const getItemsData = async (newItems) => {
        const showItems = await Promise.all([
            ...newItems.map((newItemId) =>
                fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${newItemId}.json?print=pretty`
                ).then((showItem) => showItem.json())
            ),
        ]);
        return showItems;
    };
    getItemsData(newItems).then((showItems) => {
        showItems.forEach((newItem) => {
            // if (newItem.type === 'comment') {
            //     displayComments(newItem);
            // } else
            if (
                !newItem.type ||
                newItem.dead === true ||
                newItem.deleted === true
            ) {
                return;
            }
            if (newItem.type === 'story' || newItem.type === 'job') {
                displayData(newItem);
            } else if (newItem.type === 'poll') {
                displayPoll(newItem);
            } else if (newItem.type === 'comment') {
                displayComments(newItem);
            } else {
                console.log(newItem);
            }
        });
    });
    inMaxId = currMaxId;
    let newId = document.querySelector('.new');
    newId.style.background = 'buttonface';
};

const storiesBtn = document.querySelector('.stories');
const jobsBtn = document.querySelector('.jobs');
const pollsBtn = document.querySelector('.polls');
storiesBtn.addEventListener("click", throttle(handleStories, 5000));
jobsBtn.addEventListener("click", throttle(handleStories, 5000));
pollsBtn.addEventListener("click", throttle(handlePolls, 5000));