const sequelize = require('./backend/config/database');  // Import Sequelize configuration
const Ransomware = require('./backend/models/Ransomware');  // Import the Sequelize model
const axios = require('axios');
const { Op } = require('sequelize');

// Connect to PostgreSQL database and sync the model
sequelize.sync()
    .then(() => {
        console.log('Database connected and models synced');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// File path to the large JSON file
const jsonUrl = 'https://raw.githubusercontent.com/codingo/Ransomware-Json-Dataset/refs/heads/master/ransomware_overview.json';

// Read JSON file and insert data in batches
const processLargeJSON = async () => {
    try {
        // Fetch the JSON data from the URL using Axios
        const response = await axios.get(jsonUrl);

        // Access the JSON data from the Axios response
        const jsonData = response.data;

        let batchData = [];
        const BATCH_SIZE = 1000;  // Process 1000 records at a time

        for (const record of jsonData) {
            try {
                let nameArray;
                if (typeof record.name === 'string') {
                    nameArray = record.name.split(',').map(item => item.trim());
                } else if (Array.isArray(record.name)) {
                    nameArray = record.name;  // If it's already an array, use it directly
                } else {
                    throw new Error('Invalid format for name field');
                }

                // Check for existing records with overlapping names
                const existingRecords = await Ransomware.findAll({
                    where: {
                        name: {
                            [Op.overlap]: nameArray, // Use PostgreSQL overlap operator
                        }
                    }
                });

                if (existingRecords.length > 0) {
                    console.log(`Duplicate records found for names: ${nameArray}. Skipping insertion.`);
                    continue; // Skip inserting this record
                }

                // Add each record to the batch
               batchData.push({
                    name: nameArray,  // Store the array of names
                    extensions: record.extensions || '', // Provide default if undefined
                    extensionPattern: record.extensionPattern || '',
                    ransomNoteFilenames: record.ransomNoteFilenames || '',
                    comment: record.comment || '',
                    encryptionAlgorithm: record.encryptionAlgorithm || '',
                    decryptor: record.decryptor || '',
                    resources: record.resources || [], // Handle as array
                    screenshots: record.screenshots || '',
                    microsoftDetectionName: record.microsoftDetectionName || '',
                    microsoftInfo: record.microsoftInfo || '',
                    sandbox: record.sandbox || '',
                    iocs: record.iocs || '',
                    snort: record.snort || '',
                });

                // If batch size is reached, insert into PostgreSQL
                if (batchData.length >= BATCH_SIZE) {
                    await Ransomware.bulkCreate(batchData, { validate: true });  // Insert in bulk
                    console.log(`Inserted ${batchData.length} records into the database`);
                    batchData = [];  // Clear batch
                }
            } catch (parseError) {
                console.error('Error processing JSON record:', parseError);
            }
        }

        // Insert any remaining data in the batch
        if (batchData.length > 0) {
            await Ransomware.bulkCreate(batchData, { validate: true });
            console.log(`Inserted remaining ${batchData.length} records into the database`);
        }

        console.log('JSON processing completed.');
    } catch (error) {
        console.error('Error fetching or processing the JSON file:', error);
    } finally {
        sequelize.close();  // Close PostgreSQL connection when done
    }
};

// Start processing the JSON file
processLargeJSON();
