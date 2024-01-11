import Discounts from "../db/models/Discounts.js";

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
      const fetchProductData = await Discounts.findOne({
        shop: shop,
        product_id: product.id,
      });
      if (fetchProductData) {
        // If the product exists, update its data
        fetchProductData.product_image =
          product.image != null && product.image.src != null
            ? product.image.src
            : "";
        fetchProductData.product_name = product.title;
        fetchProductData.discounts = product.discounts;
      } else {
        // If the product doesn't exist, create a new entry
        const fetchProductData = new Discounts({
          shop: shop,
          product_id: product.id,
          product_image:
            product.image != null && product.image.src != null
              ? product.image.src
              : "",
          product_name: product.title,
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
export default {
  getDiscounts,
  getDiscountsDetails,
  saveDiscountsDetails,
};
