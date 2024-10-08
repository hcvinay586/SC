// models/Ransomware.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the Sequelize configuration

const Ransomware = sequelize.define('Ransomware', {
    name: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
        allowNull: false,
    },
    extensions: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    extensionPattern: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    ransomNoteFilenames: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    encryptionAlgorithm: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    decryptor: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    resources: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
        defaultValue: [],
    },
    microsoftDetectionName: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    microsoftInfo: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    sandbox: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    iocs: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    snort: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    additionalData: {
        type: DataTypes.JSONB, // For unexpected fields, using JSONB for flexibility
    },
}, {
    tableName: 'ransomwares', // Name of the table in PostgreSQL
    timestamps: false, // Disable createdAt and updatedAt columns
});

module.exports = Ransomware;

