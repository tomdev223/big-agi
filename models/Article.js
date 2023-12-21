const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    preview: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('article', ArticleSchema);
