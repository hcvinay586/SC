const mongoose = require('mongoose');

const ransomwareSchema = new mongoose.Schema({
    name: {
        type: [String],
        required: true,
        unique: true,  // Enforce uniqueness
    },
    extensions: String,
    extensionPattern: String,
    ransomNoteFilenames: String,
    comment: String,
    encryptionAlgorithm: String,
    decryptor: String,
    resources: [String],
    screenshots: String,
    microsoftDetectionName: String,
    microsoftInfo: String,
    sandbox: String,
    iocs: String,
    snort: String,
});

ransomwareSchema.index({ name: 1 }, { unique: true });

const Ransomware = mongoose.model('Ransomware', ransomwareSchema);

module.exports = Ransomware;
