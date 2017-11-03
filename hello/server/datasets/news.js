var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NewsSchema = new Schema({
  user: String,
  userId: String,
  userImage: String,
  contentText: String, //caption
  contentImage: String, //path to content
  contentShared: Schema.ObjectId, //shared content ID
  date: {type: Date, default: Date.now}
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;
