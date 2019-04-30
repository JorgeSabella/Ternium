const Joi = require('joi');
const mongoose = require('mongoose');

const GPSSchema = mongoose.Schema({
    latitud: {
        type: String,
        required: true
    },
    longitud: {
        type: String,
        required: true
    }
});

const OxigenoSchema = mongoose.Schema({
    Min: {
        type: Number,
        required: true
    },
    Max: {
        type: Number,
        required: true
    },
    Prom: {
        type: Number,
        required: true
    }
});

const NitrogenoSchema = mongoose.Schema({
    Min: {
        type: Number,
        required: true
    },
    Max: {
        type: Number,
        required: true
    },
    Prom: {
        type: Number,
        required: true
    }
});

const COSchema = mongoose.Schema({
    Min: {
        type: Number,
        required: true
    },
    Max: {
        type: Number,
        required: true
    },
    Prom: {
        type: Number,
        required: true
    }
});

const GasNaturalSchema = mongoose.Schema({
    Min: {
        type: Number,
        required: true
    },
    Max: {
        type: Number,
        required: true
    },
    Prom: {
        type: Number,
        required: true
    }
});

const GasesSchema = mongoose.Schema({
    Oxigeno: {
        type: OxigenoSchema,
        required: true
    },
    Nitrogeno: {
        type: NitrogenoSchema,
        required: true
    },
    CO: {
        type: COSchema,
        required: true
    },
    GasNatural: {
        type: GasNaturalSchema,
        required: true
    }
});

const History = mongoose.model('History', new mongoose.Schema({
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
    Begin_time: {
        type: Date,
        required: true
    },
    End_time: {
        type: Date,
        required: true
    },
    Area: {
        type: String,
        required: true
    },
    Lugar: {
        type: String,
        required: true
    },
    MAC: {
        type: String,
        required: true
    },
    Temperatura: {
        type: Number,
        required: true
    },
    GPS: {
        type: GPSSchema,
        required: true
    },
    Gases: {
        type: GasesSchema,
        required: true
    }
}, {
        timestamps: true
    }));

function validateHistory(user) {
    const schema = {
        idSesion: Joi.string().alphanum().required(),
        idTrabajador: Joi.number().required(),
        idSupervisor: Joi.number().required(),
        Begin_time: Joi.Date().required(),
        End_time: Joi.Date().required(),
        Area: Joi.String().required(),
        Lugar: Joi.String().required(),
        MAC: Joi.string().required(),
        Temperatura: Joi.number().required(),
        GPS: Joi.required(),
        Gases: Joi.required()
    };

    return Joi.validate(user, schema);
}

exports.History = History;
exports.validate = validateHistory;