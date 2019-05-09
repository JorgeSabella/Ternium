const { History } = require('../models/history');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const historys = await History.find();
    res.send(historys);
});

router.get('/:Number', auth, async (req, res) => {
    const history = await History.find().limit(req.params.Number * 1);
    res.json(history);
});

router.get('/search/:Data', auth, async (req, res) => {
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

router.get('/:initialDate/:endDate', auth, async (req, res) => {
    const inital = req.params.initialDate;
    const end = req.params.endDate;
    
    const historys = await History.find({ 'initialDate': {$gte: inital, $lte: end}, 'endDate': {$gte: inital, $lte: end}});
    res.send(historys);
  });
  

module.exports = router;