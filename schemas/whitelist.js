const mongoose = require('mongoose');

const WhitelistSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Whitelist = mongoose.model('Whitelist', WhitelistSchema);

module.exports = { Whitelist };
