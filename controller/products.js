var express = require('express');
var router = express.Router();
var connection = require('./dataconnect');
// const pageController = require('./pageController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Thiết lập storage cho multer 

const storage = multer.diskStorage({
    destination: './uploads/products/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product_image-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Chỉ cho phép tải lên các file ảnh'));
        }
        cb(null, true);
    }
});
//  ADMIN
router.get('/getall', function(req, res, next) {
    var sql = "SELECT * FROM products";
    connection.query(sql, function (err, results){
        if(err) throw err;
        res.jsonp(results);
    });
});

// GET ONCE 
router.get('/getonce/:id', function(req, res, next) {
    const Id = req.params.id;
    const sql = "SELECT * FROM products WHERE product_id = ?";
    
    connection.query(sql, [Id], function (err, results) {
        if (err) {
            console.error("Lỗi thực hiện truy vấn dữ liệu:", err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        res.jsonp(results);
    });
});
// ADD 

router.post('/addproduct', upload.single('product_image'), (req, res) => {
    const {
        product_name, description, brand, price, quantity, volume, fragrance_family,
        fragrance_notes, gender, category_id, brand_id
    } = req.body;

    if (!product_name) {
        return res.status(400).json({ error: "Tên sản phẩm là bắt buộc" });
    }

    // Lấy dữ liệu ảnh từ req.file
    const product_image = req.file ? req.file.filename : null;

    const sql = `CALL AddProduct(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
        sql, [
            product_name, description, brand, price, quantity, volume, fragrance_family,
            fragrance_notes, gender, product_image, category_id, brand_id
        ],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi thêm sản phẩm:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            res.json({ message: "Sản phẩm đã được thêm thành công!" });
        }
    );
});

// Lấy ảnh khi được uploads
router.get('/getproductimage/:filename', (req, res) => {
    const fileName = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/products', fileName);
    res.sendFile(imagePath);
});
// UPDATE 
router.put('/updateproduct/:id', upload.single('product_image'), (req, res) => {
    const productId = req.params.id;
    const {
        product_name, description, brand, price, quantity, volume, fragrance_family,
        fragrance_notes, gender, category_id, brand_id
    } = req.body;

    const product_image = req.file ? req.file.filename  : null; 

    const sql = `CALL UpdateProduct(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
        sql, [
            productId, product_name, description, brand, price, quantity,
            volume, fragrance_family, fragrance_notes, gender, product_image, category_id, brand_id
        ],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi cập nhật sản phẩm:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            res.json({ message: "Sản phẩm đã được cập nhật thành công!" });
        }
    );
});
// DELETE

router.delete('/deleteproduct/:id', (req, res) => {
    const productId = req.params.id;

    const sql = `CALL DeleteProduct(?)`;
    connection.query(
        sql, [productId],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }

            res.json({ message: "Sản phẩm đã được xóa thành công!" });
        }
    );
});
// SEARCH

router.get('/searchproducts/:letter', (req, res) => {
    const startingLetter = req.params.letter;

    const sql = `CALL SearchProductsByLetter(?)`;
    connection.query(
        sql, [startingLetter],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi tìm kiếm sản phẩm:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            res.json(results[0]); 
        }
    );
});
// TÌM THỂ LOẠI RA SẢN PHẨM
router.get('/getproductsbycategory/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;

    const sql = `CALL GetProductsByCategory(?)`;
    connection.query(
        sql, [categoryName],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi lấy thông tin sản phẩm theo danh mục:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            res.json(results[0]); 
        }
    );
});
//  USER

// NEW PRODUCTS
router.get('/new', function(req, res, next) {
    var sql = "CALL GetNewProducts;";
    
    connection.query(sql, function (err, results){
        if(err) throw err;
        res.jsonp(results);
    });
  //   res.send('ham get all');
  });
//   PRODUCT BESTSALE
  router.get('/bestsale', function(req, resbc, next) {
    var sqlbc = "CALL GetBestSellingProducts "; 
    
    connection.query(sqlbc, function (err, results){
        if(err) throw err;
        resbc.jsonp(results);
    });
  });
  // SALE PRODUCT
  router.get('/sale', function(req, resbc, next) {
    var sqlsale = "CALL Get_sp_bestseller(); "; 
    
    connection.query(sqlsale, function (err, results){
        if(err) throw err;
        resbc.jsonp(results);
    });
  });


module.exports = router;