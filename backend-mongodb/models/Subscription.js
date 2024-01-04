const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    subscribe: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('subscription', SubscriptionSchema);
