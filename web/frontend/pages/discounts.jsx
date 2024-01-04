import {
  IndexTable,
  LegacyCard,
  useBreakpoints,
  FullscreenBar,
  ButtonGroup,
  Button,
  Page,
  SkeletonPage,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  Card,
  Thumbnail,
} from "@shopify/polaris";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import "../css/settings.css";
import axios from "axios";
import { useAuthenticatedFetch } from "../hooks";
import noImage from "../assets/noImage.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PageName() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [shopData, setShopData] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const notify = () => {
    toast.info("Data saved successfully !", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  // DISCOUNT COMBOBOX LOGIC START
  useEffect(() => {
    const newOptions = discounts.map((discount) => ({
      value: discount.id,
      label: discount.title,
    }));

    setOptions(newOptions);
  }, [discounts]);

  const handleChange = (value, productId) => {
    // Create a copy of the selectedOptions array
    const updatedSelectedOptions = [...selectedOptions];

    // Update the selected option for the specific product
    updatedSelectedOptions[productId] = value;

    // Check and limit the number of selected options to 3
    if (value && value.length > 3) {
      updatedSelectedOptions[productId] = value.slice(0, 3);
    }

    // Update the state with the new array of selected options
    setSelectedOptions(updatedSelectedOptions);
  };

  // DISCOUNT COMBOBOX LOGIC END

  // PRODUCT DATA
  const rowMarkup = (productsToDisplay) => {
    return productsToDisplay.map(({ id, title, image }, index) => {
      // Find the product Data with matching product_id
      const matchingObject = shopData.find(
        (obj) => Number(obj.product_id) === Number(id)
      );
      let discountsValue = [];
      if (matchingObject) {
        discountsValue = matchingObject.discounts;
      }
      const defaultOptions = discountsValue.map((discountId) => {
        const matchingOption = options.find(
          (option) => option.value === discountId
        );
        return matchingOption;
      });

      return (
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell>
            <Thumbnail
              source={image != null && image.src != null ? image.src : noImage}
              size="small"
              alt="Black choker necklace"
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{title}</IndexTable.Cell>
          <IndexTable.Cell style={{ width: "50%" }}>
            <Select
              isMulti
              styles={{
                multiValueRemove: (styles) => ({
                  ...styles,
                  ":hover": {
                    backgroundColor: "#5488c7",
                    color: "white",
                  },
                }),
              }}
              value={selectedOptions[index]}
              defaultValue={defaultOptions}
              onChange={(value) => handleChange(value, index)}
              options={options}
              placeholder="Discount Codes..."
              max={3}
            />
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  };

  // USEEFFECT, GET ALL DATA ON LOAD
  useEffect(() => {
    setLoading(true);
    getDiscountsDetails();
    getPriceRules();
    getProducts();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // GET DATA FROM THE DATABSE
  const getDiscountsDetails = async () => {
    setLoading(true);
    axios
      .post("/api/getDiscountsDetails", {
        shop: shop_url,
      })
      .then((response) => {
        // console.log("getDiscountsDetails");
        // console.log(response);
        setShopData(response.data.data.shop_data);
        setLoading(false);
      });
  };

  // SAVE DATA IN THE DATABSE
  const handleSave = () => {
    setLoading(true);
    const productsWithDiscounts = products.map((product, index) => ({
      ...product,
      discounts: (selectedOptions[index] || []).map((option) => option.value),
    }));

    axios
      .post("/api/saveDiscountsDetails", {
        shop: shop_url,
        data: productsWithDiscounts,
      })
      .then((response) => {
        {
          notify();
        }
        // console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setLoading(false);
      });
  };

  // SHOPIFY PRODUCT API
  const getProducts = async (req, res) => {
    setLoading(true);
    try {
      const response = await appFetch("/api/getProducts", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        // console.log("getProducts");
        // console.log(responseData.data);
        setProducts(responseData.data);
      } else {
        console.error("Error fetching products:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
    setLoading(false);
  };

  // SHOPIFY PRICERULE API
  const getPriceRules = async (req, res) => {
    setLoading(true);
    try {
      const response = await appFetch("/api/pricerules", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        // console.log("getPriceRules");
        // console.log(responseData.data);
        setDiscounts(responseData.data);
      } else {
        console.error("Error fetching price rules:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching price rules:", error);
    }
    setLoading(false);
  };

  // PAGINATION LOGIC START
  const itemsPerPage = 10;

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter the products based on the current page
  const productsToDisplay = products.slice(startIndex, endIndex);

  const handleNextPage = () => {
    // Update the current page when the "Next" button is clicked
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    // Update the current page when the "Previous" button is clicked
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };
  // PAGINATION LOGIC END

  if (loading === false || products.length > 0) {
    return (
      <div className="customization_page">
        <div className="fullscreenbar_div">
          <FullscreenBar>
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                background: "#fff",
                transition: "background 0.5s ease-out 0s",
              }}
            >
              <div
                style={{
                  flexGrow: 1,
                }}
              >
                <p
                  className="fullscreenbar_headertitle"
                  style={{
                    color: "#000",
                  }}
                >
                  Discount Management
                </p>
              </div>
              <ButtonGroup>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={loading}
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
          </FullscreenBar>
        </div>
        <ToastContainer />
        <Page>
          <LegacyCard>
            <div className="discount_table">
              <IndexTable
                resourceName={resourceName}
                itemCount={products.length}
                headings={[
                  { title: "Image" },
                  { title: "Product" },
                  { title: "Discounts" },
                ]}
                selectable={false}
                pagination={{
                  hasNext: endIndex < products.length,
                  hasPrevious: currentPage > 1,
                  onNext: handleNextPage,
                  onPrevious: handlePrevPage,
                }}
              >
                {rowMarkup(productsToDisplay)}
              </IndexTable>
            </div>
          </LegacyCard>
        </Page>
      </div>
    );
  } else {
    return (
      <div>
        <Card>
          <SkeletonPage primaryAction>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <SkeletonBodyText />
                </Card>
                <Card sectioned>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
              </Layout.Section>
            </Layout>
          </SkeletonPage>
        </Card>
      </div>
    );
  }
}
