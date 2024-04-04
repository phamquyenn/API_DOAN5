var express = require('express');
var router = express.Router();
var connection = require('./dataconnect');
const verifyToken = require('./middleware');

router.get('/getall', function(req, res, next) {
    var sql = "CALL GetOrderDetails()";  
    connection.query(sql, function (err, results){
        if(err) {
            console.error('Lỗi truy vấn dữ liệu:', err);
            return res.status(500).jsonp({ error: 'Lỗi máy chủ.' });
        }
        res.jsonp(results[0]);
    });
});

module.exports = router;
