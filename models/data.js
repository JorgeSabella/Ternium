const mongoose = require('mongoose');

const Data = mongoose.model('Data', new mongoose.Schema({
    longitud: Number,
    latitud: Number,
    gasNatural: Number,
    mac: String,
    co2: Number,
    hidrogeno: Number,
    temperatura: Number,
    alert: Boolean
}));

exports.Data = Data;
