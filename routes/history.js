const { History, validateHistory } = require('../models/history');
const { Alarms, validateAlarms } = require('../models/alarms');
const express = require('express');
const router = express.Router();

router.get('/:Number', async (req, res) => {
    var number = req.params.Number;
    for (var i = 10; i <= req.params.Number; i += 10) {
        if (i === 10) {
            number = number - 10;
        } else {
            number = number - 5;
        }
    }
    try {
        const history = await History.find().skip(number).limit(5);
        const alarms = await Alarms.find().skip(number).limit(5);
        res.json([history, alarms]);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving history."
        });
    }
});

router.get('/search/:Data', async (req, res) => {
    var data = req.params.Data;
    try {
        const historySesion = await History.find({ idSesion: { $regex: `${data}`, $options: 'i' } });
        const historyTrabajdor = await History.find({ idTrabajador: { $regex: `${data}`, $options: 'i' } });
        const historySupervisor = await History.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const historyBeginTime = await History.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const historyEndTime = await History.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const historyArea = await History.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const historyLugar = await History.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const historyMAC = await History.find({ MAC: { $regex: `${data}`, $options: 'i' } });
        const ObjHistory = Object.assign(historySesion, historyTrabajdor, historySupervisor, historyBeginTime, historyEndTime, historyArea, historyLugar, historyMAC);

        const alarmID = await Alarms.find({ idAlarma: { $regex: `${data}`, $options: 'i' } });
        const alarmSesion = await Alarms.find({ idSesion: { $regex: `${data}`, $options: 'i' } });
        const alarmTrabajador = await Alarms.find({ idTrabajador: { $regex: `${data}`, $options: 'i' } });
        const alarmSupervisor = await Alarms.find({ idSupervisor: { $regex: `${data}`, $options: 'i' } });
        const alarmMAC = await Alarms.find({ MAC: { $regex: `${data}`, $options: 'i' } });
        const ObjAlarms = Object.assign(alarmID, alarmSesion, alarmTrabajador, alarmSupervisor, alarmMAC);

        res.json([ObjHistory, ObjAlarms]);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving history."
        });
    }
});

router.post('/', async (req, res) => {
    console.log('Nueva Peticion!');
    const { error } = validateHistory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let history = new History({
        idSesion: req.body.idSesion,
        idTrabajador: req.body.idTrabajador,
        idSupervisor: req.body.idSupervisor,
        MAC: req.body.MAC,
        Temperatura: req.body.Temperatura,
        GPS: req.body.GPS,
        Gases: req.body.Gases
    });
    history = await history.save();

    res.send(history);
});

router.post('/alarms', async (req, res) => {
    console.log('Nueva Peticion!');
    const { error } = validateAlarms(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let alarms = new Alarms({
        idAlarma: req.body.idAlarma,
        idSesion: req.body.idSesion,
        idTrabajador: req.body.idTrabajador,
        idSupervisor: req.body.idSupervisor,
        MAC: req.body.MAC,
        Sensor: req.body.Sensor
    });
    alarms = await alarms.save();

    res.send(alarms);
});

module.exports = router;