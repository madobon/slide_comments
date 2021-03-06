'use strict';

const express = require('express');
const co = require('co');
var router = express.Router();
var redis = require("redis");

var slide = require('../db/slide');

// const
var TYPE = require('../const/type');

// slide
router.get('/:slide_id/:type(' + TYPE.HOST + '|' + TYPE.GUEST + ')', function(req, res) {
  res.render('slide', {
    slide_id: req.params.slide_id,
    type: req.params.type
  });
});

// slide ajax
router.post('/:slide_id/markdown', function(req, res) {
  slide_client = redis.createClient();
  var slide_id = req.params.slide_id;
  var sl = {
    'slide_id': slide_id,
    'version_id': 1,
    'body': req.body.data,
    'user_id': 1,
    'datetime': Date.now()
  }
  slide.setSlide(sl);

});

// slide get
router.get('/:slide_id/markdown/:version', function(req, res) {

  slide_client = redis.createClient();

  var version = req.params.version;
  var slide_id = req.params.slide_id;

  if (version === 'latest') {
    // 非同期処理
    co(function* (){
      var sl = yield slide.getLatestSlide(slide_id);
      yield new Promise(function(resolve){
        if (!sl) {
          sl = {
            'slide_id':slide_id,
            'version_id':1,
            'body':'#Please Edit Me',
            'user_id':1,
            'datetime': Date.now()
          }
          slide.setSlide(sl);
        }
        console.log('body', sl.body);
        res.send(sl.body);
        resolve(true);
      });
    });
  } else if (!isNaN(parseFloat(version)) && isFinite(version)) {
    console.info('version');
    // TODO get old data from redis
    res.send(slide.getSlide(version));
  } else {
    res.send('# Opps!We have some problem!');
  }
});

module.exports = router;
