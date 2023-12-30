import Discounts from "../db/models/Discounts.js";

const getDiscountsDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchDiscountsData = await Discounts.findOne({
    shop: shop,
  });
    // fields: "id,image,title",
  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: "fetchDiscountsData",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getDiscountsDetails,
};
