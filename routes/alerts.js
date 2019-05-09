const {Alert} = require('../models/alert') ;
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const alerts = await Alert.find();
  res.send(alerts);
});

router.get('/:Number', auth, async (req, res) => {
  const alerts = await Alert.find().limit(req.params.Number * 1);
  res.json(alerts);
});

router.get('/search/:Data', auth, async (req, res) => {
  var data = req.params.Data;
  const alertSesion = await Alert.find({ 'session._id': { $regex: `${data}`, $options: 'i' } });
  const alertTrabajadorId = await Alert.find({ 'session.staff.registrationId': { $regex: `${data}`, $options: 'i' } });
  const alertTrabajador = await Alert.find({ 'session.staff.name': { $regex: `${data}`, $options: 'i' } });
  const alertSupervisorId = await Alert.find({ 'session.supervisor.username': { $regex: `${data}`, $options: 'i' } });
  const alertSupervisor = await Alert.find({ 'session.supervisor.name': { $regex: `${data}`, $options: 'i' } });
  const alertMAC = await Alert.find({ 'session.mac': { $regex: `${data}`, $options: 'i' } });
  const alertType = await Alert.find({ type: { $regex: `${data}`, $options: 'i' } });
  const ObjAlerts = Object.assign(alertSesion, alertTrabajador, alertSupervisor, alertMAC,alertTrabajadorId, alertSupervisorId, alertType);
  
  res.json([ObjAlerts]);
});

router.get('/:initialDate/:endDate', auth, async (req, res) => {
  const inital = req.params.initialDate;
  const end = req.params.endDate;
  
  const alerts = await Alert.find({ 'date': {$gte: inital, $lte: end}});
  res.send(alerts);
});

router.delete('/:id', auth, async (req, res) => {
  const alert = await Alert.findByIdAndDelete(req.params.id);

  if (!alert) return res.status(404).send('The alert with the given registration id was not found.');

  res.send(alert);
});

module.exports = router;