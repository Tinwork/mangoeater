const hashtagDao = require('../mongoose/dao/hashtag');
const _ = require('lodash');

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
  }
};

