import ShopifySessions from "../db/models/ShopifySessions.js";

const getDiscountsDetails = async (request, response) => {
    console.log("vidhee");
  const { shop, accessToken } = request.body;
//   const fetchShopifySessionsData = await ShopifySessions.findOne({
//     shop: shop,
//   });
  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: "fetchShopifySessionsData",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getDiscountsDetails,
};
