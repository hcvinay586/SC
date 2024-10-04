import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RansomwareDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ransomware');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Ransomware Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Extension</th>
                        <th>Encryption Algorithm</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((ransomware) => (
                        <tr key={ransomware._id}>
                            <td>{ransomware.name.join(', ')}</td>
                            <td>{ransomware.extensions}</td>
                            <td>{ransomware.encryptionAlgorithm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RansomwareDashboard;
