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

const getPreviousValue = (prev, key) => {
  const country = prev.filter(p => {
    const pKey = Object.keys(p)[0];
    
    if (key === pKey) {
      return p;
    }
  });

  return country[0][key];
};

const compareCountry = (prev, curr) => {
  const newCtr = [];
  const prevKeys = prev.map(d => Object.keys(d)[0]);

  for (let i = 0; i < curr.length; i++) {
    const key = Object.keys(curr[i])[0];
    const currValue = curr[i][key];
    if (prevKeys.includes(key)) {
      const prevVal  = getPreviousValue(prev, key)
      newCtr[i] = {};
      newCtr[i][key] = prevVal + currValue;
    } else {
      newCtr.push(curr[i]);
    }
  }

  return newCtr;
};

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
          const ctr = doc.country;
          const nCtr = compareCountry(ctr, data.country);
          doc.country = nCtr;
          doc.vegetarian = doc.vegetarian + data.vegetarian;

          resolve(doc.save());
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
      res = await Food.findOne(filter).exec();
    } else {
      res = await Food.find(filter).exec();
    }

    return res;
  }
};