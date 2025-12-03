import paymentTransactionRoutes from "./routes/paymentTransactionRoutes.js";

import orderRoutes from "./routes/orderRoutes.js";

import orderSummaryRoutes from "./routes/orderSummaryRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";

import userAddressRoutes from "./routes/userAddressRoutes.js";
import shippingRuleRoutes from "./routes/shippingRuleRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import couponRoutes from "./routes/couponRoutes.js";
import autoDiscountRoutes from "./routes/autoDiscountRoutes.js";
import buyXGetYRoutes from "./routes/buyXGetYRoutes.js";
import flashSaleRoutes from "./routes/flashSaleRoutes.js";
import comboOfferRoutes from "./routes/comboOfferRoutes.js";
import loyaltyRewardRoutes from "./routes/loyaltyRewardRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// routes

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import attributeRoutes from "./routes/attributeRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import stockLogRoutes from "./routes/stockLogRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import taxRuleRoutes from "./routes/taxRuleRoutes.js";
import currencyRateRoutes from "./routes/currencyRateRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import partialPaymentRoutes from "./routes/paymentTransaction/partialPaymentRoutes.js";
import walletRoutes from "./routes/paymentTransaction/walletRoutes.js";
import paymentCallbackRoutes from "./routes/paymentTransaction/paymentCallbackRoutes.js";
import orderHistoryRoutes from "./routes/orderHistory/orderHistoryRoutes.js";
import orderReturnRoutes from "./routes/orderHistory/orderReturnRoutes.js";
import orderReplacementRoutes from "./routes/orderHistory/orderReplacementRoutes.js";

//dotenv config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
// ✅ Allow all origins and handle preflight requests safely (Express 5+)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // handle preflight cleanly
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});



// routers login import
app.use("/api/user", authRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api", userRoutes);

// protected admin routes (mount specific routes BEFORE the catch-all /api/admin)
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/brands", brandRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/attributes", attributeRoutes);
app.use("/api/admin/variants", variantRoutes);
app.use("/api/admin/gallery", galleryRoutes);
app.use("/api/admin/stock-logs", stockLogRoutes);
app.use("/api/admin/tags", tagRoutes);
app.use("/api/admin/faqs", faqRoutes);
app.use("/api/admin/seo", seoRoutes);
app.use("/api/admin/pricing", pricingRoutes);
app.use("/api/admin/tax-rules", taxRuleRoutes);
app.use("/api/admin/currency-rates", currencyRateRoutes);

// Offer routes - MUST be BEFORE the catch-all /api/admin route
app.use("/api/admin/coupons", couponRoutes);
app.use("/api/admin/auto-discounts", autoDiscountRoutes);
app.use("/api/admin/buy-x-get-y", buyXGetYRoutes);
app.use("/api/admin/flash-sales", flashSaleRoutes);
app.use("/api/admin/combo-offers", comboOfferRoutes);
app.use("/api/admin/loyalty-rewards", loyaltyRewardRoutes);

// Shipping routes - MUST be BEFORE the catch-all /api/admin route
app.use("/api/admin/shipping-rules", shippingRuleRoutes);

// General admin routes (catch-all for /api/admin/*) - must be AFTER specific routes
app.use("/api/admin", adminRoutes);

//cart routes
app.use("/api/cart", cartRoutes);

// user address routes
app.use("/api/user/addresses", userAddressRoutes);
app.use("/api/admin/payment-methods", paymentMethodRoutes);

// order summary routes
app.use("/api/order-summaries", orderSummaryRoutes);

// order routes
app.use("/api/orders", orderRoutes);

// payment transaction routes
app.use("/api/payment-transactions", paymentTransactionRoutes);

// payment transaction sub-routes
app.use("/api/partial-payments", partialPaymentRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/payment-callbacks", paymentCallbackRoutes);

// order history routes
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/order-returns", orderReturnRoutes);
app.use("/api/order-replacements", orderReplacementRoutes);

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB.",
        error: err.message,
      });
    }
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  // Handle custom multer file filter errors
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      message: err.message,
      error: "Please upload only JPEG, PNG, GIF, WEBP, or SVG images.",
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

//start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        "Swagger UI is available at  http://localhost:" + PORT + "/api-docs"
      );
      console.log("Connected to the database successfully");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  });
