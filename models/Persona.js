const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for 'voices'

// Define the schema for the main object
const mainSchema = new Schema({
  title: String,
  description: String,
  systemMessage: String,
  symbol: String,
  examples: [String],
  call: {
    starters: [String]
  },
  voices: {
    elevenLabs: {
      voiceId: String
    }
  }
});
module.exports = mongoose.model('persona', mainSchema);
