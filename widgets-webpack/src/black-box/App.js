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
    var handleInArray = [];
    var productSelectors = [
      '[class*="product"][class*="loop"][class*="title"]',
      '[class*="card"][class*="info"]',
      '[class*="card"][class*="content"]',
      '.column > div [class*="card"][class*="details"][class*="link"]',
      '[class*="product"][class*="info"]',
      '[class*="tt"][class*="product"][class*="parent"]',
      '[class*="product"][class*="name"]',
      '[class*="product"][class*="item"][class*="image"]',
      '[class*="grid"][class*="product"][class*="image"]',
    ];

    document.querySelectorAll(productSelectors.join(", ")).forEach((t) => {
      var anchorElements =
        t.querySelectorAll("a").length > 0
          ? t.querySelectorAll("a")
          : t.parentNode.querySelectorAll("a").length > 0
          ? t.parentNode.querySelectorAll("a")
          : null;

      if (anchorElements) {
        anchorElements.forEach((anchorElement) => {
          var href = anchorElement.getAttribute("href");
          if (href && href !== "#" && !href.startsWith("javascript")) {
            var n = href
              .substring(href.lastIndexOf("/"))
              .replace("/", "")
              .split("?")[0];

            // Check if href starts with "/products"
            if (
              n !== null &&
              (href.startsWith("/products") ||
                href.match(/^\/collections\/[^\/]+\/products/))
            ) {
              if (handleInArray.indexOf(n) === -1) {
                handleInArray.push(n);

                // Check if any child element contains the class
                if (!t.querySelector(".ds_offer_ribbon_class_q78er")) {
                  var addToQuoteElement = document.createElement("div");
                  t.appendChild(addToQuoteElement);

                  // addToQuoteElement.innerText = "Hello Vidhee";
                  // addToQuoteElement.setAttribute("id", n + "##" + (Math.floor(Math.random() * 900000 + 100000))); // append random 6-digit number to generate unique id even same product is showing multiple times
                  addToQuoteElement.setAttribute("id", n);
                  addToQuoteElement.classList.add(
                    "ds_offer_ribbon_class_q78er"
                  );
                  setHandle((current) => [...current, n]);

                  // addToQuoteElement.style.height = "100px";
                  // addToQuoteElement.style.width = "200px";
                  // addToQuoteElement.style.background = "red";
                  // addToQuoteElement.style.display = "block";
                }
              }
            }

            // Return from the inner loop once a valid href is found
            return;
          }
        });
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
      {shopData.length > 0 &&
        getHandle.map((data) => {
          return ReactDOM.createPortal(
            <OfferRibbon
              productHandle={data}
              json_style_data={transferData}
              shopData={shopData}
            />,
            document.getElementById(data)
          );
        })}
    </>
  );
};

export default App;
