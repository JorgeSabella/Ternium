const {Alert} = require('../models/alert') ;
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const alerts = await Alert.find();
  res.send(alerts);
});

router.delete('/:id', async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) return res.status(404).send('The alert with the given registration id was not found.');

  res.send(alert);
});

module.exports = router;