const foodDao = require('../dao/food');
const _ = require('lodash');

/**
 * Get Filter
 * 
 * @param {String} filter 
 */
const getFilter = filter => {
  switch (filter) {
    case 'chinese':
      return {'type': 'chinesefood'};
    case 'indian':
      return {'type': 'indianfood'};
    case 'vietnamese':
      return {'type': 'vietnamesefood'};
    case 'japanese':
      return {'type': 'japanesefood'};
    case 'korean':
      return {'type': 'koreanfood'};
    case 'taiwan': 
      return {'type': 'taiwanesefood'};
    default:
      return {}
  };
};

module.exports = {
  /**
   * Save Data
   * 
   * @param {Map} data 
   */
  saveData(data) {
    const promises = [];
    
    for (let [key, v] of data) {
      promises.push(foodDao.insertOrUpdate({
        type: key,
        country: v.country,
        vegetarian: v.vegetarian
      }));
    }

    return Promise.all(promises);
  },
  /**
   * Get
   * 
   * @param {Object} filter 
   * @param {Boolean} byOne 
   */
  get(filter, byOne) {
    if (_.isEmpty(filter)) {
      return Promise.reject('Filter is empty');
    }

    if (_.isEmpty(byOne)) {
      byOne = false;
    }

    const criteria = getFilter(filter);
    return foodDao.find(criteria, byOne);
  }
}