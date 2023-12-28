import style from "../../css/PopupModal.module.css";

export default function PopupModal(props) {
  return (
    <div className={style["onclick-popup"]}>
      <div className={style["modal-overlay"]}>
        <div
          className={style["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={style["close-btn"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill={
                props.json_style_data.popup_modal_settings.color
                  .cancleButtonColor
              }
              viewBox="0 0 16 16"
              data-testid="modal-close"
              className="modal-base-cancelIcon "
            >
              <path
                fillRule="evenodd"
                d="M9.031 8l6.756-6.756a.731.731 0 0 0 0-1.031.732.732 0 0 0-1.031 0L8 6.969 1.244.213a.732.732 0 0 0-1.031 0 .731.731 0 0 0 0 1.03L6.969 8 .213 14.756a.731.731 0 0 0 0 1.031.732.732 0 0 0 1.031 0L8 9.031l6.756 6.756a.732.732 0 0 0 1.031 0 .731.731 0 0 0 0-1.03L9.031 8z"
              ></path>
            </svg>
          </span>

          <div className={style["popup-details"]}>
            <div
              className={style["popup-heading"]}
              style={{
                fontSize:
                  props.json_style_data.popup_modal_settings.fontSize
                    .titleFontSize,
                color:
                  props.json_style_data.popup_modal_settings.color
                    .titleTextColor,
                background:
                  props.json_style_data.popup_modal_settings.color.titleBGColor,
              }}
            >
              {props.json_style_data.popup_modal_settings.text.titleText}
            </div>
            <div
              className={style["popupcoupon"]}
              style={{
                background:
                  props.json_style_data.popup_modal_settings.color
                    .bGContentColor,
              }}
            >
              <div
                className={style["popup_couponcode"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountCodeFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeTextColor,
                  background:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBGColor,
                  borderColor:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBorderColor,
                }}
              >
                DISCOUNT SPORTLIGHT001234
              </div>
              <div
                className={style["popup_couponcode-details"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountTaCFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountTaCTextColor,
                }}
              >
                <span> Rs. 200 off on minimum purchase of Rs. 749 .</span>
                <span>Expires on: 31st December 2023 | 05:30 AM</span>
              </div>
            </div>
            <div
              className={style["popupcoupon"]}
              style={{
                background:
                  props.json_style_data.popup_modal_settings.color
                    .bGContentColor,
              }}
            >
              <div
                className={style["popup_couponcode"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountCodeFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeTextColor,
                  background:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBGColor,
                  borderColor:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBorderColor,
                }}
              >
                DISCOUNT SPORTLIGHT001234
              </div>
              <div
                className={style["popup_couponcode-details"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountTaCFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountTaCTextColor,
                }}
              >
                <span> Rs. 200 off on minimum purchase of Rs. 749 .</span>
                <span>Expires on: 31st December 2023 | 05:30 AM</span>
              </div>
            </div>
            <div
              className={style["popupcoupon"]}
              style={{
                background:
                  props.json_style_data.popup_modal_settings.color
                    .bGContentColor,
              }}
            >
              <div
                className={style["popup_couponcode"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountCodeFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeTextColor,
                  background:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBGColor,
                  borderColor:
                    props.json_style_data.popup_modal_settings.color
                      .discountCodeBorderColor,
                }}
              >
                DISCOUNT SPORTLIGHT001234
              </div>
              <div
                className={style["popup_couponcode-details"]}
                style={{
                  fontSize:
                    props.json_style_data.popup_modal_settings.fontSize
                      .discountTaCFontSize,
                  color:
                    props.json_style_data.popup_modal_settings.color
                      .discountTaCTextColor,
                }}
              >
                <span> Rs. 200 off on minimum purchase of Rs. 749 .</span>
                <span>Expires on: 31st December 2023 | 05:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
