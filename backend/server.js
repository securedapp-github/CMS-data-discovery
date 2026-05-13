require('dotenv').config();
const express = require('express');
const cors = require('cors');

const parseSchema = require('./parser');
const mapFields = require('./mapper');

const app = express();

app.use(cors());
app.use(express.json());
const { DATA_CATALOGUE } = require('./constants');

const PORT = 5001;

app.get('/api/catalogue', (req, res) => {
  res.json({ catalogue: DATA_CATALOGUE });
});

app.post('/api/discovery', async (req, res) => {

  try {

    const { schemaRaw, dbType } = req.body;

    if (!schemaRaw) {
      return res.status(400).json({
        error: 'No schema provided'
      });
    }

    // STEP 1 — Parse schema
    const parsedFields = parseSchema(schemaRaw, dbType);
    // console.log("parsedFields : ", parsedFields);

    // STEP 2 — Map fields
    const mappings = await mapFields(parsedFields);

    // STEP 3 — Return response
    res.json({
      mappings
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Discovery failed',
      details: error.message
    });
  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});