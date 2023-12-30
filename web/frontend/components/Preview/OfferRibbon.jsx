import React from "react";
import style from "../../css/OfferRibbon.module.css";
import placeholder from "../../assets/placeholder-image.jpg";

export default function OfferRibbon(props) {
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
      <div className={style.offer_ribbon_product}>
        <div className={style.pagewidth_ribbon}>
          <div className={style.offer_ribbon_product_main}>
            <div className={style.offer_ribbon_product_image}>
              <img src={placeholder} alt="" />
              <div
                className={`${style.discount_tag} DS__After_Discount_tag`}
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

            <div className={style.offer_ribbon_product_brandname}>
              one8 x PUMA
            </div>
            <div className={style.offer_ribbon_product_name}>
              Men Treadgryp Printed Sneakers
            </div>
            <div className={style.offer_ribbon_product_price}>RS.2000 IND</div>
          </div>
        </div>
      </div>
    </>
  );
}
