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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Product API
  const productAPI = async () => {
    const productAPIResponse = await axios.get(window.location.href + ".json");
    console.log(productAPIResponse);
  };

  useEffect(() => {
    productAPI();
  }, []);
  return (
    <div className={style["onclick-popup"]}>
      <div className={style["icon-with-text"]}>
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "1" && (
          <ThinTag
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "2" && (
          <SolidTag
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "3" && (
          <ThinPercentageTag
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "4" && (
          <SolidPercentageTag
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "5" && (
          <ThinDoubleTags
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        {props.json_style_data.discount_label_settings.icon_style.iconType ===
          "6" && (
          <SolidDoubleTags
            icon_style={
              props.json_style_data.discount_label_settings.icon_style
            }
          />
        )}
        <div className={style["on-click"]}>
          <a
            href="javascript:;"
            onClick={handleOpenModal}
            // onClick={handleOpenModal}
            style={{
              color:
                props.json_style_data.discount_label_settings.label_style.color,
              fontSize:
                props.json_style_data.discount_label_settings.label_style
                  .fontSize,
            }}
          >
            {props.json_style_data.discount_label_settings.label_style.text}
          </a>
        </div>
      </div>

      {isModalOpen && <PopupModal json_style_data={props.json_style_data} />}
    </div>
  );
};

export default DiscountLabel;
