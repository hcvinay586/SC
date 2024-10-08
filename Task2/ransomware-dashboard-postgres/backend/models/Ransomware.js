// models/Ransomware.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import your Sequelize configuration

const Ransomware = sequelize.define('Ransomware', {
    name: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Array of strings
        allowNull: false,
        unique: true, // Enforce uniqueness
    },
    extensions: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    extensionPattern: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    ransomNoteFilenames: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    encryptionAlgorithm: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    decryptor: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    resources: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Array of strings
        allowNull: true, // Nullable
    },
    screenshots: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    microsoftDetectionName: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    microsoftInfo: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    sandbox: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    iocs: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
    snort: {
        type: DataTypes.TEXT,
        allowNull: true, // Nullable
    },
}, {
    tableName: 'ransomwares', // Define the table name in PostgreSQL
    timestamps: false, // Disable createdAt and updatedAt columns
    indexes: [
        {
            unique: true, // Set this index as unique
            fields: ['name'], // Specify the field to index
        },
    ],
});

module.exports = Ransomware;
