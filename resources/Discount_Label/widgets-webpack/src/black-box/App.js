import React, { useEffect, useState } from "react";
import "./custom.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { json_style_data } from "../Static/General_settings";
import DiscountLabel from "../components/DiscountLabel/DiscountLabel";


const App = (props) => {
  const [transferData, setTransferData] = useState(json_style_data);

 const getCustomization = async () => {
    let payLoad = {
      shop: window.Shopify.shop,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}getCustomization`,
      {
        data: payLoad,
      }
    );
    // console.log("response.data");
    // console.log(JSON.parse(response.data.data.customizations_json));
    setTransferData(JSON.parse(response.data.data.customizations_json));
  };

  useEffect(() => {
    getCustomization();
  }, []);
  return (
    <>
      {/* render popup modal and label on product page */}
      {<DiscountLabel json_style_data={transferData} productId={props.productId} />}
    </>
  );
};

export default App;
