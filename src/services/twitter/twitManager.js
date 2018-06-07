const hashtagDao = require('../mongoose/dao/hashtag');
const foodDao    = require('../mongoose/dao/food');
const langcode   = require('../lang/lang');
const _          = require('lodash');

// just some countries...
const foodCountryAttr = [
  'china',
  'chinese',
  'laos',
  'laotian',
  'cambodia',
  'cambodian',
  'thailand',
  'thai',
  'vietnam',
  'vietnamese',
  'japan',
  'japanese',
  'taiwan',
  'taiwanese',
  'buthan',
  'bhutanese',
  'korea',
  'korean',
  'indonesian',
  'malaysian',
  'brunei',
  'iranian',
  'phillipines',
  'mongolian',
  'indian'
];
/**
 * Order HashTag By Name
 * 
 * @param {Array} hashtags
 * @return {Map} orderHashtag 
 */
const countHashTag = (hashtags) => {
  const orderHashtag = new Map();

  for (let i = 0; i < hashtags.length; i++) {
    if (_.isEmpty(hashtags[i])) {
      continue;
    }

    const tag = hashtags[i].toLowerCase();
    let value = orderHashtag.get(tag);

    if (_.isUndefined(value)) {
      orderHashtag.set(tag, 1);
    } else {
      value++;
      orderHashtag.set(tag, value);
    }
  }

  return orderHashtag;
}

/**
 * Filter Hashtag Content
 * 
 * @param {Array} hashtags 
 */
const filterHashtagContent = (hashtags) => {
  return hashtags
    .filter(h => {
      if (_.isEmpty(h)) {
        return;
      }

      if (h.includes('food') && h !== 'food') {
        return h;
      }
    })
    .filter(h => {
      for (let i = 0; i < foodCountryAttr.length; i++) {
        if (h.includes(foodCountryAttr[i])) {
          return h;
        }
      }
    });
};

/**
 * Extract Tweet User Data
 * 
 * @param {Object} tweets 
 */
const extractTweetUserData = (tweets, tags) => {

  if (_.isEmpty(tags)) {
    return;
  }

  const filteredTweet = tweets.filter(tweet => {
    const hashtags = tweet.entities.hashtags; 
    if (_.isEmpty(hashtags)) {
      return;
    }

    for (let i = 0; i < hashtags.length; i++) {
      if (tags.includes(hashtags[i].text.toLowerCase())) {
        tweet.hs = hashtags[i].text.toLowerCase();
        return tweet;
      }
    } 
  })
  .map(tweet => {
    let veggie = false;
    const hashtags = tweet.entities.hashtags; 
    // check if the tweet has the hashtag vegetarian...
    for (let i = 0; i < hashtags.length; i++) {
      if (hashtags[i].text === 'vegan') {
        veggie = true;
      }
    }

    return {
      country: langcode.getCountryByCode(tweet.user.lang),
      type   : tweet.hs,
      vegetarian: veggie 
    }
  });

  return filteredTweet;
};

module.exports = {
  /**
   * Save Hashtag
   * 
   * @param {Array} hashtags 
   */
  saveHashtag(hashtags) {
    const map = countHashTag(hashtags);
    const promises = [];

    for (let [key, v] of map) {
      promises.push(
        hashtagDao.insertOrUpdate({name: key, count: v})
      );
    }

    return Promise.all(promises);
  },
  /**
   * Save Food
   * 
   * @param {Array} hashtags
   * 
   */
  saveFood(hashtags, untreatTweet) {
    const specialtags = filterHashtagContent(hashtags);
    const foodData = extractTweetUserData(untreatTweet, specialtags);
  }
};

