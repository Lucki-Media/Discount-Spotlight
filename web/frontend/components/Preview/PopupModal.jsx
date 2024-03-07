import { useState } from "react";
import style from "../../css/PopupModal.module.css";

export default function PopupModal(props) {
  const [copiedText, setCopiedText] = useState(null);

  // Click to Copy
  const copyText = (index) => {
    const couponCodeElement = document.getElementById(`couponCode-${index}`);

    if (couponCodeElement) {
      let couponCode = "";

      // Iterate over child nodes and extract text content
      for (const node of couponCodeElement.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          couponCode += node.textContent;
        }
      }

      couponCode = couponCode.trim();
      navigator.clipboard.writeText(couponCode).then(() => {
        setCopiedText(couponCode);
        setTimeout(() => {
          setCopiedText(null);
        }, 1000);
      });
    }
  };

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

            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className={style["popupcoupon"]}
                style={{
                  background:
                    props.json_style_data.popup_modal_settings.color
                      .bGContentColor,
                }}
              >
                <div
                  onClick={() => copyText(index)}
                  id={`couponCode-${index}`}
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
                    position: "relative", // Add position property
                  }}
                >
                  DISCOUNT_SPORTLIGHT_00{index}
                  <span className={style["tooltip"]}>
                    {copiedText !== null
                      ? `Copied: ${copiedText}`
                      : "Click to copy"}
                  </span>
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
                  <span> 20% off on a minimum purchase of 749.</span>
                  <span>
                    Expires on: 31st December {new Date().getFullYear()} | 05:30
                    AM
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
