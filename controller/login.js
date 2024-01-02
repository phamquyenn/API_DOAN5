var express = require('express');
var router = express.Router();
var connection = require('./dataconnect');
const bcrypt = require('bcrypt');

router.post('/getlogin', function(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).jsonp({ error: 'Email and password are required.' });
    }
    var sql = "SELECT * FROM accounts WHERE email = ? AND password = ?";
    connection.query(sql, [email, password], function (err, results) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).jsonp({ error: 'Internal server error.' });
        }
        if (results.length === 0) {
            return res.status(401).jsonp({ error: 'Invalid email or password.' });
        }
        res.jsonp(results);
    });
});
router.get('/getall', function(req, res, next) {
    var sql = "SELECT * FROM accounts ";
    connection.query(sql, function (err, results){
        if(err) throw err;
        res.jsonp(results);
    });
  }); 

//  Register


router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO accounts (username, email, password, role) VALUES (?, ?, ?, ?)';
    const results = await new Promise((resolve, reject) => {
      connection.query(query, [username, email, hashedPassword, role], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    res.status(201).json({
      id: results.insertId,
      status: true
    });
  } catch (error) {
    console.error('Lỗi đăng ký tài khoản:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      status: false
    });
  }
});

// router.post('/register', function(req, res, next) {
//     var formData =req.body;
//     var sql = "INSERT INTO accounts set?";
//     connection.query(sql, [formData],function (err, results){
//         if(err){
//             res.send({
//                 results: err.sqlMessage,
//                 status: false
//             })
//         }
//         else{
//             formData.id = data.inserId;
//             res.send({
//                 result: formData,
//                 status: true

//             })
//         }
        
//     });
// });
module.exports = router;
