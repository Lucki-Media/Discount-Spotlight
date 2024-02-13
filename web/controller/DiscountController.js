import Discounts from "../db/models/Discounts.js";
import ShopifySessions from "../db/models/ShopifySessions.js";
import axios from "axios";

const getDiscountsDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchDiscountsData = await Discounts.find({ shop: shop }).populate({
    path: "arrayField",
    options: { strictPopulate: false },
  });

  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: fetchDiscountsData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const saveDiscountsDetails = async (request, response) => {
  const { shop, accessToken, data } = request.body;
  try {
    // Use map to loop through the data array and perform asynchronous operations
    const promises = data.map(async (product) => {
      let fetchProductData = await Discounts.findOne({
        shop: shop,
        product_id: product.product_id,
      });
      if (fetchProductData) {
        // If the product exists, update its data
        fetchProductData.product_image =
          product.product_image != null ? product.product_image : "";
        fetchProductData.product_name = product.product_name;
        fetchProductData.discounts = product.discounts;
      } else {
        // If the product doesn't exist, create a new entry
        fetchProductData = new Discounts({
          shop: shop,
          product_id: product.product_id,
          product_image:
            product.product_image != null ? product.product_image : "",
          product_name: product.product_name,
          discounts: product.discounts,
        });
      }
      await fetchProductData.save();
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: data,
      },
    });
  } catch (error) {
    console.error("Error saving discounts details:", error);
    return response.status(500).json({
      status: 500,
      success: false,
      error: "Internal Server Error",
    });
  }
};


const getDiscounts = async (request, response) => {
  const { shop } = request.body.data;
  const fetchDiscountsData = await Discounts.find({ shop: shop }).populate({
    path: "arrayField",
    options: { strictPopulate: false },
  });
  return response.json({
    status: 200,
    success: true,
    data: fetchDiscountsData,
  });
};

const getDiscountForProduct = async (request, response) => {
  try {
    const { shop, product_id } = request.body.data;

    // Input Validation
    if (!shop || !product_id) {
      return response.status(400).json({
        status: 400,
        success: false,
        error: "Invalid input parameters",
      });
    }

    // Fetch shopify session data
    const shopifySession = await ShopifySessions.findOne({ shop });

    if (!shopifySession) {
      return response.status(404).json({
        status: 404,
        success: false,
        error: "Shopify session not found",
      });
    }

    // Fetch discount data
    const fetchProductData = await Discounts.findOne({ shop, product_id });

    let discountDetails = [];

    if (fetchProductData) {
      const promises = fetchProductData.discounts.map(async (discountID) => {
        const accessToken = shopifySession.accessToken;
        const discountApiUrl = `https://${shop}/admin/api/2023-10/price_rules/${discountID}.json`;

        const discountResponse = await axios.get(discountApiUrl, {
          headers: {
            "X-Shopify-Access-Token": accessToken,
          },
        });

        // DISCOUNT DETAILS CODE START
        const details = [];
        const discountTaC = [];
        const priceRule = discountResponse.data.price_rule;

        // SET TERMS AND CONDITIONS FOR DISCOUNT

        // FREE SHIPPING
        if (
          priceRule.target_type === "shipping_line" &&
          priceRule.value === "-100.0"
        ) {
          discountTaC.push("Get Free Shipping using this code");
        }

        // DISCOUNT OFF
        if (priceRule.target_type === "line_item") {
          if (priceRule.value_type === "percentage") {
            discountTaC.push(
              `Get ${Math.abs(
                parseFloat(priceRule.value)
              )}% off using this code`
            );
          } else if (priceRule.value_type === "fixed_amount") {
            discountTaC.push(
              `Get $${Math.abs(parseFloat(priceRule.value))} off on purchase`
            );
          }
        }

        // SET MINIMUM QUANTITY PURCHASE TaC
        const prerequisiteQuantity =
          priceRule.prerequisite_to_entitlement_quantity_ratio
            .prerequisite_quantity;
        const entitledQuantity =
          priceRule.prerequisite_to_entitlement_quantity_ratio
            .entitled_quantity;

        if (
          prerequisiteQuantity !== null &&
          prerequisiteQuantity !== undefined
        ) {
          if (entitledQuantity !== null && entitledQuantity !== undefined) {
            discountTaC.push(
              `Get ${entitledQuantity} on minimum purchase of ${prerequisiteQuantity}`
            );
          } else {
            discountTaC.push(`Minimum purchase of ${prerequisiteQuantity}`);
          }
        }

        // SET MINIMUM PRICE PURCHASE TaC
        const prerequisiteAmount =
          priceRule.prerequisite_to_entitlement_quantity_ratio
            .prerequisite_amount;

        if (prerequisiteAmount !== null && prerequisiteAmount !== undefined) {
          discountTaC.push(`Minimum purchase of $${prerequisiteAmount}`);
        }

        // SET COUPON CODE END DURATION
        if (priceRule.ends_at !== null && priceRule.ends_at !== undefined) {
          const expirationDate = new Date(priceRule.ends_at).toLocaleString(
            "en-US",
            { timeZoneName: "short" }
          );
          discountTaC.push(`Expires on: ${expirationDate}`);
        }

        // ADD DISCOUNT IN DATA ONLY IF IT'S NOT EXPIRED
        if (
          priceRule.ends_at === null ||
          new Date(priceRule.ends_at) > new Date()
        ) {
          discountDetails.push({
            id: discountID,
            title: priceRule.title,
            terms: discountTaC,
          });
        }
        // DISCOUNT DETAILS CODE END
      });
      // Wait for all promises to resolve
      await Promise.all(promises);

      return response.json({
        status: 200,
        success: true,
        data: discountDetails,
      });
    } else {
      return response.json({
        status: 200,
        success: true,
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: 500,
      success: false,
      error: "Internal Server Error",
    });
  }
};

export default {
  getDiscounts,
  getDiscountForProduct,
  getDiscountsDetails,
  saveDiscountsDetails,
};
