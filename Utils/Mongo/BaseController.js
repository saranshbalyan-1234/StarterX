import getError from '#utils/error.js';

class BaseController {
  constructor (schema) {
    this.schema = schema;

    // Automatically bind methods to this instance
    this.createFromSchema = this.createFromSchema.bind(this);
    this.deleteManyFromSchema = this.deleteManyFromSchema.bind(this);
    this.deleteOneFromSchema = this.deleteOneFromSchema.bind(this);
    this.findManyFromSchema = this.findManyFromSchema.bind(this);
    this.findOneFromSchema = this.findOneFromSchema.bind(this);
    this.updateManyFromSchema = this.updateManyFromSchema.bind(this);
    this.updateOneFromSchema = this.updateOneFromSchema.bind(this);
  }

  async createFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].create(req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  }

  async deleteManyFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].deleteMany(req.params);
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  }

  async deleteOneFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].deleteOne(req.params);
      return res.status(200).json(result);
    } catch (error) {
      getError(error, res);
    }
  }

  findManyFromSchema (req, res) {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.write('['); // Start of JSON array

      let isFirst = true;
      const cursor = req.models[this.schema].find(req.params).cursor();

      cursor.on('data', (doc) => {
        if (!isFirst) {
          res.write(','); // Add a comma between JSON objects
        }
        res.write(JSON.stringify(doc));
        isFirst = false;
      });

      cursor.on('end', () => {
        res.write(']'); // End of JSON array
        res.end();
      });

      cursor.on('error', (err) => {
        res.status(500).json({ error: err.message });
      });

      req.on('close', () => {
        cursor.close();
      });
    } catch (err) {
      getError(err, res);
    }
  }

  async findOneFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].findOne(req.params);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  }

  async updateManyFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].updateMany(req.params, req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  }

  async updateOneFromSchema (req, res) {
    try {
      const result = await req.models[this.schema].updateOne(req.params, req.body);
      return res.status(200).json(result);
    } catch (err) {
      getError(err, res);
    }
  }
}

export default BaseController;
