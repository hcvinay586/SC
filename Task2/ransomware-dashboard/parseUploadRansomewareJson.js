const mongoose = require('mongoose');
const axios = require('axios');

// Mongoose schema
const RansomwareSchema = new mongoose.Schema({
    name: { type: [String], required: true },
    extensions: { type: String, default: '' },
    extensionPattern: { type: String, default: '' },
    ransomNoteFilenames: { type: String, default: '' },
    encryptionAlgorithm: { type: String, default: '' },
    decryptor: { type: String, default: '' },
    resources: { type: [String], default: [] },
    microsoftDetectionName: { type: String, default: '' },
    microsoftInfo: { type: String, default: '' },
    sandbox: { type: String, default: '' },
    iocs: { type: String, default: '' },
    snort: { type: String, default: '' },
    additionalData: mongoose.Schema.Types.Mixed, // For unexpected fields
});

const Ransomware = mongoose.model("Ransomware", RansomwareSchema);

async function processJSON() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://hcvinay:0vFte0Solzgxt3fs@cluster0.tbvux.mongodb.net/Ransomeware');
        
        // Fetch JSON from URL
        const { data } = await axios.get('https://raw.githubusercontent.com/codingo/Ransomware-Json-Dataset/refs/heads/master/ransomware_overview.json'); // Replace with actual URL
        console.log('Fetched data:', JSON.stringify(data, null, 2));
        // Loop over the data and save to DB
        for (const item of data) {
            const ransomware = new Ransomware(item);
            await ransomware.save();
        }
        
        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
}

processJSON();
