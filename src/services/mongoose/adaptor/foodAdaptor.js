const foodDao = require('../dao/food');

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
  }
}