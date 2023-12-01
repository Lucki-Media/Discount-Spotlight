import TealiumForm from "../db/models/Tealium_Form.js";
import ShopifySessions from "../db/models/ShopifySessions.js";
const tealiumData = async (request, response) => {
  const { shop_domain, account_name } = request.body;
  const newTealiumData = {
    shop_domain: shop_domain,
    account_name: account_name,
  };
  const tealiumFormData = await new TealiumForm(newTealiumData).save(); // INSERT
  return response.status(200).json(tealiumFormData);
};
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
  tealiumData,
  shopifySessions,
};
