const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Truy cập bị từ chối. Không có mã thông báo được cung cấp.' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
