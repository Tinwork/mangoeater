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
  vegetarian: 'number',
});

const Food = mongoose.model('food', schema);

module.exports = {
  /**
   * Insert
   *  
   * @param {Object} data
   * @throws
   */
  async insertOrUpdate(data) {
    if (_.isEmpty(data)) {
      throw new Error('data is empty');
    }

    return new Promise((resolve, reject) => {
      Food.findOne({type: data.type}, (err, doc) => {
        if (err) {
          reject(err);
        }

        if (_.isEmpty(doc)) {
          return resolve(Food.create({
            type: data.type,
            country: data.country,
            vegetarian: data.vegetarian
          }));
        } else {
          // update the country
          
        }
      });
    })


    if (!_.isArray(data)) {
      data = [data];
    }

    return Food.insertMany(data).exec()
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