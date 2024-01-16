import { useState } from "react";
import style from "./PopupModal.module.css";

export default function PopupModal(props) {
  const handleCloseModal = () => {
    props.handleCloseModal();
  };

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
    <>
      {props.openPopup && (
        <div className={style["onclick-popup"]}>
          <div
            className={style["modal-overlay"]}
            onClick={handleCloseModal}
            id="DS_modal_popup"
          >
            <div
              className={style["modal-content"]}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={style["close-btn"]} onClick={handleCloseModal}>
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
                      props.json_style_data.popup_modal_settings.color
                        .titleBGColor,
                  }}
                >
                  {props.json_style_data.popup_modal_settings.text.titleText}
                </div>

                {props.discounts.map((discount, index) => (
                  <div
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
                      }}
                    >
                      {discount.title}
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
                      {discount.terms.map((term) => (
                        <span>{term}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
