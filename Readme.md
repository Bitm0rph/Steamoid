#  Streamoid Product Catalog Backend

A backend service that allows uploading, validating, searching and managing product data from CSV files.  
Built using **Node.js + Express + SQLite** for the **Streamoid Backend** take-home assignment.

---

##  Features

- Upload CSV files containing product data.
- Parse and validate rows before storing.
- Store valid products in SQLite.
- List all products with pagination.
- Search and filter products by brand, color, size and price range.
- Easy setup and Docker support.

---

##  Tech Stack

- **Backend:** Node.js + Express  
- **Database:** SQLite 
- **File Parsing:** Multer + csv-parser  
- **Environment Variables:** dotenv  

---

##  Folder Structure

```bash
streamoid/
├── public/
│   └── uploads/ # Uploaded CSV files
├── src/
│   ├── controllers/ # Controller logic
│   │   └── product.controller.js
│   ├── db/ # Database connection
│   │   └── db.js
│   ├── middlewares/ # Custom middlewares
│   │   └── multer.middleware.js
│   ├── table/ # Product table definition
│   │   └── product.table.js
│   ├── routes/ # API route definitions
│   │   └── product.route.js
│   ├── utils/ # Helpers and utilities
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── AsyncHandler.js
│   ├── app.js # Express app setup
│   └── index.js # Entry point
├── .env
├── .gitignore
├── Dockerfile
├── package.json
├── products.db # SQLite DB
└── README.md
``````

---

##  Setup

```bash
# install dependencies
npm install

# start the server
npm start

Server runs on http://localhost:8000

# 📦 API Endpoints
1.⁠ ⁠Upload Products (CSV):

POST /upload
	⁠Upload a CSV with columns: 
sku,name,brand,color,size,mrp,price,quantity
	⁠Validates each row (price <= mrp, no missing fields)
	⁠Inserts valid data, reports invalid ones

# Sample Response
{
  "stored": 20,
  "failed": []
}


2.⁠ ⁠List Products
GET /products?page=1&limit=10
Returns paginated products list.

# Response
{
  "page": 1,
  "limit": 10,
  "total": 20,
  "products": [ ... ]
}

3.⁠ ⁠Search Products
GET /products/search?brand=BloomWear&minPrice=100&maxPrice=2000
Filter by brand, color, or price range with pagination.


 Testing
# Run Jest unit tests
npm test

# Test with Postman
1.⁠ ⁠Set baseUrl = http://localhost:8000
2.⁠ ⁠Run requests:
/upload (upload CSV)
/products (list)
/products/search (filter)


#  Run with Docker
docker build -t streamoid .
docker run -d -p 8000:8000 --env-file .env streamoid