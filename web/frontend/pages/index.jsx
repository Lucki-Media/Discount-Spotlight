import {
  Card,
  Page,
  Layout,
  Text,
  Banner,
  List,
  FullscreenBar,
} from "@shopify/polaris";
import axios from "axios";
import {
  ThemeTemplateIcon,
  PaintBrushFlatIcon,
  QuestionCircleIcon,
  DiscountIcon,
} from "@shopify/polaris-icons";
import { CChart } from "@coreui/react-chartjs";
import { useEffect, useState } from "react";

export default function HomePage() {
  const shop_url = document.getElementById("shopOrigin").value;

  const [year, setYear] = useState(new Date().getFullYear());
  const [graphArray, setGraphArray] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const fetchDashboardData = async () => {
    axios
      .post("/api/shopify_session_data", {
        shop: shop_url,
      })
      .then((response) => {
        // console.log('response' , response);
        setGraphArray(response.data.data.count_data);
        setYear(response.data.data.year);
      });
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const url =
    "https://" +
    document.getElementById("shopOrigin").value +
    "/admin/themes/current/editor?context=apps";

  return (
    <>
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
              <p className="fullscreenbar_headertitle">Dazzling Dashboard</p>
            </div>
          </div>
        </FullscreenBar>
      </div>
      <Page>
        {/* THEME APP EXTENSION BANNER */}
        <Banner
          title="Enable Theme App Extension"
          icon={ThemeTemplateIcon}
          action={{
            variant: "primary",
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
                To understand the functionality of our app, please watch our
                instructional video :{" "}
                <a
                  href="https://luckistore.in/discount_spotlight/LM-DD-How-it-works.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00527C", fontWeight: 600 }}
                >
                  Watch Video
                </a>
              </p>
            </Banner>
          </Card>
        </div>

        {/* REDIRECTION BANNERS */}
        <div style={{ padding: "20px 0" }}>
          <Layout>
            <Layout.Section variant="oneThird">
              <Banner
                title="Discount Management"
                icon={DiscountIcon}
                action={{
                  variant: "primary",
                  content: "Manage Discounts",
                  url: "/discounts",
                }}
                tone="info"
              >
                <List>
                  <List.Item>
                    Manage discounts for each product with our Discount
                    Management feature.
                  </List.Item>
                </List>
              </Banner>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Banner
                title="Customize Your Popup Modal"
                icon={PaintBrushFlatIcon}
                action={{
                  variant: "primary",
                  content: "Go to Customization",
                  url: "/customization",
                }}
                tone="info"
              >
                <List>
                  <List.Item>
                    Personalize the appearance of popup modal to match your
                    store's branding.
                  </List.Item>
                </List>
              </Banner>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Banner
                title="Frequently Asked Questions"
                icon={QuestionCircleIcon}
                action={{
                  variant: "primary",
                  content: "Visit FAQ",
                  url: "/faqs",
                }}
                tone="info"
              >
                <List>
                  <List.Item>
                    Quickly find answers to common questions about app and its
                    features.
                  </List.Item>
                </List>
              </Banner>
            </Layout.Section>
          </Layout>
        </div>

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
                        label: `Clicks on Discount Label (Year ${year})`,
                        backgroundColor: "#303030 ",
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
    </>
  );
}
