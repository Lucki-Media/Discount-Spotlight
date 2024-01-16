import Count from "../db/models/Counts.js";

const countOfLabelClick = async (request, response) => {
  const { shop } = request.body.data;
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" }).toLowerCase();
  const countData = await Count.findOne({
    shop: shop,
    "counts.year": new Date().getFullYear(),
  });

// console.log(currentMonth);
  try {
    if (!countData) {
      // If there's no existing data, create a new document
      const newCountData = new Count({
        shop: shop,
        counts: {
          year: new Date().getFullYear(),
          count_data: {},
        },
      });

      // Loop through all months and set values in count_data
      for (const month in newCountData.counts.count_data) {
        newCountData.counts.count_data[month] = month === currentMonth ? 1 : 0;
      }

      // Save the new document to the database
      await newCountData.save();
    } else {
      // If there's existing data, increment the count for the current month
      countData.counts.count_data[currentMonth] =
        (countData.counts.count_data[currentMonth] || 0) + 1;

      // Save the existing document with updated count_data
      await countData.save();
    }

    return response.json({
      status: 200,
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      status: 500,
      success: false,
      error: "Internal Server Error",
    });
  }
};

export default {
  countOfLabelClick,
};
