const express   = require('express');
const absTwit   = require('./services/twitter/abstractTwit');
const connector = require('./services/mongoose/connector/connector');
const twitMger  = require('./services/twitter/twitManager');
const foodAdaptor = require('./services/mongoose/adaptor/foodAdaptor');

// create the app
const app  = express();
// get an instance of the twitmanager
const twit = absTwit.getInstance(); 
// init the con with mongodb
connector.init();

// get the damn thing
app.get('/', (req, res) => {
  res.send('yay');
});

app.get('/twit/hashtags', (req, res) => {
  // use the twitter api in order to retrieve the tweet
  twit.getTwitByCategory('#asianfood')
    .then(res => {
      const hs = twit.filterHashTag(res.statuses);
      return twitMger.saveHashtag(hs.hashtag);
    })
    .then(() => console.log('save'))
    .catch(err => console.log(err));

    res.send('good');
});

app.get('/twit/food', (req, res) => {
  twit.getTwitByCategory('#asianfood')
    .then(res => {
      const hs = twit.filterHashTag(res.statuses);
      return twitMger.prepareFood(hs.hashtags, hs.t);
    })
    .then(d => foodAdaptor.saveData(d))
    .catch(err => console.log(err));

    res.send('yaa')
});


app.listen(3000, () => console.log('server has start'));