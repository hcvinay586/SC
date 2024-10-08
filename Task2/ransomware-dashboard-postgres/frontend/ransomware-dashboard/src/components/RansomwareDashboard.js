import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const RansomwareDashboard = () => {
    const [ransomwareList, setRansomwareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [duplicateError, setDuplicateError] = useState(null); // To track duplicate errors
    const [showModal, setShowModal] = useState(false);
    // eslint-disable-next-line
    const [isAdding, setIsAdding] = useState(true); // Declare and initialize 'isAdding'
    const [currentRansomware, setCurrentRansomware] = useState(null); // For editing

    const emptyFormData = {
        name: [''],
        extensions: '',
        encryptionAlgorithm: '',
    };

    const [formData, setFormData] = useState(emptyFormData);

    // Fetch ransomware data from API
    const fetchRansomware = async () => {
        try {
            // console.log('Fetching ransomware data...');
            const response = await axios.get('http://localhost:5000/api/ransomware');
            
            //console.log('API Response:', response); // Log the full response object
    
            // Check the structure of the response
            if (response.data && Array.isArray(response.data)) {
                setRansomwareList(response.data); // Set state with the response data
                //console.log('Ransomware list set:', response.data); // Log the list
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // If the data is wrapped in a "data" property
                setRansomwareList(response.data.data); // Set state with the wrapped data
                //console.log('Ransomware list set from wrapped data:', response.data.data);
            } else {
                console.error('Unexpected response format:', response.data); // Log unexpected response
                setRansomwareList([]); // Set to empty array if the response is not an array
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err); // Log error details
            setError('Error fetching data'); // Update error state
            setLoading(false); // Stop loading
        }
    };

    // Use Effect to call fetchRansomware on component mount
    useEffect(() => {
        fetchRansomware();
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Check if the name field is being updated
        if (name === 'name') {
            // Convert the string to an array by splitting on commas
            const nameArray = value.split(',').map(item => item.trim());
            setFormData({ ...formData, [name]: nameArray });
        } else {
            // For other fields, just update as usual
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submit for adding/updating a record
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset duplicate error on form submit
        setDuplicateError(null);
        setError(null);

        try {
            const nameArray = Array.isArray(formData.name) 
                ? formData.name  // If it's already an array, use it directly
                : formData.name.split(',').map(item => item.trim()).filter(item => item); // Split and trim if it's a string
            
             // Include the currentRansomware ID in the data to submit for updates
            const dataToSubmit = {
                ...formData,
                name: nameArray,
                _id: currentRansomware ? currentRansomware.id : undefined // Include ID if editing
            };

            if (currentRansomware) {
                if (!currentRansomware.id) {
                    console.error("Current ransomware ID is undefined");
                    setError('Current ransomware ID is undefined');
                    return;
                }
                // Update record
                await axios.put(`http://localhost:5000/api/ransomware/${currentRansomware.id}`, dataToSubmit, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                // Add new record
                await axios.post('http://localhost:5000/api/ransomware', dataToSubmit);
            }
            setFormData(emptyFormData);
            setShowModal(false);
            setCurrentRansomware(null);
            fetchRansomware(); // Refresh the list after operation
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.error('Duplicate entry:', err);
                // If a duplicate entry error occurred, set duplicateError state
                setDuplicateError(err.response.data.message || 'Duplicate entry detected');
            } else {
                console.error('Error saving data:', err);
                setError('Error saving data'); // Handle general errors
            }
        }
    };

    // Handle deleting a record
    const handleDelete = async (ransomware) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record? \nName: " + ransomware.name);
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/ransomware/${ransomware.id}`);
                fetchRansomware(); // Refresh the list after deletion
            } catch (err) {
                console.error('Error deleting record:', err);
                setError('Error deleting record');
            }
        }
    };

    // Open modal for adding new or editing existing record
    const openModal = (ransomware = null) => {
        if (ransomware) {
            console.log("Opening modal for editing:", ransomware);
            setCurrentRansomware(ransomware);
            setIsAdding(false);  // We're editing, not adding
            setFormData({
                name: ransomware.name.join(', '),
                extensions: ransomware.extensions,
                encryptionAlgorithm: ransomware.encryptionAlgorithm || '',
            });
        } else {
            setIsAdding(true);  // We're adding a new record
            setFormData(emptyFormData);
            setCurrentRansomware(null);
        }
        setDuplicateError(null);
        setShowModal(true);
    };

    // Close the modal
    const closeModal = () => {
        setFormData(emptyFormData);
        setCurrentRansomware(null);
        setShowModal(false);
        setDuplicateError(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h1>Ransomware Dashboard</h1>
            <Button variant="primary" onClick={() => openModal()}>Add Ransomware</Button>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Extensions</th>
                        <th>Encryption Algorithm</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ransomwareList) && ransomwareList.length > 0 ? ( // Check if ransomwareList is an array and has items
                        ransomwareList.map(ransomware => (
                            <tr key={ransomware.id}>
                                <td>{ransomware.name.join(', ')}</td>
                                <td>{ransomware.extensions}</td>
                                <td>{ransomware.encryptionAlgorithm}</td>
                                <td>
                                    <Button variant="warning" onClick={() => openModal(ransomware)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(ransomware)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No records found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for Add/Edit */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRansomware ? 'Edit Ransomware' : 'Add Ransomware'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {duplicateError && (
                        <div className="alert alert-danger" role="alert">
                            {duplicateError}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter ransomware names (comma separated)"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Extensions</Form.Label>
                            <Form.Control
                                type="text"
                                name="extensions"
                                value={formData.extensions}
                                onChange={handleInputChange}
                                placeholder="Enter file extensions"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Encryption Algorithm</Form.Label>
                            <Form.Control
                                type="text"
                                name="encryptionAlgorithm"
                                value={formData.encryptionAlgorithm}
                                onChange={handleInputChange}
                                placeholder="Enter encryption algorithm"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {currentRansomware ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default RansomwareDashboard;
