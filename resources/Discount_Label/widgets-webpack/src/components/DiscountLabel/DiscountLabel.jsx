import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
    // console.log('props.productId');
    // console.log(props.productId);
    // GET DATA STORED IN DATABASE
    if (props.productId) {
      let payLoad = {
        shop: window.Shopify.shop,
        product_id: props.productId,
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

  // Create a container for rendering the PopupModal outside the component hierarchy
  const modalContainer = document.createElement("div");

  useEffect(() => {
    document.body.appendChild(modalContainer); // Append the container to the body tag
    return () => {
      document.body.removeChild(modalContainer); // Clean up by removing the container when the component unmounts
    };
  }, [modalContainer]);

  return (
    <>
      {discounts.length > 0 && (
        <div className={style["onclick-popup"]}>
          <div
            className={style["icon-with-text"]}
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal();
            }}
          >
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
                href="#"
                // onClick={handleOpenModal}
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
              <a
                className={style.shake}
                href="#"
                style={{
                  color:
                    props.json_style_data.discount_label_settings.label_style
                      .color,
                  fontSize:
                    props.json_style_data.discount_label_settings.label_style
                      .fontSize,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 2000 2000"
                  viewBox="0 0 2000 2000"
                  id="right-arrow"
                  width={
                    props.json_style_data.discount_label_settings.label_style
                      .fontSize
                  }
                  height={
                    props.json_style_data.discount_label_settings.label_style
                      .fontSize
                  }
                  fill={
                    props.json_style_data.discount_label_settings.label_style
                      .color
                  }
                >
                  <path d="M1743.9,1064H256c-35.3,0-64-28.7-64-64c0-35.3,28.7-64,64-64h1487.9c35.3,0,64,28.7,64,64C1807.9,1035.3,1779.3,1064,1743.9,1064z"></path>
                  <path d="M1072.4,1735.6c-16.4,0-32.8-6.2-45.3-18.7c-25-25-25-65.5,0-90.5l626.4-626.4l-626.4-626.4c-25-25-25-65.5,0-90.5c25-25,65.5-25,90.5,0l671.6,671.6c12,12,18.7,28.3,18.7,45.3c0,17-6.7,33.3-18.7,45.3l-671.6,671.6C1105.1,1729.4,1088.7,1735.6,1072.4,1735.6z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 
          // {isModalOpen === true && (
          //   <PopupModal
          //     json_style_data={props.json_style_data}
          //     openPopup={isModalOpen}
          //     handleCloseModal={handlePopupClose}
          //     discounts={discounts}
          //   />
          // )}
           */}

      {/* Render PopupModal using ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <PopupModal
          json_style_data={props.json_style_data}
          openPopup={isModalOpen}
          handleCloseModal={handlePopupClose}
          discounts={discounts}
        />,
        modalContainer // Render into the modalContainer
      )}
    </>
  );
};

export default DiscountLabel;
