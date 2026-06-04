import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export async function getAllProducts(req, res) {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getSingleProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const location = await db
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!location) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function createProduct(req, res) {
  try {
    const db = getDb();
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      team: req.body.team,
      year: req.body.year,
      sizes: req.body.sizes,
    };

    const response = await db.collection('products').insertOne(newProduct);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Creation failed.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function updateProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      team: req.body.team,
      year: req.body.year,
      sizes: req.body.sizes,
    };

    const response = await db
      .collection('products')
      .replaceOne({ _id: new ObjectId(req.params.id) }, updatedProduct);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: 'Product not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const db = getDb();
    const response = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
