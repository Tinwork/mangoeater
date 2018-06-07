const hashtagDao = require('../dao/hashtag');
const _ = require('lodash');

const getSortFilter = filter => {
  switch (filter) {
    case 'least':
      return {count: 1}
    case 'popular': 
      return {count: -1}
    default:
      return null
  }
};

module.exports = {
  get(filter, sorting) {
    if (_.isEmpty(filter)) {
      return Prromise.reject('filter is empty');
    }

    const sortType = getSortFilter(sorting);
    const f = {"hashtag": {$regex: '.*'+filter+'.*'}};

    return hashtagDao.find(f, sortType);
  }
}