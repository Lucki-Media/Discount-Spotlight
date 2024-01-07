import React from "react";
import style from "./OfferRibbon.module.css";

const OfferRibbon = (props) => {
  console.log("props");
  console.log(props.productHandle);
  const bgColorMatch =
    props.json_style_data.offer_ribbon_settings.bgColor.match(/[\d.]+/g);
  const [r, g, b] = bgColorMatch.map((value) => Math.round(parseFloat(value)));

  return (
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
          [props.json_style_data.offer_ribbon_settings.position === "1"
            ? "top"
            : "bottom"]: props.json_style_data.offer_ribbon_settings.offset,
        }}
      >
        2 Special Discounts
      </div>
    </>
  );
};

export default OfferRibbon;
