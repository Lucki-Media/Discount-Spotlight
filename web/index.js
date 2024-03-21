// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import cors from "cors";

import connectDB from "./db/connections/DBConnectionUtil.js";
import shopify from "./shopify.js";
import productCreator from "./graphQL/product-creator.js";
import getFilterProducts from "./graphQL/getFilterProducts.js";
import getPrevPageProducts from "./graphQL/getPrevPageProducts.js";
import getNextPageProducts from "./graphQL/getNextPageProducts.js";
import getProducts from "./graphQL/getProducts.js";
import GDPRWebhookHandlers from "./gdpr.js";
import dotenv from "dotenv";
dotenv.config();
import shopifySessionRoute from "./routes/ShopifySessions.js";
import discountRoute from "./routes/DiscountRoute.js";
import customizationRoute from "./routes/CustomizationRoute.js";
import countRoute from "./routes/CountRoute.js";
import ShopifySessions from "./db/models/ShopifySessions.js";
import Customization from "./db/models/Customizations.js";
import Charge from "./db/models/Charges.js";
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
app.use("/", countRoute);

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

// DISCOUNT PAGE GRAPHQL API START
app.get("/api/getPriceRules", async (_req, res) => {
  const discountData = await shopify.api.rest.PriceRule.all({
    session: res.locals.shopify.session,
  });
  return res.json(discountData);
  // let status = 200;
  // let error = null;

  // try {
  //   const response = await getPriceRules(res.locals.shopify.session);
  //   res.status(status).send({ success: status === 200, response });
  // } catch (e) {
  //   console.log(`Failed to getPriceRules: ${e.message}`);
  //   status = 500;
  //   error = e.message;
  //   res.status(status).send({ success: status === 200, error });
  // }
});

app.get("/api/getProducts", async (_req, res) => {
  //   const productData = await shopify.api.rest.Product.all({
  //     session: res.locals.shopify.session,
  //     fields: "id,image,title",
  //   });
  //   res.status(200).send(productData);
  let status = 200;
  let error = null;

  try {
    const response = await getProducts(res.locals.shopify.session);
    res.status(status).send({ success: status === 200, response });
  } catch (e) {
    console.log(`Failed to getProducts: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});

app.get("/api/getAllProducts", async (_req, res) => {
  const productData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
    fields: "id,image,title",
  });
  res.status(200).send(productData);
});

app.get("/api/getProductById", async (_req, res) => {
  const productData = await shopify.api.rest.Product.find({
    session: res.locals.shopify.session,
    id: _req.query.productId,
    fields: "id,image,title",
  });
  // console.log('productData', productData);
  res.status(200).send(productData);
});

app.get("/api/getNextPageProducts", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const response = await getNextPageProducts({
      session: res.locals.shopify.session,
      first: _req.query.first,
      after: _req.query.after,
      searchValue: _req.query.searchValue,
    });
    res.status(status).send({ success: status === 200, response });
  } catch (e) {
    console.log(`Failed to getNextPageProducts: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});

app.get("/api/getPrevPageProducts", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const response = await getPrevPageProducts({
      session: res.locals.shopify.session,
      last: _req.query.last,
      before: _req.query.before,
      searchValue: _req.query.searchValue,
    });
    res.status(status).send({ success: status === 200, response });
  } catch (e) {
    console.log(`Failed to getPrevPageProducts: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});

app.get("/api/getFilterProducts", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const response = await getFilterProducts({
      session: res.locals.shopify.session,
      first: _req.query.first,
      searchValue: _req.query.searchValue,
    });
    res.status(status).send({ success: status === 200, response });
  } catch (e) {
    console.log(`Failed to getFilterProducts: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});
// DISCOUNT PAGE GRAPHQL API END

// PRICING PLAN API START
app.get("/api/updatePricingPlan", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const recurring_application_charge =
      new shopify.api.rest.RecurringApplicationCharge({
        session: res.locals.shopify.session,
      });
    recurring_application_charge.name = "Basic Plan";
    recurring_application_charge.price = 5.99;
    recurring_application_charge.return_url =
      "https://admin.shopify.com/store/ds-develop-store/apps/ds-devlopment/pricingPlans";
    recurring_application_charge.test = true;
    await recurring_application_charge.save({
      update: true,
    });
    res
      .status(status)
      .send({ success: status === 200, recurring_application_charge });
  } catch (e) {
    console.log(`Failed to update Pricing Plan: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});

app.get("/api/getPlanData", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const shop = _req.query.shop;

    // get User Id from ShopifySessions
    const user = await ShopifySessions.findOne({ shop });

    // get Active Charge if any
    const charges = await Charge.findOne(
      { shop: _req.query.shop, status: "ACTIVE" },
      { createdAt: -1 } // -1 for descending order, 1 for ascending
    );

    if(charges){
      console.log('exist');
    }else{
      console.log('not exist');
    }

    console.log("charges");
    console.log(charges);

    res
      .status(status)
      .send({ success: status === 200, data: "recurring_application_charge" });
  } catch (e) {
    console.log(`Failed to update Pricing Plan: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ success: status === 200, error });
  }
});
// PRICING PLAN API END

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

if (PORT && databaseUrl && databaseName) {
  app.listen(Number(PORT), () => {
    connectDB();
    console.log(`Express server is Started at ${PORT}`);
  });
}
// app.listen(PORT);
