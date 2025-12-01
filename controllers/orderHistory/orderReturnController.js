import OrderReturn from "../../models/orderHistory/OrderReturnModel.js";

const orderReturnController = {
  async create(req, res) {
    try {
      const entry = new OrderReturn(req.body);
      await entry.save();
      res.status(201).json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async getAll(req, res) {
    try {
      const entries = await OrderReturn.find();
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const entry = await OrderReturn.findById(req.params.id);
      if (!entry) return res.status(404).json({ error: "Not found" });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const entry = await OrderReturn.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!entry) return res.status(404).json({ error: "Not found" });
      res.json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const entry = await OrderReturn.findByIdAndDelete(req.params.id);
      if (!entry) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default orderReturnController;
