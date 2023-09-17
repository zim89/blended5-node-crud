const ToyModel = require('../models/toyModel');
const asyncHandler = require('express-async-handler');

class ToysController {
  create = asyncHandler(async (req, res) => {
    const { title, price } = req.body;
    if (!title || !price) {
      res.status(400);
      throw new Error('Title and Price is required');
    }

    const toy = await ToyModel.create({ ...req.body });

    if (!toy) {
      res.status(400);
      throw new Error('Unable to safe in DB');
    }
    res.status(201).json({ code: 201, data: toy });
  });

  findAll = asyncHandler(async (req, res) => {
    const toys = await ToyModel.find({});
    if (!toys) {
      res.status(400);
      throw new Error('Unable to fetch');
    }

    res.status(200).json({ code: 200, data: toys, quantity: toys.length });
  });

  findOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const toy = await ToyModel.findById(id).select('-_id');

    if (!toy) {
      res.status(404);
      throw new Error(`Toy with ${id} not found`);
    }

    res.status(200).json({ code: 200, data: toy });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const toy = await ToyModel.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });
    if (!toy) {
      res.status(404);
      throw new Error(`Toy with ${id} not found`);
    }

    res.status(200).json({ code: 200, data: toy });
  });

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const toy = await ToyModel.findByIdAndRemove(id);
    if (!toy) {
      res.status(404);
      throw new Error(`Toy with ${id} not found`);
    }

    res.status(200).json({ code: 200, data: toy });
  });
}

module.exports = new ToysController();
