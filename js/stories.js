"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  }

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  
  const loggedIn = currentUser ? true : false;

  let starIcon = '';
  let favClass = '';

  if (loggedIn) {
    starIcon = currentUser.isFavorite(story) ? '&starf;' : '&star;';
    favClass = currentUser.isFavorite(story) ? 'fav' : '';
  }


  return $(`
      <li id="${story.storyId}">
      <span class="starBtn ${favClass}" data-storyid="${story.storyId}">${starIcon}</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$('#submit-form').on('submit',submitStory);



async function submitStory(evt) {
  evt.preventDefault();
  const title = document.querySelector('#submit-title').value; 
  const author = document.querySelector('#submit-author').value; 
  const url = document.querySelector('#submit-url').value; 
  const storyObj = {title, url, author};
  const story = await storyList.addStory(currentUser, storyObj);
  currentUser.ownStories.push(story);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click','span.starBtn', updateFavorites);

async function updateFavorites(evt) {
  const storyId = evt.target.dataset.storyid;

  const findStory = storyList.stories.find(story => story.storyId === storyId);

  if (evt.target.classList.contains('fav')) {
    await currentUser.unFavorite(findStory);
    evt.target.classList.toggle('fav');
    evt.target.innerHTML = '&star;';
  } else {
    await currentUser.favorite(findStory);
    evt.target.classList.toggle('fav');
    evt.target.innerHTML = '&starf;';
  }

}

