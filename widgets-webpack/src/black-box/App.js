import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CONST } from "./constants";
import { config } from "../config";
import "./custom.css";
import "react-toastify/dist/ReactToastify.css";
import OfferRibbon from "../components/OfferRibbon/OfferRibbon";
import TestRenderer from "../components/TestRenderer/TestRenderer";
import axios from "axios";
import { json_style_data } from "../Static/General_settings";
import DiscountLabel from "../components/DiscountLabel/DiscountLabel";

const { OFFER_RIBBON, DISCOUNT_LABEL } = CONST;

const App = () => {
  const [getHandle, setHandle] = useState([]);
  const [transferData, setTransferData] = useState(json_style_data);
  const [shopData, setShopData] = useState([]);

  const offer_ribbon = document.querySelector(
    "." + config[OFFER_RIBBON].className
  );
  const discount_label = document.querySelector(
    "." + config[DISCOUNT_LABEL].className
  );

  //ADDING HIDE CLASS TO COLLECTION PAGE
  function setClassToButton() {
    var collection_href =
      '.card__inner a.full-unstyled-link[href*="/products/"],.grid-product__content a[href*="/collections/"],.grid__item .grid-view-item a.full-width-link[href*="/products/"], .card a[href*="/products/"],.grid .grid-uniform .grid-item a[href*="/products/"],.grid__item .card-wrapper a[href*="/products/"]';
    var product_item =
      '.card > .card__inner .card__content,.collection-product-card,.sf__pcard,.product-item__content,.card-product__wrapper,.products .product-col,.pr_list_item,.pr_grid_item,product-item,.product-wrap,.tt-layout-product-item .tt-product,.products-grid .grid-item,.product-grid .indiv-product,.collection-page__product-list .product-item,.product-list [data-product-item],.product-list .product-block,.collection-products .collection-product,.collection__grid-loop .product-index,.product-thumbnail[data-product-thumbnail],.filters-results .product-list .card,.product-loop .product-index,#main-collection-product-grid .product-index,.collection-container .product,.featured-collection .product,.collection__grid-item,.collection-product,[data-product-grid-item],.product-grid-item.product-grid-item--featured,.collection__products .product-grid-item,.featured-collection__wrapper .grid__item,.collection-alternating-product,.product-list-item,.product-grid .grid__item,collection-product-grid [class*="column"],.collection-filters .product-grid-item,.product-grid .product-item,.featured-collection__content .featured-collection__item,.collection-grid .grid-item.grid-product,#CollectionProductGrid .collection-list li,.collection__products .product-item,.collection__products .product-item,#main-collection-product-grid .product-loop__item,.product-loop .product-loop__item,#product-grid .grid__item,.products #ajaxSection c:not(.card-price),#main-collection-products .product,.grid.gap-theme > li,.mainCollectionProductGrid .grid .block-product,.collection-grid-main .items-start > .block,.collection-list-products .grid__item .grid-product__wrapper,.s-collection__products .c-product-item,.products-grid .product,[data-section-type="collection"] .group.block,.blocklayout .block.product,.sf__pcard,.product-grid .product-block,.product-list .product-block .product-block__inner,.grid__item .product-card,.collection.grid .product-item .product-item__wrapper,.collection--body--grid .product--root,.o-layout__item .product-card,.productgrid--items .productgrid--item .productitem,.box__collection,.collection-page__product,.collection-grid__row .product-block .product-block__inner,.ProductList .Grid__Cell .ProductItem .ProductItem__Wrapper,.items .item .item__inner,.grid-flex .product-block,.product-loop .product,.collection__products .product-tile,.product-list .product-item,.grid__item .grid-product__content,.product-grid .grid-item .grid-item__content,.collection .product-item,.product-grid .grid__item .indiv-product,.collection__grid .product-card .product-card-info,.collection-list .block,.collection__products .product-item,.product--root[data-product-view=grid],.grid__wrapper .product-loop__item,.collection__list-item,.grid__item.grid__item--collection-template,.product-recommendations__inner .grid__item, #CollectionSection .grid-uniform .grid-item, #shopify-section-collection-template .product-item, #shopify-section-collection-template .grid__item, .collections__products .featured-collections__item,#product-grid .grid__item, .template-collection .grid--uniform .grid__item,.collection-grid-section:not(.shopify-section),.spf-product-card,.grid__item .card-wrapper,.grid-item';

    var handleInArray = [];

    document.querySelectorAll(collection_href).forEach((t) => {
      var n = t
        .getAttribute("href")
        .substring(t.getAttribute("href").lastIndexOf("/"))
        .replace("/", "")
        .split("?")[0];
      if (-1 == n.indexOf(".")) {
        var addToQuoteElement = document.createElement("div");
        if (null != t.closest(product_item)) {
          if (handleInArray.indexOf(n) === -1) {
            handleInArray.push(n);
            var a = t.closest(product_item);
            setHandle((current) => [...current, n]);
            a.append(addToQuoteElement);
            addToQuoteElement.setAttribute("id", n);
            addToQuoteElement.classList.add("ds_offer_ribbon_class_q78er");
          }
        }
      }
    });
  }
  const getCustomization = async () => {
    let payLoad = {
      shop: window.Shopify.shop,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}getCustomization`,
      {
        data: payLoad,
      }
    );
    // console.log("response.data");
    // console.log(JSON.parse(response.data.data.customizations_json));
    setTransferData(JSON.parse(response.data.data.customizations_json));
  };

  // GET DISCOUNT DATA FROM THE DATABSE
  const getDiscountsDetails = async () => {
    let payLoad = {
      shop: window.Shopify.shop,
    };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}getDiscounts`,
      {
        data: payLoad,
      }
    );
    // console.log("getDiscounts");
    // console.log(response.data);
    setShopData(response.data.data);
  };

  useEffect(() => {
    getDiscountsDetails();
    getCustomization();
  }, []);

  useEffect(() => {
    setClassToButton();
  }, [shopData]);

  return (
    <>
      {/* render popup modal and label on product page */}
      {discount_label && window.meta.product
        ? ReactDOM.createPortal(
            <DiscountLabel json_style_data={transferData} />,
            discount_label
          )
        : null}

      {/* ṛender offer ribbon */}
      {getHandle.map((data) => {
        return ReactDOM.createPortal(
          <OfferRibbon productHandle={data} json_style_data={transferData} shopData={shopData} />,
          document.getElementById(data)
        );
      })}
    </>
  );
};

export default App;
