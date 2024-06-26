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
import "react-toastify/dist/ReactToastify.css";
import isEqual from "lodash/isEqual";
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

  const [planLimitation, setPlanLimitation] = useState({
    productLimit: 10,
    discountLimit: 3,
  });
  const [queryValue, setQueryValue] = useState("");
  const [filterLoading, setfilterLoading] = useState(false);
  const [addDiscountModal, openAddDiscountModal] = useState(false);
  const [removeDiscountModal, openRemoveDiscountModal] = useState(false);
  const [initFlag, setInitFlag] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [APIresponse, setAPIresponse] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
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
    const updatedProductsCopy = [...discountProducts];

    for (const discountCode of discountArray) {
      for (const productId of product_data) {
        const productIndex = updatedProductsCopy.findIndex(
          (product) => Number(product.product_id) === Number(productId)
        );

        if (productIndex !== -1) {
          // if product exist in updatedProductsCopy && not reached at limit and discount not add then add it
          if (
            (updatedProductsCopy[productIndex].discounts.length <
              planLimitation.discountLimit ||
              planLimitation.discountLimit === -1) &&
            !updatedProductsCopy[productIndex].discounts.includes(discountCode)
          ) {
            updatedProductsCopy[productIndex].discounts.push(discountCode);
          }
        } else {
          // if product does not exist then get detail of the product add it product array in updatedProductsCopy
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
      // update Products
      setDiscountProducts(updatedProductsCopy);
    }

    // update combobox values which is showing now on the screen (products state)
    const currentProducts = [...products];
    for (const current of currentProducts) {
      const productIndex = updatedProductsCopy.findIndex(
        (product) =>
          Number(product.product_id) === Number(current.node.id.match(/\d+/)[0])
      );
      if (productIndex !== -1) {
        current.node.discounts = updatedProductsCopy[productIndex].discounts;
      }
    }

    setProducts(currentProducts); // UPDATE CURRENT PRODUCT LIST
    clearSelection(); // To clear the data store merchant has selected
    openAddDiscountModal(false);
  };
  // ADD DISCOUNT IN BULK CODE END

  // REMOVE DISCOUNT IN BULK CODE START
  const removeDiscountInBulk = async (discountArray) => {
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
    const updatedProductsCopy = [...discountProducts];

    for (const discountCode of discountArray) {
      for (const productId of product_data) {
        const productIndex = updatedProductsCopy.findIndex(
          (product) => Number(product.product_id) === Number(productId)
        );

        if (productIndex !== -1) {
          // if discountCode exists in it,  remove from discounts variable
          if (
            updatedProductsCopy[productIndex] &&
            updatedProductsCopy[productIndex].discounts &&
            updatedProductsCopy[productIndex].discounts.includes(discountCode)
          ) {
            updatedProductsCopy[productIndex].discounts = updatedProductsCopy[
              productIndex
            ].discounts.filter((item) => item !== discountCode);
          }
        }
      }
      // update Products
      setDiscountProducts(updatedProductsCopy);
    }

    // update combobox values which is showing now on the screen (products state)
    const currentProducts = [...products];
    for (const current of currentProducts) {
      const productIndex = updatedProductsCopy.findIndex(
        (product) =>
          Number(product.product_id) === Number(current.node.id.match(/\d+/)[0])
      );
      if (productIndex !== -1) {
        current.node.discounts = updatedProductsCopy[productIndex].discounts;
      }
    }
    setProducts(currentProducts); // UPDATE CURRENT PRODUCT LIST
    clearSelection(); // To clear the data store merchant has selected
    openRemoveDiscountModal(false);
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
    // setAPIresponse(APIresponse);
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
    // use initFlag to prevent Unsaved changesbar display issue on init
    if (initFlag) {
      getDiscountsDetails();
    }
  }, [APIresponse]);

  useEffect(() => {
    getPriceRules();
    getActivePlanLimitations();
  }, []);

  // TO ENABLE OR DISABLE SAVE BUTTON
  useEffect(() => {
    setIsSaveButtonDisabled(isEqual(discountProducts, APIresponse));
  }, [discountProducts, APIresponse]);

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

  // API CALL TO GET ACTIVE PLAN DETAIL
  const getActivePlanLimitations = async () => {
    setLoading(true);
    const response = await appFetch(
      `/api/getActivePlanLimitations?shop=${shop_url}`,
      {
        shop: shop_url,
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      // console.log("responseData");
      // console.log(responseData.data);
      setPlanLimitation(responseData.data);
      setLoading(false);
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

  // GET DATA FROM THE DATABASE
  const getDiscountsDetails = async () => {
    setLoading(true);
    await axios
      .post("/api/getDiscountsDetails", {
        shop: shop_url,
      })
      .then((response) => {
        setDiscountProducts(response.data.data.shop_data);
        setLoading(false);
        // Set APIresponse only when fetching data initially
        if (APIresponse.length === 0) {
          setAPIresponse(response.data.data.shop_data);
        }

        // CALL PRODUCT GQL API
        getData(response.data.data.shop_data);
        setInitFlag(false);
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching Discounts Details:",
          error
        );
        setLoading(false);
      });
  };

  // SAVE DATA IN THE DATABASE
  const handleSave = async () => {
    setQueryValue("");
    setMode();
    clearSelection(); // To clear the data store merchant has selected

    // Check how many products has non-empty discounts
    let count = 0;
    for (const item of discountProducts) {
      if (item.discounts.length > 0) {
        count++; // Increment the count if discounts array is not empty
      }
    }

    if (
      count <= planLimitation.productLimit ||
      planLimitation.productLimit === -1
    ) {
      // merchant has not reached at the limit
      setLoading(true);

      await axios
        .post("/api/saveDiscountsDetails", {
          shop: shop_url,
          data: discountProducts,
        })
        .then(async (response) => {
          await getData(response.data.data.shop_data);

          await setAPIresponse(response.data.data.shop_data);
          await setDiscountProducts(response.data.data.shop_data);
          setLoading(false);
          setIsSaveButtonDisabled(true);
          setTimeout(() => {
            // To show Toast after loading gets false
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
          }, 1000);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          setLoading(false);
        });
    } else {
      // they have selected more then the limitations, so they can not save the data
      toast.error(
        `You can select up to ${planLimitation.productLimit} products only!`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    }
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
            planLimitation={planLimitation}
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
            planLimitation={planLimitation}
            primaryButtonText="Add Discounts"
            descriptionNote={`Note: Please select up to ${planLimitation.discountLimit} discount codes to add to the selected products. The selected discount code will be added only if it does not already exist in the list of selected discount codes for a particular product, and the list has not reached its limit.`}
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
            planLimitation={planLimitation}
            descriptionNote={`Note: Please select up to ${planLimitation.discountLimit} discount codes for removal from the selected products. The selected discount code will be removed only if it already exist in the list of selected discount codes for a particular product.`}
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
                  background: isSaveButtonDisabled ? "#fff" : "#000000",
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
                      color: isSaveButtonDisabled ? "#000" : "#fff",
                    }}
                  >
                    {isSaveButtonDisabled
                      ? "Discount Management"
                      : "Unsaved Changes"}
                  </p>
                </div>
                <ButtonGroup>
                  <Button
                    disabled={isSaveButtonDisabled}
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
