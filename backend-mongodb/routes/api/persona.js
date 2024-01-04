const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');

const Persona = require('../../models/Persona');
router.get('/', async (req, res) => {
  const filter = {};
  const personas = await Persona.find(filter);
  if (!personas) {
    return res.status(404).json({ msg: 'Persona not found' });
  }
  res.status(200).json(personas);
});
router.get('/:id', async ({ params: { id } }, res) => {
  try {
    const persona = await Persona.findById(id);

    if (!persona) {
      return res.status(404).json({ msg: 'Persona not found' });
    }

    res.json(persona);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

router.post('/create', async (req, res) => {
  console.log('Req.body', req.body);
  const {
    title,
    description,
    category,
    systemMessage,
    symbol,
    examples,
    call,
    voices
  } = req.body;
  const newData = new Persona({
    title: title,
    description: description,
    category: category,
    systemMessage: systemMessage,
    symbol: symbol,
    examples: examples,
    call: call,
    voices: voices
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
router.post('/findByTitle', async (req, res) => {
  console.log('Req.body', req.body);
  const {
    title
  } = req.body;
  Persona.find({
    title: title
  })
    .exec((err, persona) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error searching in database');
      } else {
        console.log("Search result", persona);
        res.status(200).json(persona);
      }
    });
});

router.post('/update', async (req, res) => {
  const {
    id,
    title,
    description,
    category,
    systemMessage,
    symbol,
    examples,
    call,
    voices
  } = req.body;

  const filter = { _id: id };
  const update = {
    title,
    description,
    category,
    systemMessage,
    symbol,
    examples,
    call,
    voices
  };

  // `doc` is the document _before_ `update` was applied
  let doc = await Persona.findOneAndUpdate(filter, update);

  if (!doc) {
    console.error(err);
    res.status(500).send('Error saving data to database');
  } else {
    res.status(200).json(doc);
  }
});
router.get('/delete/:id', async ({ params: { id } }, res) => {
  let doc = await Persona.findByIdAndDelete(id, function (err, docs) {
    if (!err) {
      // console.log(docs);
      res.status(200);
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
