// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import cors from "cors";

import connectDB from "./db/connections/DBConnectionUtil.js";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import dotenv from "dotenv";
dotenv.config();
import shopifySessionRoute from "./routes/ShopifySessions.js";
import discountRoute from "./routes/DiscountRoute.js";
import customizationRoute from "./routes/CustomizationRoute.js";
import Customization from "./db/models/Customizations.js";
import { json_style_data } from "./frontend/Static/General_settings.js";
import axios from "axios";
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
const databaseUrl = process.env.MONGO_DB_CLOUD_URL;
const databaseName = process.env.DATABASE_NAME;
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);
app.use(express.json());
app.use(cors());
// router.get("/shopify_session_data", DashBoardController.shopifySessions);
app.use("/", shopifySessionRoute);
app.use("/", discountRoute);
app.use("/", customizationRoute);

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

// Enable CORS only for specific routes
app.use("/api/*", cors());

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/getProducts", async (_req, res) => {
  const productData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
    fields: "id,image,title",
  });
  res.status(200).send(productData);
});

// Endpoint to fetch price rules
app.get("/api/pricerules", async (_req, res) => {
  const discountData = await shopify.api.rest.PriceRule.all({
    session: res.locals.shopify.session,
  });
  return res.json(discountData);
});

// app.get("/api/getDiscounts", async (_req, res) => {
//   const discountData = await shopify.api.rest.PriceRule.count({
//   session: res.locals.shopify.session,
// });
//   res.status(200).send(discountData);
// });

// INITDATA SAVE FUNCTION
async function SaveInitCustomizationSettings(shop) {
  const customizationSettings = await Customization.findOne({ shop });

  if (customizationSettings) {
    // Entry with the same shop already exists, if data is null ,update it
    try {
      if (
        customizationSettings.customizations_json &&
        customizationSettings.customizations_json === ""
      ) {
        customizationSettings.customizations_json =
          JSON.stringify(json_style_data);
      }
      await customizationSettings.save();
      console.log("Customization settings updated successfully");
    } catch (error) {
      console.error("Error updating customizationSettings: ", error);
    }
  } else {
    //  Entry with the shop doesn't exist, create a new one
    const customizationSettingsData = {
      shop: shop,
      customizations_json: JSON.stringify(json_style_data),
    };

    try {
      const saveData = new Customization(customizationSettingsData);
      await saveData.save();
      console.log("Customization settings saved successfully");
    } catch (error) {
      console.error("Error updating customizationSettings: ", error);
    }
  }
}

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  // Assuming that `res.locals.shopify.session` contains the shop information
  const shopName = _req.query.shop;
  console.log("Shop Name:", shopName);
  SaveInitCustomizationSettings(shopName);

  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

if (3000 && databaseUrl && databaseName) {
  app.listen(Number(3000), () => {
    connectDB();
    console.log(`Express server is Started at 3000`);
  });
}

app.listen(PORT);
