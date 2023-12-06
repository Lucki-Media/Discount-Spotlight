import ShopifySessions from "../db/models/ShopifySessions.js";

const shopifySessions = async (request, response) => {
  console.log("bhumzz");
  const { shop, accessToken } = request.body;
  const fetchShopifySessionsData = await ShopifySessions.findOne({
    shop: shop,
  });
  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: fetchShopifySessionsData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  shopifySessions,
};
