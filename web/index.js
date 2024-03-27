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
import ProductDiscount from "./db/models/Discounts.js";

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
  res.setHeader(
    "Content-Security-Policy",
    `frame-ancestors https://${_req.query.shop} https://admin.shopify.com`
  );

  try {
    // Remove extra data from database according to Plan CODE START
    if (_req.query.plan_name !== "Premium Plan") {
      let i = 1;
      let data = {
        productLimit: 10,
        discountLimit: 3,
      };
      switch (
        _req.query.plan_name // get Plan data from Plan name
      ) {
        case "Free Plan":
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
        case "Basic Plan":
          data = {
            productLimit: 50,
            discountLimit: 5,
          };
          break;
        default:
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
      }
      const fetchDiscountsData = await ProductDiscount.find({
        shop: _req.query.shop,
      }).populate({
        path: "arrayField",
        options: { strictPopulate: false },
      });

      fetchDiscountsData.forEach(async (element) => {
        if (i <= data.productLimit && element.discounts.length > 0) {
          i++;
          // IF DATA NOT REACHED AT THE PLAN LIMIT AND DISCOUNT IS NOT NULL
          let fetchProductData = await ProductDiscount.findOne({
            shop: _req.query.shop,
            product_id: element.product_id,
          });
          if (fetchProductData) {
            fetchProductData.discounts = fetchProductData.discounts.slice(
              0,
              data.discountLimit // Trim the discount if more then limit
            );
            await fetchProductData.save();
          }
        } else {
          // DELETE DATA OF THE ELEMENT FROM DATABASE
          await ProductDiscount.deleteOne({ _id: element._id });
        }
      });
    }
    // Remove extra data from database according to Plan CODE END

    // if Merchant downgrades with free plan, we need to get currect active plan and delete it...
    // if they jumps to the another paid plan Shopify will automatically cancel the current active plan and active the new one
    if (_req.query.plan_name === "Free Plan") {
      // get all reccuring plans for the store
      const recurring_application_charge =
        await shopify.api.rest.RecurringApplicationCharge.all({
          session: res.locals.shopify.session,
        });

      // Delete active plan if any
      recurring_application_charge.data.forEach(async (element) => {
        if (element.status === "active") {
          await shopify.api.rest.RecurringApplicationCharge.delete({
            session: res.locals.shopify.session,
            id: element.id,
          });
        }
      });

      // Update Database for the store Charges
      await Charge.updateMany(
        { shop: _req.query.shop, status: "active" }, // Filter
        { $set: { status: "cancelled" } } // Update
      );

      res.status(200).send({
        success: true,
        data: "",
      });
    } else {
      // upgrade the Plan
      const recurring_application_charge =
        new shopify.api.rest.RecurringApplicationCharge({
          session: res.locals.shopify.session,
        });
      recurring_application_charge.name = _req.query.plan_name;
      recurring_application_charge.price = Number(_req.query.price);
      recurring_application_charge.return_url = `https://admin.shopify.com/store/${_req.query.shop.replace(
        ".myshopify.com",
        ""
      )}/apps/ds-devlopment/pricingPlans`;
      recurring_application_charge.test = true;
      await recurring_application_charge.save({
        update: true,
      });

      res.status(200).send({
        success: true,
        data: recurring_application_charge.confirmation_url,
      });
    }
  } catch (e) {
    console.log(`Failed to update Pricing Plan: ${e.message}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

app.get("/api/getPlanData", async (_req, res) => {
  let plan_id = 1;
  let data = {
    productLimit: 10,
    discountLimit: 3,
  };

  try {
    // get Active Charge if any
    let charges = await Charge.findOne(
      { shop: _req.query.shop, status: "active" },
      null,
      { sort: { createdAt: -1 } }
    );

    if (charges) {
      // If charges found for the store
      plan_id = Number(charges.plan_id);

      // set Limitation according to plan
      switch (plan_id) {
        case 1:
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
        case 2:
          data = {
            productLimit: 50,
            discountLimit: 5,
          };
          break;
        case 3:
          data = {
            productLimit: -1,
            discountLimit: -1,
          };
          break;

        default:
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
      }

      // update plan details in the Database
      charges.plan_limit = data;
      await charges.save();
    }
    // create Plan Data according to active  plan_id
    const pricingPlanData = [
      {
        id: 1,
        status: plan_id === 1 ? "Active" : "Downgrade",
        plan_name: "Free Plan",
        price: 0,
      },
      {
        id: 2,
        status:
          plan_id === 2 ? "Active" : plan_id > 2 ? "Downgrade" : "Upgrade",
        plan_name: "Basic Plan",
        price: 5.99,
      },
      {
        id: 3,
        status: plan_id === 3 ? "Active" : "Upgrade",
        plan_name: "Premium Plan",
        price: 50.99,
      },
    ];

    res.status(200).send({ success: true, data: pricingPlanData });
  } catch (e) {
    console.log(`Failed to get Pricing Plan: ${e.message}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

app.get("/api/updateCharge", async (_req, res) => {
  try {
    const plan = await shopify.api.rest.RecurringApplicationCharge.find({
      session: res.locals.shopify.session,
      id: Number(_req.query.charge_id),
    });

    // if plan is active , add it to the Database
    if (plan && plan.status === "active") {
      let plan_id = 1;
      let data = {
        productLimit: 10,
        discountLimit: 3,
      };
      // get Plan data from Plan name
      switch (plan.name) {
        case "Free Plan":
          plan_id = 1;
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
        case "Basic Plan":
          plan_id = 2;
          data = {
            productLimit: 50,
            discountLimit: 5,
          };
          break;
        case "Premium Plan":
          plan_id = 3;
          data = {
            productLimit: -1,
            discountLimit: -1,
          };
          break;
        default:
          plan_id = 1;
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
      }

      const fetchPlanData = new Charge({
        shop: _req.query.shop,
        charge_id: Number(_req.query.charge_id),
        test: plan.test,
        status: plan.status,
        name: plan.name,
        price: Number(plan.price),
        trial_days: plan.trial_days,
        billing_on: new Date(plan.billing_on),
        activated_on: new Date(plan.activated_on),
        trial_ends_on: new Date(plan.trial_ends_on),
        cancelled_on: new Date(plan.cancelled_on),
        plan_id: plan_id,
        plan_limit: data,
      });
      await fetchPlanData.save();

      // create Plan Data according to active  plan_id
      const pricingPlanData = [
        {
          id: 1,
          status: plan_id === 1 ? "Active" : "Downgrade",
          plan_name: "Free Plan",
          price: 0,
        },
        {
          id: 2,
          status:
            plan_id === 2 ? "Active" : plan_id > 2 ? "Downgrade" : "Upgrade",
          plan_name: "Basic Plan",
          price: 5.99,
        },
        {
          id: 3,
          status: plan_id === 3 ? "Active" : "Upgrade",
          plan_name: "Premium Plan",
          price: 50.99,
        },
      ];

      res.status(200).send({
        success: true,
        data: {
          return_url: plan.return_url,
          pricingPlanData: pricingPlanData,
        },
      });
    } else {
      res
        .status(500)
        .send({ success: false, error: "unable to Update Charge" });
    }
  } catch (e) {
    console.log(`Failed to update Pricing Plan Charge: ${e.message}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

app.get("/api/getActivePlanLimitations", async (_req, res) => {
  let plan_id = 1;
  let data = {
    productLimit: 10,
    discountLimit: 3,
  };

  try {
    // get Active Charge if any
    let charges = await Charge.findOne(
      { shop: _req.query.shop, status: "active" },
      null,
      { sort: { createdAt: -1 } }
    );

    if (charges) {
      // If charges found for the store
      plan_id = Number(charges.plan_id);

      // set Limitation according to plan
      switch (plan_id) {
        case 1:
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
        case 2:
          data = {
            productLimit: 50,
            discountLimit: 5,
          };
          break;
        case 3:
          data = {
            productLimit: -1,
            discountLimit: -1,
          };
          break;

        default:
          data = {
            productLimit: 10,
            discountLimit: 3,
          };
          break;
      }
    }

    res.status(200).send({ success: true, data: data });
  } catch (e) {
    console.log(`Failed to get Active Plan Details: ${e.message}`);
    res.status(500).send({ success: false, error: e.message });
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
