const express = require('express');
const bodyParser = require('body-parser');
const TwitterKoreanProcessor = require('node-twitter-korean-text');
const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .all('*', (req, res, next) => {
    const text = req.query.text || req.body.text;

    if (!text)
      return res.status(400).json({
        meta: {
          status: 400,
          message: "Parameter 'text' is requried"
        }
      });

    next();
  });

const normalize = (req, res) => {
  const text = req.query.text || req.body.text;

  TwitterKoreanProcessor.normalize(text).then(data => {
    res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    });
  });
};

app.get('/normalize', (req, res) => {
  normalize(req, res);
}).post('/normalize', (req, res) => {
  normalize(req, res);
});

const tokenize = (req, res) => {
  const text = req.query.text || req.body.text;
  const keepSpace = (req.query.keep_space || req.body.keep_space) === 'true' ?
    true : false;

  TwitterKoreanProcessor.tokenize(text)
    .then(tokens => TwitterKoreanProcessor.tokensToJsonArray(tokens, keepSpace))
    .then(data => res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    }));
};

app.get('/tokenize', (req, res) => {
  tokenize(req, res);
}).post('/tokenize', (req, res) => {
  tokenize(req, res);
});

const stem = (req, res) => {
  const text = req.query.text || req.body.text;

  TwitterKoreanProcessor.tokenize(text)
    .then(tokens => TwitterKoreanProcessor.stem(tokens))
    .then(stemmed => TwitterKoreanProcessor.tokensToJsonArray(stemmed))
    .then(data => res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    }));
};

app.get('/stem', (req, res) => {
  stem(req, res);
}).post('/stem', (req, res) => {
  stem(req, res);
});

app.post('/nouns-to-dictionary', (req, res) => {
  const text = req.query.text || req.body.text;
  TwitterKoreanProcessor.addNounsToDictionary(...text);

  res.status(201).json({
    meta: {
      status: 201,
      message: 'Created'
    }
  });
});

const extractPhrases = (req, res) => {
  const text = req.query.text || req.body.text;
  const filterSpam = (
    req.query.filter_spam || req.body.filter_spam) === 'true' ?
    true : false;
  const includeHashtags = (
    req.query.include_hashtags || req.body.include_hashtags) === 'true' ?
    true : false;

  TwitterKoreanProcessor.tokenize(text)
    .then(tokens =>
      TwitterKoreanProcessor.extractPhrases(tokens, filterSpam, includeHashtags)
    )
    .then(data => res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    }));
};

app.get('/extract-phrases', (req, res) => {
  extractPhrases(req, res);
}).post('/extract-phrases', (req, res) => {
  extractPhrases(req, res);
});

const splitSentences = (req, res) => {
  const text = req.query.text || req.body.text;

  TwitterKoreanProcessor.splitSentences(text)
    .then(data => res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    }));
};

app.get('/split-sentences', (req, res) => {
  splitSentences(req, res);
}).post('/split-sentences', (req, res) => {
  splitSentences(req, res);
});

const detokenize = (req, res) => {
  const text = req.query.text || req.body.text;

  TwitterKoreanProcessor.detokenize(text)
    .then(data => res.json({
      meta: {
        status: 200,
        message: 'Ok'
      },
      data
    }));
};

app.get('/detokenize', (req, res) => {
  detokenize(req, res);
}).post('/detokenize', (req, res) => {
  detokenize(req, res);
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
