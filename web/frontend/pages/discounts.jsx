import {
  IndexTable,
  LegacyCard,
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
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
} from "@shopify/polaris";
import Select from "react-select";
import React, { useEffect, useState, useCallback } from "react";
import "../css/settings.css";
import axios from "axios";
import { useAuthenticatedFetch } from "../hooks";
import noImage from "../assets/noImage.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PageName() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};
  const [queryValue, setQueryValue] = useState("");
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const resourceName = {
    singular: "product",
    plural: "products",
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

  // DISCOUNT COMBOBOX LOGIC START
  useEffect(() => {
    const newOptions = discounts.map((discount) => ({
      value: discount.id,
      label: discount.title,
    }));

    setOptions(newOptions);
  }, [discounts]);

  const handleChange = (selectedOptions, productId) => {
    if (selectedOptions.length <= 3) {
      const updatedProducts = [...products];
      const productToUpdate = updatedProducts.find(
        (product) => product.id === productId
      );

      if (productToUpdate) {
        const updatedDiscounts = selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [];
        productToUpdate.discounts = updatedDiscounts;
      }
      setProducts(updatedProducts);
    } else {
      toast.error("You can select up to 3 options only!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // DISCOUNT COMBOBOX LOGIC END

  // PRODUCT DATA
  const rowMarkup = (productsToDisplay) => {
    return productsToDisplay.map(({ id, title, image, discounts }, index) => {
      // console.log("discounts", discounts);
      // Find the product Data with matching product_id
      const defaultOptions = discounts.map((discountId) => {
        const matchingOption = options.find(
          (option) => option.value === discountId
        );
        return matchingOption;
      });

      return (
        <IndexTable.Row
          key={`key-${id}`}
          id={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
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
              value={defaultOptions}
              onChange={(value) => handleChange(value, id)}
              options={options}
              placeholder="Discount Codes..."
            />
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  };

  // USEEFFECT, GET ALL DATA ON LOAD
  useEffect(() => {
    setLoading(true);
    getPriceRules();
    getProducts();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    rowMarkup(productsToDisplay);
  }, [productsToDisplay, products]);

  // GET DATA FROM THE DATABSE
  const getDiscountsDetails = async (updatedProducts) => {
    setLoading(true);
    axios
      .post("/api/getDiscountsDetails", {
        shop: shop_url,
      })
      .then((response) => {
        // console.log(response.data.data.shop_data);

        const product_data = response.data.data.shop_data;
        const updatedProductsCopy = [...updatedProducts];
        product_data.forEach((productData) => {
          const productIndex = updatedProductsCopy.findIndex(
            (product) => Number(productData.product_id) === Number(product.id)
          );

          if (productIndex !== -1) {
            updatedProductsCopy[productIndex].discounts = productData.discounts;
          }
        });

        // console.log("Updated Products:", updatedProductsCopy);
        setProducts(updatedProductsCopy);
        setLoading(false);
      });
  };

  // SAVE DATA IN THE DATABSE
  const handleSave = () => {
    setLoading(true);
    // console.log(products);

    axios
      .post("/api/saveDiscountsDetails", {
        shop: shop_url,
        data: products,
      })
      .then((response) => {
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

        const modifiedData = responseData.data.map((item, index) => ({
          ...item,
          discounts: [],
        }));
        // console.log(modifiedData);

        // Set the modified data to the state
        setProducts(modifiedData);

        // CALL API FUCTION TO GET DATA FROM DATABASE
        getDiscountsDetails(modifiedData);
        setLoading(false);
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

  if (loading === false) {
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
              <IndexFilters
                queryValue={queryValue}
                queryPlaceholder="Searching in all"
                filteringAccessibilityTooltip="Search (F)"
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={() => setQueryValue("")}
                cancelAction={{
                  onAction: onHandleCancel,
                  disabled: false,
                  loading: false,
                }}
                tabs={[]}
                selected={selected}
                onSelect={setSelected}
                filters={[]}
                hideFilters
                mode={mode}
                setMode={setMode}
              />
              <IndexTable
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                resourceName={resourceName}
                itemCount={products.length}
                headings={[
                  { title: "Image" },
                  { title: "Product" },
                  { title: "Discounts" },
                ]}
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
