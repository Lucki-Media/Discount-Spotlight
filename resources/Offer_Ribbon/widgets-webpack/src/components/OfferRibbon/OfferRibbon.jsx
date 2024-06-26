import React, { useEffect, useState } from "react";
import style from "./OfferRibbon.module.css";
import axios from "axios";

const OfferRibbon = (props) => {
  const [discountsValue, setDiscountsValue] = useState(0);
  // console.log("props",props.shopData);

  const bgColorMatch =
    props.json_style_data.offer_ribbon_settings.bgColor.match(/[\d.]+/g);
  const [r, g, b] = bgColorMatch.map((value) => Math.round(parseFloat(value)));

  // Product API
  const productAPI = async () => {
    const productAPIResponse = await axios.get(
      window.location.origin + "/products/" + props.productHandle + ".json"
    );
    // console.log(productAPIResponse.data.product.id);

    // Find the product Data with matching product_id
    const matchingObject = props.shopData.find((obj) => {
      return (
        Number(obj.product_id) === Number(productAPIResponse.data.product.id)
      );
    });

    if (matchingObject) {
      setDiscountsValue(matchingObject.discounts.length);
    }
    // console.log(props.productHandle, matchingObject);
  };

  // check if the badge is created for detailed product on Product Detail Page
  var isProductDetailPage_Product = window.location.pathname
    ? window.location.pathname
        .substring(window.location.pathname.lastIndexOf("/"))
        .replace("/", "") === props.productHandle
    : false;

  useEffect(() => {
    productAPI();
  }, []);

  return (
    <>
      {discountsValue > 0 &&
        !isProductDetailPage_Product &&
        props.json_style_data.offer_ribbon_settings.enable === true && (
          <>
            <style>
              {`
        .DS__After_Discount_tag:after {
          border-color: rgba(${r}, ${g}, ${b}, 0.5) 
          transparent 
          rgba(${r}, ${g}, ${b}, 0.5) 
          rgba(${r}, ${g}, ${b}, 1) ;
        }
      `}
            </style>
            <div
              className={`${style.discount_tag} DS__After_Discount_tag`}
              style={{
                color: props.json_style_data.offer_ribbon_settings.textColor,
                background: props.json_style_data.offer_ribbon_settings.bgColor,
                fontSize: props.json_style_data.offer_ribbon_settings.fontSize,
                [props.json_style_data.offer_ribbon_settings.position === "top"
                  ? "top"
                  : "bottom"]:
                  props.json_style_data.offer_ribbon_settings.offset,
              }}
            >
              {discountsValue} Special Discount{discountsValue > 1 ? "s" : ""}
            </div>
          </>
        )}
    </>
  );
};

export default OfferRibbon;
