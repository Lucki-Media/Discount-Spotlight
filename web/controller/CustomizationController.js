import Customizations from "../db/models/Customizations.js";

const getCustomizationDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchCustomizationsData = await Customizations.findOne({
    shop: shop,
  });
  try {
    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: fetchCustomizationsData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const saveCustomizationDetails = async (request, response) => {
  const { shop, accessToken } = request.body;
  const fetchCustomizationsData = await Customizations.findOne({
    shop: shop,
  });
  try {
    if (fetchCustomizationsData.customizations_json) {
      fetchCustomizationsData.customizations_json = JSON.stringify(request.body.transferData);
    }
    await fetchCustomizationsData.save();

    return response.json({
      status: 200,
      success: true,
      data: {
        shop_data: fetchCustomizationsData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
export default {
  getCustomizationDetails,
  saveCustomizationDetails
};
