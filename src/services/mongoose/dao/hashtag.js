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
  async find(query) {
    let res = null;

    res = await this.Food.find(filter).exec();
    return res;
  }
}