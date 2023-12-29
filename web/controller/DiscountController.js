import Discounts from "../db/models/Discounts.js";
import shopify from "../shopify.js";

const getDiscountsDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchDiscountsData = await Discounts.findOne({
    shop: shop,
  });
  const ProductData = await shopify.rest.Product.all({
    session: response.locals.shopify.session,
  });
    // fields: "id,image,title",
  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: ProductData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getDiscountsDetails,
};
