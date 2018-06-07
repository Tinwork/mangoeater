const mongoose = require('mongoose');
const _ = require('lodash');

const schema = new mongoose.Schema({
  hashtag: 'string',
  count: 'number'
});

const Hashtag = mongoose.model('hashtag', schema);

module.exports = {
  /**
   * Insert
   *    Insert data
   * 
   * @param {Object} data
   * @return {Promise}
   * @throws
   */
  async insertOrUpdate(data) {
    if (_.isEmpty(data)) {
      throw new Error('data is empty');
    }

    return new Promise((resolve, reject) => {
      Hashtag.findOne({hashtag: data.name}, (err, doc) => {
        if (err) {
          reject(err);
        }
        
        if (_.isEmpty(doc)) {
          return resolve(Hashtag.create({hashtag: data.name, count: data.count}));
        }

        doc.count = doc.count + data.count;
        resolve(doc.save());
      });
    })
  },
  /**
   * Find
   * 
   * @param {Object} query 
   * @return {Promise}
   */
  async find(filter, sort) {
    let res = null;

    if (_.isEmpty(sort)) {
      res = await Hashtag.find(filter).limit(5);
    } else {
      res = await Hashtag.find(filter).sort(sort).limit(5);
    }

    return res;
  }
}