const validateRansomware = (req, res, next) => {
    const { name, extensions } = req.body;
    if (!name || !Array.isArray(name) || name.length === 0) {
        return res.status(400).json({ message: 'Name is required and should be an array.' });
    }
    if (!extensions || typeof extensions !== 'string') {
        return res.status(400).json({ message: 'Extensions field is required and must be a string.' });
    }
    next(); // If validation passes, proceed to the next middleware or route handler
};

module.exports = validateRansomware;
