import Discounts from "../db/models/Discounts.js";
import ShopifySessions from "../db/models/ShopifySessions.js";
import axios from "axios";

const getDiscountsDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchShopifySessionsData = await ShopifySessions.findOne({
    shop: shop,
  });
  try {
    getDiscounts(fetchShopifySessionsData);
    // return response.json({
    //   status: 200,
    //   success: true,
    //   data: fetchShopifySessionsData,
    // });
  } catch (error) {
    console.log(error);
  }
};

const getDiscounts = async (data) => {
  console.log("hello");
  console.log(data);
  try {
    const response = await axios.get(
      "https://" +
        data.shop +
        "/admin/api" +
        process.env.API_VERSION +
        "/price_rules.json",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "X-Shopify-Access-Token": data.accessToken,
        },
      }
    );

    console.log("response.data"); // Handle the response data as needed
    console.log(response.data); // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default {
  getDiscountsDetails,
};
