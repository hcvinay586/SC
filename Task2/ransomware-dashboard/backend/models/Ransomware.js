const mongoose = require('mongoose');

const ransomwareSchema = new mongoose.Schema({
    name: [String],
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

const Ransomware = mongoose.model('Ransomware', ransomwareSchema);

module.exports = Ransomware;
