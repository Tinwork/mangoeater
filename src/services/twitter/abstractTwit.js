const Twit = require('twit');
const _ = require('lodash');

// Credentials, use to connect to twitter API
const credentials = {
  consumer_key: 'lpt7lMrPDG8BSYfX7fiquCTfc',
  consumer_secret_key: 'G21LioD5BoGdx711uxBHRl1O6BS0L42p9MkDQkJ2QtOpC69rge',
  access_token: '1004300231528378369-NYsCQxo8XSmf0booJKBxloZ0R20I1r',
  access_token_secret: 'cTkWIvhIaFm5tYizfpj6PV14rY87SIPJZqkGDM7HlWSwD'
};

// Instance of the class
let twit = null;

/**
 * Abstract Twit
 */
class AbstractTwit {

  /**
   * Constructor
   */
  constructor() {
    this.twit = new Twit({
      consumer_key: credentials.consumer_key,
      consumer_secret: credentials.consumer_secret_key,
      access_token: credentials.access_token,
      access_token_secret: credentials.access_token_secret
    });
  }

  /**
   * Get Instance
   *    Return an instance of the twitter API
   * @return {Object} AbstractTwit
   */
  static getInstance() {
    if (_.isEmpty(twit)) {
      twit = new AbstractTwit();
    }

    return twit;
  }

  /**
   * Get Twit By Category
   * 
   * @param {String} criteria
   * @throws
   * @return {Promise}
   */
  async getTwitByCategory(criteria) {
    if (_.isEmpty(criteria)) {
      throw new Error('Criteria is empty');
    }

    return new Promise((resolve, reject) => {
      this.twit.get('search/tweets', {q: criteria, count: 200}, (err, data, res) => {
        if (!_.isEmpty(err)) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  /**
   * Filter Hash Tag
   * 
   * @param {Object} datas
   * @return {Array} hashtags
   */
  filterHashTag(tweets) {
    const t = [];
    const hashtags = tweets
      .map(tweet => {
        if (_.isEmpty(tweet.entities.hashtags)) {
          return;
        }

        t.push(tweet);
        return tweet.entities.hashtags.reduce((prev, curr) => {
          return [...prev, curr.text]
        }, []);
      })
      .reduce((a, b) => {
        return a.concat(b);
      }, []);

    return {
      hashtags, 
      t
    };
  }
}

module.exports = AbstractTwit;
