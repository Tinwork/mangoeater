const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * Example
 * 
 * {
 *  type: 'chinesefood',
 *  country: [{
 *   France: 1,
 *   China: 2,
 *   Laos: 2,
 *   Cambodia: 3
 *  }],
 *  vegetarian: 3
 * }
 */
const schema = new mongoose.Schema({
  type: 'string',
  country: 'array',
  vegetarian: 'boolean',
});

const Food = mongoose.model('food', schema);

module.exports = {
  /**
   * Insert
   *  
   * @param {Array} data
   * @throws
   */
  async insert(data) {
    if (_.isEmpty(data)) {
      throw new Error('data is empty');
    }

    if (!_.isArray(data)) {
      data = [data];
    }

    return this.Food.insertMany(data).exec()
  },
  /**

   *  Find a model on the document
   * 
   * @param {Object} filter
   */
  async find(filter, one) {
    let res = null;
    if (one) {
      res = await this.Food.findOne(filter).exec();
    } else {
      res = await this.Food.find(filter).exec();
    }

    return res;
  }
};