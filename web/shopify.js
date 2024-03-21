import {
  BillingInterval,
  BillingReplacementBehavior,
  LATEST_API_VERSION,
} from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "Free Plan": {
    // This is an example configuration that would do a monthly charge for $5 (only USD is currently supported)
    amount: 0,
    currencyCode: "USD",
    trialDays: 0,
    interval: BillingInterval.Every30Days,
    replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    test: true,
  },
  "Basic Plan": {
    // This is an example configuration that would do a monthly charge for $5 (only USD is currently supported)
    amount: 5.99,
    currencyCode: "USD",
    trialDays: 0,
    interval: BillingInterval.Every30Days,
    replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    test: true,
  },
  "Premium Plan": {
    // This is an example configuration that would do a monthly charge for $5 (only USD is currently supported)
    amount: 50.99,
    currencyCode: "USD",
    trialDays: 0,
    interval: BillingInterval.Every30Days,
    replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    test: true,
  },
};

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: billingConfig,
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ["read_products", "read_price_rules"],
    hostName: process.env.HOST_NAME,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new MongoDBSessionStorage(
    "mongodb+srv://discountspotlight:9RVJOCRkxInTsiA0@discount-spotlight.70piy8b.mongodb.net/",
    "discount-spotlight"
  ),
});

export default shopify;
