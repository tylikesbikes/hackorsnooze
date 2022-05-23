"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $loginForm.hide();
  $signupForm.hide();
  getAndShowStoriesOnStart(); 
}

//when  a user clicks on 'submit story link...
function navSubmitStory(evt) {
  console.debug("navSubmitStory", evt);

  hidePageComponents();
  $submitForm.show();
  
}

$body.on("click", "#nav-submit", navSubmitStory);


//when a user clicks on Favorites link
function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);


function generateFavoritesMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="starBtn ${currentUser.isFavorite(story) ? 'fav' : ''}" data-storyid="${story.storyId}">${currentUser.isFavorite(story) ? '&starf;' : '&star;'}</span>
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


function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  


  $favoritesList.empty();
  
  if(currentUser===undefined) {
    $favoritesList.append('<h3>Log in to view favorites</h3>');
    $favoritesList.show();
    return null;
  }
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
      const $story = generateFavoritesMarkup(story);
      $favoritesList.append($story);

  }

  $favoritesList.show();
}


/****BELOW HERE WILL BE LINKS AND FUNCTIONS FOR USER STORIES**** */
$body.on("click", "#nav-userStories", navUserStories);

function navUserStories(evt) {
  console.debug("navUserStories", evt);
  hidePageComponents();
  
  putUserStoriesOnPage();
}


function generateUserStoriesMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <i class="fa fa-trash trashCan"></i>
      <span class="starBtn ${currentUser.isFavorite(story) ? 'fav' : ''}" data-storyid="${story.storyId}">${currentUser.isFavorite(story) ? '&starf;' : '&star;'}</span>
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


function putUserStoriesOnPage() {
  console.debug("putFavoritesOnPage");
  


  $userStoryList.empty();
  
  if(currentUser===undefined) {
    $userStoryList.append('<h3>Log in to view user stories</h3>');
    $userStoryList.show();
    return null;
  }
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
      const $story = generateUserStoriesMarkup(story);
      $userStoryList.append($story);

  }

  $userStoryList.show();
}

$('body').on('click','.trashCan', deleteUserStory);

async function deleteUserStory(evt) {
  const storyId = evt.target.closest('li').id;


  //notify API of deletion
  await axios({
    method:'DELETE',
    url:`${BASE_URL}/stories/${storyId}`,
    data: {token:currentUser.loginToken}
  });

  //DELETE STORY FROM OWN STORIES LIST
  currentUser.ownStories = currentUser.ownStories.filter(el => el.storyId !== storyId);

  //DELETE STORY FROM STORYLIST;
  storyList.stories = storyList.stories.filter(el => el.storyId !==storyId);

  //DELETE STORY FROM FAVORITESLIST;
  currentUser.favorites = currentUser.favorites.filter(el => el.storyId !== storyId);


  putUserStoriesOnPage();

  /*
    --notify API of deletion;
    --remove story from currentUser.stories
    remove from page
    refresh page w/story removed
    DELETE STORY FROM STORYLIST;
  */

}