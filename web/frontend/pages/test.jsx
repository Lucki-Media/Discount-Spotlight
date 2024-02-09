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
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import { useState, useCallback, useEffect } from "react";
import noImage from "../assets/noImage.jpeg";
import "../css/index.css";
import DiscountCombobox from "../components/DiscountCombobox";

function IndexFiltersWithFilteringModeExample() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [queryValue, setQueryValue] = useState("");
  const [filterLoading, setfilterLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // TO PREVENT CLICK EVENT OF CHECKBOX ON COMBOBOX
  const handleComboboxClick = (event) => {
    event.stopPropagation();
  };

  // SEARCH FIELD CODE START
  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
    value === "" ? getData() : handleFilterProducts(10, value);
  }, []);
  // SEARCH FIELD CODE END

  // TO LOAD INIT DATA
  useEffect(() => {
    getData();
    getPriceRules();
  }, []);

  // INIT API
  const getData = async () => {
    setfilterLoading(true);
    try {
      const response = await appFetch("/api/getProducts", {
        shop: shop_url,
      });

      if (response.ok) {
        const responseData = await response.json();
        // console.log("getData");
        // console.log(responseData);
        setProducts(responseData.response.products.edges);
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
        // console.log("getPriceRules");
        // console.log(responseData);

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
  // FILTER PRODUCT API & PAGINATION START
  const handleFilterProducts = async (first, searchValue) => {
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
        // console.log("getFilterProducts");
        // console.log(responseData.response.products);
        setProducts(responseData.response.products.edges);
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
        // console.log("getNextPageProducts");
        // console.log(responseData);
        setProducts(responseData.response.products.edges);
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
        // console.log("getPrevPageProducts");
        // console.log(responseData);
        setProducts(responseData.response.products.edges);
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

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products, {
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
          <DiscountCombobox discounts={discounts} />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  // PRODUCT TABLE DATA LOOP CODE END

  if (loading === false) {
    return (
      <div className="discount_index_table">
        <LegacyCard>
          <IndexFilters
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            filteringAccessibilityTooltip="Search (F)"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => {
              setQueryValue("");
              getData();
            }}
            cancelAction={{
              onAction: () => {
                setQueryValue("");
                getData();
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
          <IndexTable
            resourceName={resourceName}
            itemCount={products.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
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
        </LegacyCard>
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

export default IndexFiltersWithFilteringModeExample;
