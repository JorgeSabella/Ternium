const { History } = require('../models/history');
const { Alarms } = require('../models/alarms');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const historys = await History.find();
    res.send(historys);
});

router.get('/:Number', auth, async (req, res) => {
    const history = await History.find().limit(req.params.Number / 2);
    const alarms = await Alarms.find().limit(req.params.Number / 2);
    res.json([...history, ...alarms]);
});

router.get('/search/:Data', async (req, res) => {
    var data = req.params.Data;
    const historySesion = await History.find({ idSesion: { $regex: `${data}`, $options: 'i' } });
    const historyTrabajador = await History.find({ 'staff.name': { $regex: `${data}`, $options: 'i' } });
    const historyTrabajadorId = await History.find({ 'staff.registrationId': { $regex: `${data}`, $options: 'i' } });
    const historySupervisor = await History.find({ 'supervisor.name': { $regex: `${data}`, $options: 'i' } });
    const historySupervisorId = await History.find({ 'supervisor.username': { $regex: `${data}`, $options: 'i' } });    
    const historyMAC = await History.find({ MAC: { $regex: `${data}`, $options: 'i' } });
    const ObjHistory = Object.assign(historySesion, historyTrabajador, historyTrabajadorId, historySupervisor, historySupervisorId, historyMAC);

    res.json([ObjHistory]);
});

router.get('/:initialDate/:endDate', async (req, res) => {
    const inital = req.params.initialDate;
    const end = req.params.endDate;
    
    const historys = await History.find({ 'initialDate': {$gte: inital, $lte: end}, 'endDate': {$gte: inital, $lte: end}});
    res.send(historys);
  });
  

module.exports = router;