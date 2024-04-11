import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./custom.css";
import "react-toastify/dist/ReactToastify.css";
import OfferRibbon from "../components/OfferRibbon/OfferRibbon";
import axios from "axios";
import { json_style_data } from "../Static/General_settings";

const App = () => {
  const [getHandle, setHandle] = useState([]);
  const [transferData, setTransferData] = useState(json_style_data);
  const [shopData, setShopData] = useState([]);

  //ADDING TARGET CLASS TO COLLECTION PAGE
  function setClassToButton() {
    var handleInArray = [];

    // DEFAULT TARGET FINDER CLASSES
    var defaultProductSelectors = [
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

    // GET MERCHANT DEFINED CLASS FROM DATA RETRIVED FROM DATABASE
    var targetClassString = transferData.offer_ribbon_settings.targetCssClasses;
    var addedProductSelectors =
      targetClassString !== undefined && targetClassString !== ""
        ? targetClassString.replace(/, /g, ",").split(",")
        : [];

    addedProductSelectors = addedProductSelectors
      .filter((item) => item.trim() !== "")
      .map((item) => "." + item); // Map each item and prepend '.'

    // CONCAT BOTH ARRAYS TO FIND THE TARGET TO SHOW OFFER RIBBON
    var productSelectors = addedProductSelectors
      .concat(defaultProductSelectors)
      .filter((item) => item.trim() !== "");

    // FIND TARGET CLASSES FROM productSelectors AND ADD LM DS CLASS TO THE TARGET+
    if (productSelectors.length > 0) {
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

                    // addToQuoteElement.innerText = "Hello There";
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

  // GET DISCOUNT DATA FROM THE DATABASE
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
  }, [shopData, transferData]);

  return (
    <>
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
