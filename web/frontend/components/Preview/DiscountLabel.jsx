import { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder-image.jpg";
import style from "../../css/DisccountLabel.module.css";
import SolidDoubleTags from "../Icons/SolidDoubleTags";
import SolidPercentageTag from "../Icons/SolidPercentageTag";
import SolidTag from "../Icons/SolidTag";
import ThinDoubleTags from "../Icons/ThinDoubleTags";
import ThinPercentageTag from "../Icons/ThinPercentageTag";
import ThinTag from "../Icons/ThinTag";

export default function DisccountLabel(props) {
  const [isVibrating, setIsVibrating] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 2000); // Duration of the vibrate animation (0.2s)

      // Clear the interval after 5 seconds (5000 milliseconds)
      setTimeout(() => clearInterval(interval), 5000);
    }, 5000); // Trigger every 5 seconds (5000 milliseconds)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  });
  return (
    <div className={style["onclick-popup"]}>
      <div className={style.PreviewTopbar}>
        <div
          style={{
            height: "12px",
            width: "12px",
            background: "rgb(249, 139, 140)",
            borderRadius: "50px",
            display: "block",
            marginRight: "12px",
          }}
        ></div>
        <div
          style={{
            height: "12px",
            width: "12px",
            background: "rgb(245, 219, 164)",
            borderRadius: "50px",
            display: "block",
            marginRight: "12px",
          }}
        ></div>
        <div
          style={{
            height: "12px",
            width: "12px",
            background: "rgb(92, 212, 139)",
            borderRadius: "50px",
            display: "block",
            marginRight: "12px",
          }}
        ></div>
      </div>
      <div className={style.ds_product_details}>
        <div className={style.pagewidth}>
          <div className={style.ds_product_details_main}>
            <div className={style.product_image}>
              <img src={placeholder} alt="" />
            </div>
            <div className={style.p_details}>
              <p>Discount Sportlight</p>
              <h2>Demo Product</h2>
              <div className={style["icon-with-text"]}>
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
                        props.json_style_data.discount_label_settings
                          .label_style.color,
                      fontSize:
                        props.json_style_data.discount_label_settings
                          .label_style.fontSize,
                    }}
                  >
                    {
                      props.json_style_data.discount_label_settings.label_style
                        .text
                    }
                  </a>
                  <a
                    className={`${isVibrating ? style.shake : ""}`}
                    href="#"
                    style={{
                      color:
                        props.json_style_data.discount_label_settings
                          .label_style.color,
                      fontSize:
                        props.json_style_data.discount_label_settings
                          .label_style.fontSize,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 2000 2000"
                      viewBox="0 0 2000 2000"
                      id="right-arrow"
                      width={
                        props.json_style_data.discount_label_settings
                          .label_style.fontSize
                      }
                      height={
                        props.json_style_data.discount_label_settings
                          .label_style.fontSize
                      }
                      fill={
                        props.json_style_data.discount_label_settings
                          .label_style.color
                      }
                    >
                      <path d="M1743.9,1064H256c-35.3,0-64-28.7-64-64c0-35.3,28.7-64,64-64h1487.9c35.3,0,64,28.7,64,64C1807.9,1035.3,1779.3,1064,1743.9,1064z"></path>
                      <path d="M1072.4,1735.6c-16.4,0-32.8-6.2-45.3-18.7c-25-25-25-65.5,0-90.5l626.4-626.4l-626.4-626.4c-25-25-25-65.5,0-90.5c25-25,65.5-25,90.5,0l671.6,671.6c12,12,18.7,28.3,18.7,45.3c0,17-6.7,33.3-18.7,45.3l-671.6,671.6C1105.1,1729.4,1088.7,1735.6,1072.4,1735.6z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <h3>$2000.00</h3>
              <div className={style.quantity_btns}>
                <span>Quantity</span>
                <div className={style.quantity_numbers}>
                  <div className={style.plus}>-</div>
                  <div className={style.numbers}>1</div>
                  <div className={style.minus}>+</div>
                </div>
              </div>
              <a className={style.addtocartbtn}>Add to cart</a>
              <a className={style.buynowbtn}>Buy it now</a>
              <div className={style.product_content}>
                {" "}
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
