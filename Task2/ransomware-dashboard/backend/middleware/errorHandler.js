const errorHandler = (err, req, res, next) => {
    console.error(err.message || err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message || err });
};

module.exports = errorHandler;
