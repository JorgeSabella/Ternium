const { History } = require('../models/history');
const { Alarms } = require('../models/alarms');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/:Number', auth, async (req, res) => {
    const history = await History.find().limit(req.params.Number / 2);
    const alarms = await Alarms.find().limit(req.params.Number / 2);
    res.json([history, alarms]);
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

    const alarmID = await Alarms.find({ idAlarma: { $regex: `${data}`, $options: 'i' } });
    const alarmSesion = await Alarms.find({ idSesion: { $regex: `${data}`, $options: 'i' } });
    const alarmTrabajador = await Alarms.find({ idTrabajador: { $regex: `${data}`, $options: 'i' } });
    const alarmSupervisor = await Alarms.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
    const alarmMAC = await Alarms.find({ MAC: { $regex: `${data}`, $options: 'i' } });
    const ObjAlarms = Object.assign(alarmID, alarmSesion, alarmTrabajador, alarmSupervisor, alarmMAC);

    res.json([ObjHistory, ObjAlarms]);
});

module.exports = router;