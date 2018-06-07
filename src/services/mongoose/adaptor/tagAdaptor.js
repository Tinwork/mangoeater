const tagDao = require('../dao/hashtag');
const _ = require('lodash');

const getSortFilter = filter => {
  switch (filter) {
    case 'popular':
      return {count: 1}
    case 'least': 
      return {count: -1}
    default:
      return {}
  }
};

module.exports = {
  get(filter, sorting) {
    if (_.isEmpty(filter)) {
      return Prromise.reject('filter is empty');
    }

    const sortType = getSortFilter(sorting);
    const filter = {hashtag: /"filter"/}
  }
}