const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const Subscription = require('../../models/Subscription');

// @route    GET api/subscribe/me
// @desc     Get current users subscribe
// @access   Private
router.get('/:id', auth, async ({ params: { id } }, res) => {
  try {
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ msg: 'Plan not found' });
    }

    res.json(subscription);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

router.post('/checkSubscribe', auth, async (req, res) => {
  const { email } = req.body;

  let user = await Subscription.findOne({ email });
  if (!user) {
    return res.json({ nonSubscribe: true });
  } else return res.status(200).json({ subscribe: user, nonSubscribe: false });
});
router.post('/', auth, async (req, res) => {
  const { email } = req.body;
  const newData = new Subscription({
    email: email,
    subscribe: 1
  });
  newData.save((err, savedData) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data to database');
    } else {
      res.status(200).json(savedData);
    }
  });
});
router.post('/freePlan', auth, async (req, res) => {
  const { email } = req.body;
  const newData = new Subscription({
    email: email,
    subscribe: 0
  });
  newData.save((err, savedData) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data to database');
    } else {
      res.status(200).json(savedData);
    }
  });
});
router.post('/unSubscribe', auth, async (req, res) => {
  const { email } = req.body;

  Subscription.findOne({ email: email }, function (err, contact) {
    if (!err) {
      if (!contact) {
        contact = new Subscription();
        contact.subscribe = 0;
      }
      contact.subscribe = 2;
      contact.save(function (err) {
        if (!err) {
          res.status(200).json(contact);
        } else {
          console.log('Error: could not save contact ');
        }
      });
    }
  });
});
module.exports = router;
