import ProductPricing from "../models/product/ProductPricingModel.js";
import TierPricing from "../models/product/TierPricingModel.js";
import SpecialPricing from "../models/product/SpecialPricingModel.js";
import mongoose from "mongoose";

// Product Pricing CRUD
export const createProductPricing = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      basePrice,
      discountType,
      discountValue,
      currency,
      status,
    } = req.body;
    if (!productId || basePrice === undefined) {
      return res
        .status(400)
        .json({ message: "productId and basePrice are required" });
    }

    // Calculate final price
    let finalPrice = basePrice;
    if (discountValue && discountValue > 0) {
      if (discountType === "percent") {
        finalPrice = basePrice - (basePrice * discountValue) / 100;
      } else {
        finalPrice = basePrice - discountValue;
      }
    }

    const pricing = await ProductPricing.create({
      productId,
      variantId: variantId || null,
      basePrice,
      discountType: discountType || "flat",
      discountValue: discountValue || 0,
      finalPrice,
      currency: currency || "INR",
      status: status !== undefined ? status : true,
    });
    res.status(201).json(pricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProductPricings = async (req, res) => {
  try {
    const { productId, variantId } = req.query;

    const filter = {};

    if (productId) filter.productId = productId;

    // Only apply variantId filter if a real value is provided
    if (variantId && variantId !== "null" && variantId !== "undefined" && variantId !== "") {
      filter.variantId = variantId;
    }

    const pricings = await ProductPricing.find(filter);
    res.json(pricings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const getProductPricings = async (req, res) => {
//   try {
//     const { variantId } = req.query;

    
//     const id = new mongoose.Types.ObjectId(variantId)
//     const pricings = await ProductPricing.find(id);
//     res.json(pricings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getProductPricing = async (req, res) => {
  try {
    const pricing = await ProductPricing.findById(req.params.id);
    if (!pricing) return res.status(404).json({ message: "Pricing not found" });
    res.json(pricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProductPricing = async (req, res) => {
  try {
    const {
      basePrice,
      discountType,
      discountValue,
      currency,
      status,
    } = req.body;
    const pricing = await ProductPricing.findById(req.params.id);
    if (!pricing) return res.status(404).json({ message: "Pricing not found" });

    if (basePrice !== undefined) pricing.basePrice = basePrice;
    if (discountType !== undefined) pricing.discountType = discountType;
    if (discountValue !== undefined) pricing.discountValue = discountValue;
    if (currency !== undefined) pricing.currency = currency;
    if (status !== undefined) pricing.status = status;

    // Recalculate final price
    let finalPrice = pricing.basePrice;
    if (pricing.discountValue && pricing.discountValue > 0) {
      if (pricing.discountType === "percent") {
        finalPrice =
          pricing.basePrice - (pricing.basePrice * pricing.discountValue) / 100;
      } else {
        finalPrice = pricing.basePrice - pricing.discountValue;
      }
    }
    pricing.finalPrice = finalPrice;

    await pricing.save();
    res.json(pricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductPricing = async (req, res) => {
  try {
    const pricing = await ProductPricing.findByIdAndDelete(req.params.id);
    if (!pricing) return res.status(404).json({ message: "Pricing not found" });
    res.json({ message: "Pricing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tier Pricing CRUD
export const createTierPricing = async (req, res) => {
  try {
    const { productId, variantId, minQty, maxQty, price } = req.body;
    console.log("Creating tier pricing with data:", req.body);
    if (
      !productId ||
      minQty === undefined ||
      maxQty === undefined ||
      price === undefined
    ) {
      return res
        .status(400)
        .json({ message: "productId, minQty, maxQty, and price are required" });
    }
    const tierData = {
      productId,
      minQty,
      maxQty,
      price,
    };

    // Only include variantId if it's provided
    if (variantId) {
      tierData.variantId = variantId;
    }

    console.log("Tier data to create:", tierData);
    const tier = await TierPricing.create(tierData);
    console.log("Tier pricing created successfully:", tier._id);
    res.status(201).json(tier);
  } catch (err) {
    console.error("Error in createTierPricing:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getTierPricings = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    console.log("Fetching tier pricings with filter:", filter);
    const tiers = await TierPricing.find(filter);
    console.log("Found tier pricings:", tiers.length);
    res.json(tiers);
  } catch (err) {
    console.error("Error in getTierPricings:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getTierPricing = async (req, res) => {
  try {
    const tier = await TierPricing.findById(req.params.id);
    if (!tier)
      return res.status(404).json({ message: "Tier pricing not found" });
    res.json(tier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTierPricing = async (req, res) => {
  try {
    const { variantId, minQty, maxQty, price } = req.body;
    const tier = await TierPricing.findById(req.params.id);
    if (!tier)
      return res.status(404).json({ message: "Tier pricing not found" });
    if (variantId !== undefined) tier.variantId = variantId;
    if (minQty !== undefined) tier.minQty = minQty;
    if (maxQty !== undefined) tier.maxQty = maxQty;
    if (price !== undefined) tier.price = price;
    await tier.save();
    res.json(tier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTierPricing = async (req, res) => {
  try {
    const tier = await TierPricing.findByIdAndDelete(req.params.id);
    if (!tier)
      return res.status(404).json({ message: "Tier pricing not found" });
    res.json({ message: "Tier pricing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Special Pricing CRUD
export const createSpecialPricing = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      specialPrice,
      startDate,
      endDate,
      status,
    } = req.body;
    console.log("Creating special pricing with data:", req.body);
    if (!productId || specialPrice === undefined || !startDate || !endDate) {
      return res
        .status(400)
        .json({
          message:
            "productId, specialPrice, startDate, and endDate are required",
        });
    }

    const specialData = {
      productId,
      specialPrice,
      startDate,
      endDate,
      status: status !== undefined ? status : true,
    };

    // Only include variantId if it's provided
    if (variantId) {
      specialData.variantId = variantId;
    }

    console.log("Special pricing data to create:", specialData);
    const special = await SpecialPricing.create(specialData);
    console.log("Special pricing created successfully:", special._id);
    res.status(201).json(special);
  } catch (err) {
    console.error("Error in createSpecialPricing:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getSpecialPricings = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    console.log("Fetching special pricings with filter:", filter);
    const specials = await SpecialPricing.find(filter);
    console.log("Found special pricings:", specials.length);
    res.json(specials);
  } catch (err) {
    console.error("Error in getSpecialPricings:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getSpecialPricing = async (req, res) => {
  try {
    const special = await SpecialPricing.findById(req.params.id);
    if (!special)
      return res.status(404).json({ message: "Special pricing not found" });
    res.json(special);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSpecialPricing = async (req, res) => {
  try {
    const { variantId, specialPrice, startDate, endDate, status } = req.body;
    const special = await SpecialPricing.findById(req.params.id);
    if (!special)
      return res.status(404).json({ message: "Special pricing not found" });
    if (variantId !== undefined) special.variantId = variantId;
    if (specialPrice !== undefined) special.specialPrice = specialPrice;
    if (startDate) special.startDate = startDate;
    if (endDate) special.endDate = endDate;
    if (status !== undefined) special.status = status;
    await special.save();
    res.json(special);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSpecialPricing = async (req, res) => {
  try {
    const special = await SpecialPricing.findByIdAndDelete(req.params.id);
    if (!special)
      return res.status(404).json({ message: "Special pricing not found" });
    res.json({ message: "Special pricing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
