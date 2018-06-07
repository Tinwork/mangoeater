const mongoose = require('mongoose');
const _ = require('lodash');

const schema = new moongose.Schema({
  name: 'string',
  type: 'string',
  country: 'array',
  ingredient: 'array',
  vegetarian: 'boolean',
  slug: 'string'
});

module.exports = {
  /**
   * Create
   *    Create the schema of the model
   */
  init() {
    this.Food = mongoose.model('food', schema);
  },
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