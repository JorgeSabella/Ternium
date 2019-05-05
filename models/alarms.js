const mongoose = require('mongoose');

const SensorSchema = mongoose.Schema({
    NombreSensor: {
        type: String,
        required: true
    },
    Lectura: {
        type: Number,
        required: true
    }
})

const Alarms = mongoose.model('Alarms', new mongoose.Schema({
    idAlarma: {
        type: String,
        required: true
    },
    idSesion: {
        type: String,
        required: true,
    },
    idTrabajador: {
        type: String,
        required: true
    },
    idSupervisor: {
        type: String,
        required: true
    },
    MAC: {
        type: String,
        required: true
    },
    Sensor: {
        type: SensorSchema,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    }));

exports.Alarms = Alarms;