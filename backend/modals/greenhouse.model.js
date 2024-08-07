const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  time: {
    type: String,
    required: false,
  },
  temperature: {
    type: Number,
    required: false,
  },
  humidity: {
    type: Number,
    required: false,
  },
  light: {
    type: Number,
    required: false,
  },
  soilMoisture: {
    type: Number,
    required: false,
  },
  soilTemp: {
    type: Number,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
});

const EngineerActionsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  action: {
    type: String,
    enum: ['Fertilisation', 'Irrigation', 'controle de temperature', 'controle de parasites', 'Taille', 'Pollinisation', 'Ajustement de leclairage', 'Recolte', 'Evaluation de la sante des plantes', 'Maintenance de lequipement'],
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
});

const SensorSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: false,
  },
  data: [SensorDataSchema],
});

const GreenhouseSchema = new mongoose.Schema(
  {
    greenhouseName: {
      type: String,
      required: true,
      unique: true,
    },
    plantType: {
      type: String,
      required: true,
    },
    location: {
      type: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    numberOfPlants: {
      type: Number,
      required: true,
    },
    sensors: [SensorSchema],
    engineerActions: [EngineerActionsSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Greenhouse", GreenhouseSchema);
