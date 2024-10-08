import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const RansomwareDashboard = () => {
    const [ransomwareList, setRansomwareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // eslint-disable-next-line
    const [duplicateError, setDuplicateError] = useState(null);  // To track duplicate errors
    const [showModal, setShowModal] = useState(false);
    const [isAdding, setIsAdding] = useState(true);  // Declare and initialize 'isAdding'
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
            const response = await axios.get('http://localhost:5000/api/ransomware');
            setRansomwareList(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching data');
            setLoading(false);
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
            const dataToSubmit = {...formData, name: nameArray };

            if (currentRansomware) {
                // Update record
                await axios.put(`http://localhost:5000/api/ransomware/${currentRansomware._id}`, dataToSubmit, {
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
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record? \nID: " + id);
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/ransomware/${id}`);
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
                    {ransomwareList.map(ransomware => (
                        <tr key={ransomware._id}>
                            <td>{ransomware.name.join(', ')}</td>
                            <td>{ransomware.extensions}</td>
                            <td>{ransomware.encryptionAlgorithm}</td>
                            <td>
                                <Button variant="warning" onClick={() => openModal(ransomware)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(ransomware._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
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
