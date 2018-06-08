const hashtagDao = require('../mongoose/dao/hashtag');
const foodDao    = require('../mongoose/dao/food');
const langcode   = require('../lang/lang');
const _          = require('lodash');

// just some countries...
const foodCountryAttr = [
  'asian',
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
  'indonesia',
  'indonesian',
  'malaysia',
  'malaysian',
  'brunei',
  'iranian',
  'phillipines',
  'mongolian',
  'indian',
  'india'
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
      if (!_.isEmpty(h)) {
        h = h.toLowerCase();
        if (h.includes('food') && h !== 'food') {
          return h;
        }
      }
    })
    .filter(h => {
      h = h.toLowerCase();
      for (let i = 0; i < foodCountryAttr.length; i++) {
        if (h.includes(foodCountryAttr[i])) {
          return h;
        }
      }
    })
    .map(t => t.toLowerCase());
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
    if (!_.isEmpty(hashtags)) {
      const fhashtag = hashtags.filter(f => {
        const key = f.text;

        if (tags.includes(key.toLowerCase())) {
          tweet.hs = key.toLowerCase();
          return f;
        }
      });

      if (fhashtag.length > 0) {
        return tweet;
      } 
    }
  })
  .map(tweet => {
    let veggie = false;
    const hashtags = tweet.entities.hashtags; 
    // check if the tweet has the hashtag vegetarian...
    for (let i = 0; i < hashtags.length; i++) {
      if (hashtags[i].text === 'veggie') {
        veggie = true;
      }
    }

    //console.log(tweet.hs)
    return {
      country: langcode.getCountryByCode(tweet.user.lang),
      type   : tweet.hs,
      veg    : veggie 
    }
  });

  return filteredTweet;
};

/**
 * Update Country
 *  Smelly code yes.
 * 
 * @param {Array} ctr 
 * @return {Array}
 */
const updateCountry = (ctr, nCtr) => {
  const copy = ctr.slice();
  let update = false;
  let i = 0;
  for (let idx = 0; idx < copy.length; idx++) {
    if (copy[idx][nCtr]) {
      update = true;
      i = idx;
    }
  }

  if (update) {
    // dangerous
    copy[i][nCtr] = ctr[i][nCtr] + 1; 
  } else {
    const obj = {};
    obj[nCtr] = 1;
    copy.push(obj);
  }

  return copy;
};

/**
 * Order Food Data
 *  Check and merge the type of food
 *  Dirty code but in a hurry !
 * @param {Array} foodModel
 * @return {Map}
 */
const orderFoodData = foodModel => {
  const formatModel = new Map();

  for (let i = 0; i < foodModel.length; i++) {
    const food = foodModel[i];
    const v = formatModel.get(food.type);

    if (_.isEmpty(v)) {
      // bad but anyway
      const cr = {};
      cr[food.country] = 1;
      // init the data in the map
      formatModel.set(food.type, {
        country   : [cr],
        vegetarian: food.veg ? 1 : 0
      });
    } else {
      // update the value of the map
      v.vegetarian = v.vegetarian + (food.veg ? 1 : 0);
      // check if the name of the country
      v.country = updateCountry(v.country, food.country);
    }
  }

  return formatModel;
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
  prepareFood(hashtags, untreatTweet) {
    return new Promise((resolve, reject) => {
      const specialtags = filterHashtagContent(hashtags);
      const foodData    = extractTweetUserData(untreatTweet, specialtags);

      if (_.isEmpty(foodData)) {
        return reject('no corresponding tweet to asian food');
      }

      const model = orderFoodData(foodData)
      resolve(model);
    });
  }
};

