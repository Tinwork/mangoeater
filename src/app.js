const express   = require('express');
const absTwit   = require('./services/twitter/abstractTwit');
const connector = require('./services/mongoose/connector/connector');
const twitMger  = require('./services/twitter/twitManager');

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

app.get('/twit/:criterion', (req, res) => {
  // use the twitter api in order to retrieve the tweet
  twit.getTwitByCategory('#food')
    .then(res => {
      if (!res.hasOwnProperty('statuses')) {
        return Promise.reject('no status');
      }

      const hs = twit.filterHashTag(res.statuses);
      return twitMger.saveHashtag(hs);
    })
    .then(() => console.log('save'))
    .catch(err => console.log(err));

    res.send('good');
});

app.listen(3000, () => console.log('server has start'));