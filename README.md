# twitter-korean-text-api

[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)]() [![Docker Repository on Quay](https://quay.io/repository/haydnhkim/twitter-korean-text-api/status "Docker Repository on Quay")](https://quay.io/repository/haydnhkim/twitter-korean-text-api)

REST API for [Twitter's Korean tokenizer](https://github.com/twitter/twitter-korean-text) on Docker using [node-twitter-korean-text](https://github.com/rokoroku/node-twitter-korean-text) and express

## Example run

`docker run --rm -p 3000:3000 haydnhkim/twitter-korean-text-api`

or

`docker run --rm -p 3000:3000 quay.io/haydnhkim/twitter-korean-text-api`

## API

`GET|POST` are abailable for both query string and form data(x-www-form-urlencoded)

### Normalization

**GET|POST** /normalize?text=한국어를 처리하는 예시입니닼ㅋㅋㅋㅋㅋ

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": "한국어를 처리하는 예시입니다ㅋㅋ"
}
```

### Tokenization

**GET|POST** /tokenize?keep_space=true&text=한국어를 처리하는 예시입니다 ㅋㅋ

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "한국어",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 3,
      "isUnknown": false
    },
    {
      "text": "를",
      "koreanPos": "Josa",
      "offset": 3,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": " ",
      "koreanPos": "Space",
      "offset": 4,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": "처리",
      "koreanPos": "Noun",
      "offset": 5,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "하는",
      "koreanPos": "Verb",
      "offset": 7,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": " ",
      "koreanPos": "Space",
      "offset": 9,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": "예시",
      "koreanPos": "Noun",
      "offset": 10,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "입니",
      "koreanPos": "Adjective",
      "offset": 12,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "다",
      "koreanPos": "Eomi",
      "offset": 14,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": " ",
      "koreanPos": "Space",
      "offset": 15,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": "ㅋㅋ",
      "koreanPos": "KoreanParticle",
      "offset": 16,
      "length": 2,
      "isUnknown": false
    }
  ]
}
```

### Stemming

**GET|POST** /stem?text=한국어를 처리하는 예시입니다 ㅋㅋ

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "한국어",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 3,
      "isUnknown": false
    },
    {
      "text": "를",
      "koreanPos": "Josa",
      "offset": 3,
      "length": 1,
      "isUnknown": false
    },
    {
      "text": "처리",
      "koreanPos": "Noun",
      "offset": 5,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "하다",
      "koreanPos": "Verb",
      "offset": 7,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "예시",
      "koreanPos": "Noun",
      "offset": 10,
      "length": 2,
      "isUnknown": false
    },
    {
      "text": "이다",
      "koreanPos": "Adjective",
      "offset": 12,
      "length": 3,
      "isUnknown": false
    },
    {
      "text": "ㅋㅋ",
      "koreanPos": "KoreanParticle",
      "offset": 16,
      "length": 2,
      "isUnknown": false
    }
  ]
}
```

### Add to dictionary

**POST** /nouns-to-dictionary?text=우햐나&text=어가녀&text=아뎌

```
//before
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "우햐나어가녀아뎌",
      "koreanPos": "ProperNoun",
      "offset": 0,
      "length": 8,
      "isUnknown": true
    }
  ]
}

// request /nouns-to-dictionary?text=우햐나&text=어가녀&text=아뎌
{
  "meta": {
    "status": 201,
    "message": "Created"
  }
}

// after
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "우햐나",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 3,
      "isUnknown": false
    },
    {
      "text": "어가녀",
      "koreanPos": "Noun",
      "offset": 3,
      "length": 3,
      "isUnknown": false
    },
    {
      "text": "아뎌",
      "koreanPos": "Noun",
      "offset": 6,
      "length": 2,
      "isUnknown": false
    }
  ]
}
```

### phrase extraction

**GET|POST** /extract-phrases?filter_spam=true&include_hashtags=true&text=아름다운 트위터를 만들어 보자. 카지노 #블락_테스트

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "아름다운 트위터",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 8
    },
    {
      "text": "트위터",
      "koreanPos": "Noun",
      "offset": 5,
      "length": 3
    },
    {
      "text": "#블락_테스트",
      "koreanPos": "Hashtag",
      "offset": 22,
      "length": 7
    }
  ]
}
```

**GET|POST** /extract-phrases?filter_spam=false&include_hashtags=true&text=아름다운 트위터를 만들어 보자. 카지노 #블락_테스트

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "아름다운 트위터",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 8
    },
    {
      "text": "카지노",
      "koreanPos": "Noun",
      "offset": 18,
      "length": 3
    },
    {
      "text": "트위터",
      "koreanPos": "Noun",
      "offset": 5,
      "length": 3
    },
    {
      "text": "#블락_테스트",
      "koreanPos": "Hashtag",
      "offset": 22,
      "length": 7
    }
  ]
}
```

**GET|POST** /extract-phrases?filter_spam=false&include_hashtags=true&text=아름다운 트위터를 만들어 보자. 카지노 #블락_테스트

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "아름다운 트위터",
      "koreanPos": "Noun",
      "offset": 0,
      "length": 8
    },
    {
      "text": "카지노",
      "koreanPos": "Noun",
      "offset": 18,
      "length": 3
    },
    {
      "text": "트위터",
      "koreanPos": "Noun",
      "offset": 5,
      "length": 3
    }
  ]
}
```

### Splitting Sentence

**GET|POST** /split-sentences?text=가을이다! 남자는 가을을 탄다...... 그렇지? 루루야! 버버리코트 사러 가자!!!!

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": [
    {
      "text": "가을이다!",
      "start": 0,
      "end": 5
    },
    {
      "text": "남자는 가을을 탄다......",
      "start": 6,
      "end": 22
    },
    {
      "text": "그렇지?",
      "start": 23,
      "end": 27
    },
    {
      "text": "루루야!",
      "start": 28,
      "end": 32
    },
    {
      "text": "버버리코트 사러 가자!!!!",
      "start": 33,
      "end": 48
    }
  ]
}
```

### Detokenize

/detokenize?text=한국어&text=를&text=처리&text=하는&text=예시&text=입니&text=다&text=ㅋㅋ

```
{
  "meta": {
    "status": 200,
    "message": "Ok"
  },
  "data": "한국어를 처리하는 예시 입니다 ㅋㅋ"
}
```

