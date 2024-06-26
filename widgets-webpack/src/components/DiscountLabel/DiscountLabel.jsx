import React, { useEffect, useState } from "react";
import style from "./DiscountLabel.module.css";
import axios from "axios";
import SolidDoubleTags from "../Icons/SolidDoubleTags";
import SolidPercentageTag from "../Icons/SolidPercentageTag";
import SolidTag from "../Icons/SolidTag";
import ThinDoubleTags from "../Icons/ThinDoubleTags";
import ThinPercentageTag from "../Icons/ThinPercentageTag";
import ThinTag from "../Icons/ThinTag";
import PopupModal from "../PopupModal/PopupModal";

const DiscountLabel = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);

  const handleOpenModal = async () => {
    setModalOpen(true);

    // CALL API TO INCREASE COUNT ON CLICK
    let payLoad = {
      shop: window.Shopify.shop,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}countOfLabelClick`,
      {
        data: payLoad,
      }
    );
    // console.log("countOfLabelClick");
    // console.log(response.data);
  };

  // FOR POPUP CLOSE
  const handlePopupClose = () => {
    const popup = document.querySelector("#DS_modal_popup");
    popup.classList.add(style.zoom_out);
    setTimeout(() => {
      setModalOpen(false);
    }, 700);
  };

  // Product API
  const productAPI = async () => {
    // console.log('window.meta.product.id');
    // console.log(window.meta.product.id);
    // GET DATA STORED IN DATABASE
    if (window.meta.product.id) {
      let payLoad = {
        shop: window.Shopify.shop,
        product_id: window.meta.product.id,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}getDiscountForProduct`,
        {
          data: payLoad,
        }
      );
      // console.log("getDiscountForProduct");
      // console.log(response.data);

      if (response.data.data) {
        setDiscounts(response.data.data);
      }
    }
  };

  useEffect(() => {
    productAPI();
  }, []);
  return (
    <>
      {discounts.length > 0 && (
        <div className={style["onclick-popup"]}>
          <div className={style["icon-with-text"]} onClick={handleOpenModal}>
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "1" && (
              <ThinTag
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "2" && (
              <SolidTag
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "3" && (
              <ThinPercentageTag
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "4" && (
              <SolidPercentageTag
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "5" && (
              <ThinDoubleTags
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            {props.json_style_data.discount_label_settings.icon_style
              .iconType === "6" && (
              <SolidDoubleTags
                icon_style={
                  props.json_style_data.discount_label_settings.icon_style
                }
              />
            )}
            <div className={style["on-click"]}>
              <a
                href="javascript:;"
                style={{
                  color:
                    props.json_style_data.discount_label_settings.label_style
                      .color,
                  fontSize:
                    props.json_style_data.discount_label_settings.label_style
                      .fontSize,
                }}
              >
                {props.json_style_data.discount_label_settings.label_style.text}
              </a>
            </div>
          </div>

          {isModalOpen === true && (
            <PopupModal
              json_style_data={props.json_style_data}
              openPopup={isModalOpen}
              handleCloseModal={handlePopupClose}
              discounts={discounts}
            />
          )}
        </div>
      )}
    </>
  );
};

export default DiscountLabel;
