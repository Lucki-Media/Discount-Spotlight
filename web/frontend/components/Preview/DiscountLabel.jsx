import placeholder from "../../assets/placeholder-image.jpg";
import style from "../../css/DisccountLabel.module.css";
import SolidDoubleTags from "../Icons/SolidDoubleTags";
import SolidPercentageTag from "../Icons/SolidPercentageTag";
import SolidTag from "../Icons/SolidTag";
import ThinDoubleTags from "../Icons/ThinDoubleTags";
import ThinPercentageTag from "../Icons/ThinPercentageTag";
import ThinTag from "../Icons/ThinTag";

export default function DisccountLabel(props) {
  return (
    <div className={style["onclick-popup"]}>
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
                </div>
              </div>
              <h3>RS.2000</h3>
              <div className={style.quantity_btns}>
                <span>quantity</span>
                <div className={style.quantity_numbers}>
                  <div className={style.plus}>+</div>
                  <div className={style.numbers}>1</div>
                  <div className={style.minus}>-</div>
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
