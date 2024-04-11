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
router.post('/checkout_COD', (req, res) => {
    const { customer_id, order_date, total_price, status, products } = req.body;

    // Thêm đơn hàng vào bảng Orders
    connection.query('INSERT INTO Orders (customer_id, order_date, total_price, status) VALUES (?, ?, ?, ?)',
        [customer_id, order_date, total_price, status],
        (err, result) => {
            if (err) throw err;

            const orderId = result.insertId;

            // Thêm chi tiết đơn hàng vào bảng OrderDetails
            products.forEach(product => {
                connection.query('INSERT INTO OrderDetails (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, product.product_id, product.quantity, product.unit_price, product.total_price],
                    (err, result) => {
                        if (err) throw err;
                    });
            });

            res.send('Đơn hàng đã được thêm thành công.');
        });
});


module.exports = router;
