import ShopifySessions from "../db/models/ShopifySessions.js";
import Count from "../db/models/Counts.js";

const shopifySessions = async (request, response) => {
  console.log("bhumzz");
  const { shop, accessToken } = request.body;
  const fetchShopifySessionsData = await ShopifySessions.findOne({
    shop: shop,
  });
  const countData = await Count.findOne({
    shop: shop,
    "counts.year": new Date().getFullYear(),
  });

  try {
    let response_data;
    if (!countData) {
      // If there's no existing data
      response_data = {
        shop: shop,
        year: new Date().getFullYear(),
        count_data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    } else {
      // Extract count_data values and convert to array
      const dataArray = Object.values(countData.counts.count_data);

      // If there's existing data
      response_data = {
        shop: countData.shop,
        year: countData.counts.year,
        count_data: dataArray,
      };
    }
    return response.json({
      status: 200,
      success: true,
      data: response_data,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  shopifySessions,
};
