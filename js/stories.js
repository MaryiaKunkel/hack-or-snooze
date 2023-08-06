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
  const hostName = story.getHostName();
  const starClass = story.isFavorite ? 'story-favorite' : '';
  
  return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <span class="star ${starClass}">&bigstar;</span>
    </li>
  `);
}

function giveStoryFavoriteClass(element) {
  $(element).addClass('story-favorite');
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

async function submitNewStory() {
  const author = $('#author').val();
  const title = $('#title').val();
  const url = $('#url').val();
  const username = currentUser.username;

  let story = await storyList.addStory(username, { title, author, url });
  let generateStory = generateStoryMarkup(story);
  $allStoriesList.prepend(generateStory);
};

$submitForm.on('submit', submitNewStory);



function toFavoriteStory() {
  $(document).on('click', '.star', function () {
    if (!currentUser) {
      alert('Please log in or sign up')
    } else {
      const storyId = $(this).closest('li').attr('id');
      if (!$(this).hasClass('story-favorite')) {
        currentUser.addFavoriteStory(storyId);
      } else {
        currentUser.removeFavoriteStory(storyId);
      }
      // console.log(currentUser.favorites)

    };
  });
}

toFavoriteStory();

function showFavoritedStories() {
  if (currentUser) {
    let favoritedStories = currentUser.favorites.map(obj => obj.storyId); // array
    for (let i = 0; i < storyList.stories.length; i++){
      if (favoritedStories.includes(storyList.stories[i].storyId)) {
        $(`#${storyList.stories[i].storyId}`).children('span').addClass('story-favorite');
        // console.log(currentUser.favorites);

      }
    }
  }
}

showFavoritedStories();

function clickFavoritesTab() {
  $('#nav-favorites').on('click', function () {
    // console.log(currentUser.favorites);
    putFavoriteStoriesOnPage();

    // async function getAndShowStoriesOnStart() {
    //   storyList = await StoryList.getStories();
    //   $storiesLoadingMsg.remove();
    //   putStoriesOnPage();
    // }
  })
}
clickFavoritesTab()

function generateFavoriteStoryMarkup(story) {
  // const hostName = story.getHostName();
  const hostName = '123456';
  const starClass = 'story-favorite';
  return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <span class="star ${starClass}">&bigstar;</span>
    </li>
  `);
}

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");
  $allStoriesList.empty();
  for (let i = 0; i < currentUser.favorites.length; i++) {
    // let storyId = currentUser.favorites[i].storyId;
    let $story = generateFavoriteStoryMarkup(currentUser.favorites[i]);

    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  // console.log($allStoriesList)
}
