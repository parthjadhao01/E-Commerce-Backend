import CurrencyRate from "../models/product/CurrencyRateModel.js";

export const createCurrencyRate = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, rate, validFrom, validTo } = req.body;
    if (!fromCurrency || !toCurrency || rate === undefined) {
      return res
        .status(400)
        .json({ message: "fromCurrency, toCurrency, and rate are required" });
    }
    const currencyRate = await CurrencyRate.create({
      fromCurrency,
      toCurrency,
      rate,
      validFrom,
      validTo,
    });
    res.status(201).json(currencyRate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrencyRates = async (req, res) => {
  try {
    const rates = await CurrencyRate.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrencyRate = async (req, res) => {
  try {
    const rate = await CurrencyRate.findById(req.params.id);
    if (!rate)
      return res.status(404).json({ message: "Currency rate not found" });
    res.json(rate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCurrencyRate = async (req, res) => {
  try {
    const { rate, validFrom, validTo } = req.body;
    const currencyRate = await CurrencyRate.findById(req.params.id);
    if (!currencyRate)
      return res.status(404).json({ message: "Currency rate not found" });
    if (rate !== undefined) currencyRate.rate = rate;
    if (validFrom) currencyRate.validFrom = validFrom;
    if (validTo) currencyRate.validTo = validTo;
    await currencyRate.save();
    res.json(currencyRate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCurrencyRate = async (req, res) => {
  try {
    const currencyRate = await CurrencyRate.findByIdAndDelete(req.params.id);
    if (!currencyRate)
      return res.status(404).json({ message: "Currency rate not found" });
    res.json({ message: "Currency rate deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
