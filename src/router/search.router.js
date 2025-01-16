const express = require("express");
const mysql = require("mysql2");
const searchRouter = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'travels-web',
  port: 3307,
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
});

// API tìm kiếm
searchRouter.get('/search', (req, res) => {
  const { search } = req.query; // Lấy giá trị từ query string
  console.log(search);

/* if (!search) {
    return res.status(400).json({ message: 'Search query is required' });
  }
*/
  // SQL tìm kiếm trong 3 bảng
  const searchQuery = `
        SELECT 'location' AS source, id, title, address FROM location WHERE title LIKE ? OR address LIKE ?
        UNION
        SELECT 'hotels' AS source, id, title, address FROM hotels WHERE title LIKE ? OR address LIKE ?
        UNION
        SELECT 'restaurants' AS source, id, title, address FROM restaurants WHERE title LIKE ? OR address LIKE ?;
    `;

  const searchTerm = `%${search}%`;

  connection.query(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error searching database' });
    }

    // Trả về kết quả tìm kiếm
    res.json(results);
    console.log(results);
  });
});

module.exports = searchRouter;
