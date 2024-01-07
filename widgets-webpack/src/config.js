import { CONST } from "./black-box/constants";
const { OFFER_RIBBON, DISCOUNT_LABEL } = CONST;

export const config = {
  [OFFER_RIBBON]: {
    target: "body",
    className: "ds-offer-ribbon-q78er",
    styles: {
      width: "100%",
    },
  },
  [DISCOUNT_LABEL]: {
    target: ".product__title",
    className: "ds-discount-label-q78er",
    styles: {
      width: "100%",
    },
  },
};
