import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Thumbnail,
  Card,
  SkeletonPage,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  Page,
  FullscreenBar,
  ButtonGroup,
  Button,
} from "@shopify/polaris";
import { ToastContainer, toast } from "react-toastify";
import { useAuthenticatedFetch } from "../hooks";
import { useState, useCallback, useEffect } from "react";
import noImage from "../assets/noImage.jpeg";
import "../css/index.css";
import DiscountCombobox from "../components/Discount/DiscountCombobox";
import axios from "axios";
import DiscountModal from "../components/Discount/DiscountModal";

function DiscountsManagement() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [queryValue, setQueryValue] = useState("");
  const [filterLoading, setfilterLoading] = useState(false);
  const [addDiscountModal, openAddDiscountModal] = useState(false);
  const [removeDiscountModal, openRemoveDiscountModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // BULK ACTION OPTION CODE START
  const promotedBulkActions = [
    {
      content: "Add discounts",
      onAction: () => openAddDiscountModal(true),
    },
    {
      content: "Remove discounts",
      onAction: () => openRemoveDiscountModal(true),
    },
  ];
  // BULK ACTION OPTION CODE END

  // ADD DISCOUNT IN BULK CODE START
  const addDiscountInBulk = async (discountArray) => {
    let product_data = [];

    // GET PRODUCT LIST IN WHICH YOU HAVE TO ADD DISCOUNT
    if (allResourcesSelected) {
      // Merchant selects all product
      const response = await appFetch("/api/getAllProducts", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        const idArray = Object.values(responseData.data)
          .filter((obj) => obj && obj.id)
          .map((obj) => Number(obj.id));
        product_data = [...idArray]; // IDs of all products of store
      } else {
        product_data = [];
      }
    } else {
      // Merchant selects custom selection product
      const idArray = selectedResources.map((str) =>
        Number(str.match(/\d+/)[0])
      );
      product_data = [...idArray]; // selected product ids
    }
    console.log(product_data);

    for (const discountCode of discountArray) {
      const updatedProductsCopy = [...discountProducts];

      for (const productId of product_data) {
        const productIndex = updatedProductsCopy.findIndex(
          (product) => Number(product.product_id) === Number(productId)
        );

        if (productIndex !== -1) {
          if (
            updatedProductsCopy[productIndex].discounts.length < 3 &&
            !updatedProductsCopy[productIndex].discounts.includes(discountCode)
          ) {
            updatedProductsCopy[productIndex].discounts.push(discountCode);
          }
        } else {
          const response = await appFetch(
            `/api/getProductById?productId=${productId}`,
            {
              shop: shop_url,
            }
          );

          if (response.ok) {
            const responseData = await response.json();
            updatedProductsCopy.push({
              shop: shop_url,
              product_id: productId,
              product_image:
                responseData.image && responseData.image.src
                  ? responseData.image.src
                  : "",
              discounts: [discountCode],
              product_name: responseData.title,
            });
          }
        }
      }
      setDiscountProducts(updatedProductsCopy);
    }
  };
  // ADD DISCOUNT IN BULK CODE END
  console.log(discountProducts);

  // REMOVE DISCOUNT IN BULK CODE START
  const removeDiscountInBulk = (value) => {
    console.log("removeDiscountInBulk", value);
    console.log("allResourcesSelected", allResourcesSelected);
    console.log("selectedResources", selectedResources);
  };
  // REMOVE DISCOUNT IN BULK CODE END

  // COMBOBOX CALLBACK FUNCTION
  const handleDiscountCallback = (id, value) => {
    const product_data = [...discountProducts]; // Data from Database
    const productIndex = product_data.findIndex(
      // find index of product array
      (productData) =>
        Number(id.match(/\d+/)[0]) === Number(productData.product_id)
    );
    if (productIndex !== -1) {
      // update discount array of particular product
      product_data[productIndex].discounts = value;
    } else {
      // add new product array which does not exist in Database
      const found_product_detail = products.find((item) => item.node.id === id);

      if (found_product_detail) {
        product_data.push({
          shop: shop_url,
          product_id: id.match(/\d+/)[0],
          product_image:
            found_product_detail.node.featuredImage &&
            found_product_detail.node.featuredImage.url
              ? found_product_detail.node.featuredImage.url
              : "",
          discounts: value,
          product_name: found_product_detail.node.title,
        });
      }
    }
    setDiscountProducts(product_data);
  };

  // TO PREVENT CLICK EVENT OF CHECKBOX ON COMBOBOX
  const handleComboboxClick = (event) => {
    event.stopPropagation();
  };

  // SEARCH FIELD CODE START
  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      value === ""
        ? getData(discountProducts)
        : handleFilterProducts(10, value, discountProducts);
    },
    [discountProducts]
  );
  // SEARCH FIELD CODE END

  // TO LOAD INIT DATA
  useEffect(() => {
    // get data from the database after call product api
    getDiscountsDetails();
    getPriceRules();
  }, []);

  // INIT API
  const getData = async (discountData) => {
    clearSelection(); // To clear the data store merchant has selected
    setfilterLoading(true);
    try {
      const response = await appFetch("/api/getProducts", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedProductsCopy = responseData.response.products.edges; // Data from GQL API
        const product_data = [...discountData]; // Data from Database

        // GET SELECTED DISCOUNTS FOR EACH PRODUCT
        updatedProductsCopy.forEach((product) => {
          const productIndex = product_data.findIndex(
            (productData) =>
              Number(product.node.id.match(/\d+/)[0]) ===
              Number(productData.product_id)
          );

          product.node.discounts =
            productIndex !== -1 ? product_data[productIndex].discounts : [];
        });

        setProducts(updatedProductsCopy);
        setPagination(responseData.response.products.pageInfo);
        setfilterLoading(false);
        setLoading(false);
      } else {
        console.error("Error fetching Products:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching Products:", error);
    }
  };

  const getPriceRules = async () => {
    setfilterLoading(true);
    try {
      const response = await appFetch("/api/getPriceRules", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        const newOptions = responseData.data.map((discount) => ({
          value: discount.id,
          label: discount.title,
        }));
        setDiscounts(newOptions);
        setfilterLoading(false);
        setLoading(false);
      } else {
        console.error("Error fetching PriceRules:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching PriceRules:", error);
    }
  };

  // GET DATA FROM THE DATABSE
  const getDiscountsDetails = async () => {
    setLoading(true);
    await axios
      .post("/api/getDiscountsDetails", {
        shop: shop_url,
      })
      .then((response) => {
        // console.log(response.data.data.shop_data);
        setDiscountProducts(response.data.data.shop_data);
        setLoading(false);

        // CALL PRODUCT GQL API
        getData(response.data.data.shop_data);
      });
  };

  // SAVE DATA IN THE DATABSE
  const handleSave = async () => {
    clearSelection(); // To clear the data store merchant has selected
    setLoading(true);

    await axios
      .post("/api/saveDiscountsDetails", {
        shop: shop_url,
        data: discountProducts,
      })
      .then(async (response) => {
        await getData(response.data.data.shop_data);
        await setDiscountProducts(response.data.data.shop_data);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setLoading(false);
      });
  };

  // FILTER PRODUCT API & PAGINATION START
  const handleFilterProducts = async (first, searchValue, discountProducts) => {
    clearSelection(); // To clear the data store merchant has selected
    setfilterLoading(true);
    try {
      const response = await appFetch(
        `/api/getFilterProducts?first=${first}&searchValue=${searchValue}`,
        {
          shop: shop_url,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const updatedProductsCopy = responseData.response.products.edges; // Data from GQL API
        const product_data = [...discountProducts]; // Data from Database

        // GET SELECTED DISCOUNTS FOR EACH PRODUCT
        updatedProductsCopy.forEach((product) => {
          const productIndex = product_data.findIndex(
            (productData) =>
              Number(product.node.id.match(/\d+/)[0]) ===
              Number(productData.product_id)
          );

          product.node.discounts =
            productIndex !== -1 ? product_data[productIndex].discounts : [];
        });

        setProducts(updatedProductsCopy);
        setPagination(responseData.response.products.pageInfo);
        setfilterLoading(false);
      } else {
        console.error("Error fetching filter Products:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching filter Products:", error);
    }
  };
  // FILTER PRODUCT API & PAGINATION END

  // NEXT PAGE PRODUCT API & PAGINATION START
  const handleNextPage = async (first, after, searchValue) => {
    clearSelection(); // To clear the data store merchant has selected
    setfilterLoading(true);
    try {
      const response = await appFetch(
        `/api/getNextPageProducts?first=${first}&after=${after}&searchValue=${searchValue}`,
        {
          shop: shop_url,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const updatedProductsCopy = responseData.response.products.edges; // Data from GQL API
        const product_data = [...discountProducts]; // Data from Database

        // GET SELECTED DISCOUNTS FOR EACH PRODUCT
        updatedProductsCopy.forEach((product) => {
          const productIndex = product_data.findIndex(
            (productData) =>
              Number(product.node.id.match(/\d+/)[0]) ===
              Number(productData.product_id)
          );

          product.node.discounts =
            productIndex !== -1 ? product_data[productIndex].discounts : [];
        });

        setProducts(updatedProductsCopy);
        setPagination(responseData.response.products.pageInfo);
        setfilterLoading(false);
      } else {
        console.error("Error fetching Next Page Products:", response);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching Next Page Products:",
        error
      );
    }
  };
  // NEXT PAGE PRODUCT API & PAGINATION END

  // PREV PAGE PRODUCT API & PAGINATION START
  const handlePrevPage = async (last, before, searchValue) => {
    clearSelection(); // To clear the data store merchant has selected
    setfilterLoading(true);
    try {
      const response = await appFetch(
        `/api/getPrevPageProducts?last=${last}&before=${before}&searchValue=${searchValue}`,
        {
          shop: shop_url,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const updatedProductsCopy = responseData.response.products.edges; // Data from GQL API
        const product_data = [...discountProducts]; // Data from Database

        // GET SELECTED DISCOUNTS FOR EACH PRODUCT
        updatedProductsCopy.forEach((product) => {
          const productIndex = product_data.findIndex(
            (productData) =>
              Number(product.node.id.match(/\d+/)[0]) ===
              Number(productData.product_id)
          );

          product.node.discounts =
            productIndex !== -1 ? product_data[productIndex].discounts : [];
        });

        setProducts(updatedProductsCopy);
        setPagination(responseData.response.products.pageInfo);
        setfilterLoading(false);
      } else {
        console.error("Error fetching Prev Page Products:", response);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching Prev Page Products:",
        error
      );
    }
  };
  // PREV PAGE PRODUCT API & PAGINATION END

  // INDEX TABLE CODE START
  const { mode, setMode } = useSetIndexFiltersMode();
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const resourceIDResolver = (products) => {
    return products.node.id;
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(products, {
    resourceIDResolver,
  });
  // INDEX TABLE CODE END

  // PRODUCT TABLE DATA LOOP CODE START
  const rowMarkup = products.map(({ node }, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Thumbnail
          source={
            node.featuredImage != null && node.featuredImage.url != null
              ? node.featuredImage.url
              : noImage
          }
          size="small"
          alt="No Product Image"
        />
      </IndexTable.Cell>
      <IndexTable.Cell>{node.title}</IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={handleComboboxClick}>
          <DiscountCombobox
            product_id={node.id}
            discounts={discounts}
            selectedOptions={node.discounts}
            discountCallback={handleDiscountCallback}
          />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  // PRODUCT TABLE DATA LOOP CODE END

  if (loading === false) {
    return (
      <>
        {/* MODAL FOR DISCOUNT ADD  */}
        {addDiscountModal && (
          <DiscountModal
            discounts={discounts}
            title={`Add discounts to ${
              allResourcesSelected ? "All" : selectedResources.length
            } product(s)`}
            callbackClose={() => openAddDiscountModal(false)}
            returnSelected={addDiscountInBulk}
            primaryButtonText="Add Discounts"
          />
        )}

        {/* MODAL FOR DISCOUNT REMOVE  */}
        {removeDiscountModal && (
          <DiscountModal
            discounts={discounts}
            title={`Remove discounts from ${
              allResourcesSelected ? "All" : selectedResources.length
            } product(s)`}
            callbackClose={() => openRemoveDiscountModal(false)}
            returnSelected={removeDiscountInBulk}
            primaryButtonText="Remove Discounts"
          />
        )}

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
            <div className="discount_index_table">
              <LegacyCard>
                <IndexFilters
                  queryValue={queryValue}
                  queryPlaceholder="Searching in products"
                  filteringAccessibilityTooltip="Search (F)"
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={() => {
                    setQueryValue("");
                    getData(discountProducts);
                  }}
                  cancelAction={{
                    onAction: () => {
                      setQueryValue("");
                      getData(discountProducts);
                    },
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
                  loading={filterLoading}
                />
                <div className="index_table_parent_div">
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={products.length}
                    selectedItemsCount={
                      allResourcesSelected ? "All" : selectedResources.length
                    }
                    hasMoreItems
                    onSelectionChange={handleSelectionChange}
                    promotedBulkActions={promotedBulkActions}
                    headings={[
                      { title: "Image" },
                      { title: "Product" },
                      { title: "Discounts" },
                    ]}
                    pagination={{
                      hasNext: pagination.hasNextPage,
                      hasPrevious: pagination.hasPreviousPage,
                      onNext: () =>
                        handleNextPage(
                          10,
                          pagination.endCursor ? pagination.endCursor : "",
                          queryValue
                        ),
                      onPrevious: () =>
                        handlePrevPage(
                          10,
                          pagination.startCursor ? pagination.startCursor : "",
                          queryValue
                        ),
                    }}
                  >
                    {rowMarkup}
                  </IndexTable>
                </div>
              </LegacyCard>
            </div>
          </Page>
        </div>
      </>
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
export default DiscountsManagement;
