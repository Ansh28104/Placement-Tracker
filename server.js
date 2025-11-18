const express = require('express');
const { connectDB, mongoose } = require('./db');

const app = express();
app.use(express.json());

connectDB().catch(err => {
  console.error('DB connection error:', err);
  process.exit(1);
});

// simple schema + route
const Item = mongoose.model('Item', new mongoose.Schema({ name: String }));

app.post('/items', async (req, res) => {
  const it = new Item({ name: req.body.name });
  await it.save();
  res.status(201).json(it);
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));