const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');

const Article = require('../../models/Article');
router.get('/', async (req, res) => {
  const filter = {};
  const articles = await Article.find(filter);
  if (!articles) {
    return res.status(404).json({ msg: 'Article not found' });
  }
  res.status(200).json(articles);
});
router.get('/:id', async ({ params: { id } }, res) => {
  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

router.post('/create', async (req, res) => {
  console.log('req.body', req.body);
  const { subject, content } = req.body;
  const newData = new Article({
    subject: subject,
    content: content
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

router.post('/update', async (req, res) => {
  const { id, subject, content } = req.body;

  const filter = { _id: id };
  const update = { subject: subject, content: content };

  // `doc` is the document _before_ `update` was applied
  let doc = await Article.findOneAndUpdate(filter, update);

  if (!doc) {
    console.error(err);
    res.status(500).send('Error saving data to database');
  } else {
    res.status(200).json(doc);
  }
});
router.get('/delete/:id', async ({ params: { id } }, res) => {
  let doc = await Article.findByIdAndDelete(id, function (err, docs) {
    if (!err) {
      // console.log(docs);
      res.status(200);
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
