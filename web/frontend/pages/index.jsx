import { Card, Page, Layout, Text, Banner, List } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAuthenticatedFetch } from "../hooks";
import axios from "axios";
import {
  TemplateMajor,
  PaintBrushMajor,
  QuestionMarkMajor,
  DiscountsMajor,
} from "@shopify/polaris-icons";
import { CChart } from "@coreui/react-chartjs";

import { ProductsCard } from "../components";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [graphArray, setGraphArray] = useState([
    12, 34, 43, 5, 25, 36, 22, 35, 47, 20, 99, 54
  ]);
  
  console.log(shop_url);
  const fetchDashboardData = async () => {
    axios
      .post("/api/shopify_session_data", {
        shop: shop_url,
      })
      .then((response) => {
        console.log(response);
      });
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const url =
    "https://" +
    document.getElementById("shopOrigin").value +
    "/admin/themes/current/editor?context=apps";

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);

  return (
    <Page>
      <TitleBar title="Spotlight Dashboard" />

      {/* THEME APP EXTENSION BANNER */}
      <Banner
        title="How does the app works?"
        icon={TemplateMajor}
        action={{
          content: "Enable",
          url: url,
          target: "_blank",
        }}
        tone="info"
      >
        <List>
          <List.Item>
            To integrate our theme app extension, kindly enable it on your
            Shopify online store.
          </List.Item>
        </List>
      </Banner>

      {/* VIDEO BANNER */}
      <div style={{ padding: "20px 0" }}>
        <Card sectioned>
          <div style={{ paddingBottom: 10 }}>
            <Text variant="headingMd" as="h6">
              How does the app works?
            </Text>
          </div>
          <Banner>
            <p>
              To familiarize yourself with the app's functionality, kindly{" "}
              <a
                href="#"
                onClick={handleChange}
                style={{ color: "#00527C", fontWeight: 600 }}
              >
                follow this link.{" "}
              </a>
            </p>
          </Banner>
        </Card>
      </div>

      {/* REDIRECTION BANNERS */}
      <Layout>
        <Layout.Section variant="oneThird">
          <Banner
            title="Customize Your Popup Modal"
            icon={PaintBrushMajor}
            action={{
              content: "Go to Customization",
              url: "/customization",
            }}
            tone="info"
          >
            <List>
              <List.Item>
                Personalize the appearance of your popup modal to match your
                store's branding.
              </List.Item>
            </List>
          </Banner>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Banner
            title="Discount Management"
            icon={DiscountsMajor}
            action={{
              content: "Manage Discounts",
              url: "/discounts", 
            }}
            tone="info"
          >
            <List>
              <List.Item>
                Manage discounts for each product with our Discount Management
                feature.
              </List.Item>
            </List>
          </Banner>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Banner
            title="Frequently Asked Questions"
            icon={QuestionMarkMajor}
            action={{
              content: "Visit FAQ",
              url: "/faqs", 
            }}
            tone="info"
          >
            <List>
              <List.Item>
                Quickly find answers to common questions about our app and its
                features.
              </List.Item>
            </List>
          </Banner>
        </Layout.Section>
      </Layout>

      {/* GRAPH */}
      <Layout>
        <Layout.Section>
          <div style={{ padding: "20px 0 100px 0px" }}>
            <Card sectioned>
              <CChart
                type="bar"
                data={{
                  labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "June",
                    "July",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  datasets: [
                    {
                      label: "Clicks on Discount Label",
                      backgroundColor: "#5488C7 ",
                      data: graphArray,
                    },
                  ],
                }}
                labels="months"
              />
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
