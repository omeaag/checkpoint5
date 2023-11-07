const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());

const connectionString = process.env.CONNECTION_URL;
const pool = new Pool({ connectionString });
let client;

async function connectDB() {
  client = await pool.connect();
  console.log("Successfully connected to db!");
}

// Create Car
app.post("/create-car", async (req, res) => {
  const { car_name, owner_id } = req.body;
  const query = `
  INSERT INTO cars (car_name, owner_id) VALUES ($1, $2) RETURNING *
  `;
  const values = [car_name, owner_id];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json(result.rows[0]);
});

// Delete Car
app.delete("/delete-car/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
  DELETE FROM cars WHERE id=$1 RETURNING *
  `;
  const values = [id];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json({ message: `Car ${id} deleted successfully.` });
});

// Create Person
app.post("/create-person", async (req, res) => {
  const { fullname } = req.body;

  const query = `
  INSERT INTO persons (fullname) VALUES ($1) RETURNING *
  `;

  const values = [fullname];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json(result.rows[0]);
});

// Delete Person
app.delete("/delete-persons/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
  DELETE FROM persons WHERE id=$1 RETURNING *
  `;
  const values = [id];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json({ message: `Person ${id} deleted successfully.` });
});

// Sell Car (Update Car's owner)
app.put("/car/:id/sell/:owner_id", async (req, res) => {
  const { id, owner_id } = req.params;
  const query = `UPDATE cars SET owner_id = $1 WHERE id = $2 RETURNING *`;

  const values = [id, owner_id];

  const client = await pool.connect();
  const result = await client.query(query, values);
  client.release();

  res.json({ message: `car sold to ${owner_id} successfuly` });
});

// Get All Cars
app.get("/get-all-car", async (req, res) => {
  const query = `
    SELECT * FROM cars
  `;

  const client = await pool.connect();
  const result = await client.query(query);
  client.release();

  res.json(result.rows);
});

// Get All Cars with Owners
app.get("/carsOwners", async (req, res) => {
  const query = `
  SELECT c.car_name, p.fullname AS owner_name FROM cars c LEFT JOIN persons p ON c.owner_id = p.id
  `;

  const client = await pool.connect();
  const result = await client.query(query);
  client.release();

  res.json(result.rows);
});

// server start
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
