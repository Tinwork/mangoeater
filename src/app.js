const express    = require('express');
const bodyParser = require('body-parser');
const absTwit   = require('./services/twitter/abstractTwit');
const connector = require('./services/mongoose/connector/connector');
const twitMger  = require('./services/twitter/twitManager');
const foodAdaptor = require('./services/mongoose/adaptor/foodAdaptor');

// create the app
const app  = express();
app.use(bodyParser.json());
// get an instance of the twitmanager
const twit = absTwit.getInstance(); 
// init the con with mongodb
connector.init();

// get the damn thing
app.get('/', (req, res) => {
  res.send('yay');
});

app.post('/twit/hashtags', (req, res) => {
  // use the twitter api in order to retrieve the tweet
  twit.getTwitByCategory('#asianfood')
    .then(res => {
      const hs = twit.filterHashTag(res.statuses);
      return twitMger.saveHashtag(hs.hashtags);
    })
    .then(() => res.sendStatus(200))
    .catch(err => {
      res.send({err})
    });
});

app.post('/twit/food', (req, res) => {
  twit.getTwitByCategory('#asianfood')
    .then(res => {
      const hs = twit.filterHashTag(res.statuses);
      return twitMger.prepareFood(hs.hashtags, hs.t);
    })
    .then(d => foodAdaptor.saveData(d))
    .then(() => res.sendStatus(200))
    .catch(err => res.send({err}));
});

app.post('/twit/food/list', (req, res) => {
  const params = req.params.filter;

  foodAdaptor
    .get(req.body.filter, req.body.singleRes)
    .then(d => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(d))
    })
    .catch(err => {
      res.send({err})
    });
});

app.post('/twit/hashtag/list', (req, res) => {
  
});

app.listen(3000, () => console.log('server has start'));