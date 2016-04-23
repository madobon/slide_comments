var redis = require("redis");
var crypto = require('crypto');

slide_client = redis.createClient();

function getrandom() {
  var current_date = Date.now() + '';
  var random = Math.random().toString();
  var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return hash;
}

// var slide = {
//   'slide_id';,
//   'version_id':,
//   'body':,
//   'user_id':,
//   'datatime':
// }

// 終了
// comment_client.quit();
// room_client.quit();

function setSlide(slide) {
  slide_client.zadd(
    slide.slide_id, Date.now(), JSON.stringify({
    'version_id': slide.version_id,
    'body': slide.body,
    'user_id': slide.user_id,
    'datetime': slide.datetime
    })
  );
}

function getSlide(slide_id, version) {
  console.log(' ----- getSlide -----');
  slide_client.zrevrange(slide_id, 0, 0, function(err, obj) {
    console.log('obj',obj);
    return obj;
  });
  console.log(' ----- getSlide -----');
}

function getLatestSlide(slide_id) {
  console.log(' ----- getLatestSlide -----');
  slide_client.zrevrange(slide_id, 0, 0, function(err, obj) {
    console.log('obj',obj);
    return obj;
  });
  console.log(' ----- getLatestSlide -----');
}

// module.exports = room;
exports.getSlide = getSlide;
exports.getLatestSlide = getLatestSlide;
exports.setSlide = setSlide;
