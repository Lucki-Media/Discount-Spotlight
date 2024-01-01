import {
  IndexTable,
  LegacyCard,
  Text,
  Badge,
  useBreakpoints,
  Checkbox,
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
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import "../css/settings.css";
import axios from "axios";
import { useAuthenticatedFetch } from "../hooks";

export default function PageName() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [APIresponse, setApiResponse] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, SetLoading] = useState(false);

  console.log(process.env.API_VERSION);
  const orders = [
    {
      id: "1020",
      order: "#1020",
      date: "Jul 20 at 4:34pm",
      customer: "Jaydon Stanton",
      total: "$969.44",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1019",
      order: "#1019",
      date: "Jul 20 at 3:46pm",
      customer: "Ruben Westerfelt",
      total: "$701.19",
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1018",
      order: "#1018",
      date: "Jul 20 at 3.44pm",
      customer: "Leo Carder",
      total: "$798.24",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
  ];
  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const rowMarkup = orders.map(
    (
      { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
      index
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  // USEEFFECT, GET ALL DATA ON LOAD
  useEffect(() => {
    getDiscountsDetails();
    getProducts();
    // getDiscounts();
  }, []);

  // FETCH DETAILS
  const getDiscountsDetails = async () => {
    axios
      .post("/api/getDiscountsDetails", {
        shop: shop_url,
      })
      .then((response) => {
        getDiscounts(response.data.data.accessToken);
        console.log("response");
        console.log(response);
      });
  };
  // SHOPIFY PRODUCT API
  const getProducts = async (req, res) => {
    axios
      .get("/api/getProducts", {
        shop: shop_url,
      })
      .then((response) => {
        console.log("getProducts");
        console.log(response);
      });
  };

  // SHOPIFY DISCOUNT API
  const getDiscounts = async (accessToken) => {
    console.log("hello");
    console.log(accessToken);
    try {
      const response = await axios.get(
        "https://" + shop_url + "/admin/api/2023-10/price_rules.json",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "X-Shopify-Access-Token": accessToken,
          },
        }
      );

      console.log("response.data"); // Handle the response data as needed
      console.log(response.data); // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
                background: isSaveButtonDisabled ? "#fff" : "#5488c7",
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
                  variant="primary"
                  disabled={isSaveButtonDisabled}
                  onClick={() => console.log("Primary heyy")}
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
          </FullscreenBar>
        </div>
        <Page>
          <LegacyCard>
            <div className="discount_table">
              <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={orders.length}
                headings={[
                  { title: "Order" },
                  { title: "Date" },
                  { title: "Customer" },
                  { title: "Total", alignment: "end" },
                  { title: "Payment status" },
                  { title: "Fulfillment status" },
                ]}
                selectable={false}
              >
                {rowMarkup}
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
