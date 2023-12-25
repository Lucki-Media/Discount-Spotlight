import React from "react";
import "../../css/OfferRibbon.css";
import placeholder from "../../assets/placeholder-image.jpg";

export default function OfferRibbon(props) {
  const [r, g, b] =
    props.json_style_data.offer_ribbon_settings.bgColor.match(/\d+/g);
  return (
    <>
      <style>
        {`
        .discount_tag:after {
          border-color: rgba(${r}, ${g}, ${b}, 0.5) transparent rgba(${r}, ${g}, ${b}, 0.5) rgba(${r}, ${g}, ${b}, 1) ;
        }
      `}
      </style>
      <div className="offer_ribbon_product">
        <div className="pagewidth">
          <div className="offer_ribbon_product_main">
            <div className="offer_ribbon_product_image">
              <img src={placeholder} alt="" />
              <div
                className="discount_tag"
                style={{
                  color: props.json_style_data.offer_ribbon_settings.textColor,
                  background:
                    props.json_style_data.offer_ribbon_settings.bgColor,
                  fontSize:
                    props.json_style_data.offer_ribbon_settings.fontSize,
                  [props.json_style_data.offer_ribbon_settings.position === "1"
                    ? "top"
                    : "bottom"]:
                    props.json_style_data.offer_ribbon_settings.offset,
                }}
              >
                2 Special Discounts
              </div>
            </div>

            <div className="offer_ribbon_product_brandname">one8 x PUMA</div>
            <div className="offer_ribbon_product_name">
              Men Treadgryp Printed Sneakers
            </div>
            <div className="offer_ribbon_product_price">RS.2000 IND</div>
          </div>
        </div>
      </div>
    </>
  );
}
