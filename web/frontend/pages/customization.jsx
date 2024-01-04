import {
  Button,
  ButtonGroup,
  Card,
  Frame,
  FullscreenBar,
  InlineGrid,
  Layout,
  LegacyTabs,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Tabs,
  Text,
  TextContainer,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";
import PopupSettings from "../components/SidebarSettings/PopupSettings";
import DiscountLabelSettings from "../components/SidebarSettings/DiscountLabelSettings";
import OfferRibbonSettings from "../components/SidebarSettings/OfferRibbonSettings";
import { json_style_data } from "../Static/General_settings";
import OfferRibbon from "../components/Preview/OfferRibbon";
import DisccountLabel from "../components/Preview/DiscountLabel";
import PopupModal from "../components/Preview/PopupModal";
import "../css/settings.css";
import axios from "axios";

export default function PageName() {
  const shop_url = document.getElementById("shopOrigin").value;

  const [transferData, setTransferData] = useState(json_style_data);
  const [APIresponse, setAPIresponse] = useState(json_style_data);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const tabs = [
    {
      id: "1",
      content: "Discount Label",
    },
    {
      id: "2",
      content: "Popup Modal",
    },
    {
      id: "3",
      content: "Offer Ribbon",
    },
  ];

  // USEEFFECT
  useEffect(() => {
    getCustomizationDetails();
  }, []);

  // FETCH DETAILS
  const getCustomizationDetails = async () => {
    setLoading(true);
    axios
      .post("/api/getCustomizationDetails", {
        shop: shop_url,
      })
      .then((response) => {
        // console.log(   JSON.parse(response.data.data.shop_data.customizations_json) );
        setTransferData(
          JSON.parse(response.data.data.shop_data.customizations_json)
        );
        setAPIresponse(
          JSON.parse(response.data.data.shop_data.customizations_json)
        );
        setLoading(false);
      });
  };

  // SAVE DETAILS
  const saveCustomizationDetails = async () => {
    setLoading(true);
    axios
      .post("/api/saveCustomizationDetails", {
        shop: shop_url,
        transferData: transferData,
      })
      .then((response) => {
        // console.log(response.data.data.shop_data.customizations_json);
        setTransferData(
          JSON.parse(response.data.data.shop_data.customizations_json)
        );
        setAPIresponse(
          JSON.parse(response.data.data.shop_data.customizations_json)
        );
      });
    setLoading(false);
  };

  // TO ENABLE OR DISABLE SAVE BUTTON
  useEffect(() => {
    setIsSaveButtonDisabled(isEqual(transferData, APIresponse));
  }, [transferData, APIresponse]);

  // HANDLE FUNCTION FOR TRANSFER DATA
  const handleTransferData = (data) => {
    setTransferData(data);
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
                    ? "Customization Corner"
                    : "Unsaved Changes"}
                </p>
              </div>
              <ButtonGroup>
                <Button
                  variant="primary"
                  disabled={isSaveButtonDisabled}
                  onClick={saveCustomizationDetails}
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
          </FullscreenBar>
        </div>
        <Page fullWidth>
          <Card>
            {/* TABS  */}
            <InlineGrid gap="400" columns={3}>
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #EAF4FF",
                    borderRadius: 12,
                  }}
                >
                  <Card
                    roundedAbove="md"
                    background={
                      tab.id == activeTab
                        ? "bg-surface-info"
                        : "bg-surface-secondary"
                    }
                  >
                    <Text variant="headingMd" as="h6">
                      {tab.content}
                    </Text>
                  </Card>
                </div>
              ))}
            </InlineGrid>

            <hr className="bottom_border" />

            {/* SETTINGS FEATURE */}
            <Layout>
              {/* SIDEBAR FUNCTIONALITY */}
              <Layout.Section variant="oneThird">
                {activeTab == 1 && (
                  <DiscountLabelSettings
                    json_style_data={transferData}
                    dataCallback={handleTransferData}
                  />
                )}
                {activeTab == 2 && (
                  <PopupSettings
                    json_style_data={transferData}
                    dataCallback={handleTransferData}
                  />
                )}
                {activeTab == 3 && (
                  <OfferRibbonSettings
                    json_style_data={transferData}
                    dataCallback={handleTransferData}
                  />
                )}
              </Layout.Section>

              {/* LIVE PREVIEW */}
              <Layout.Section>
                {activeTab == 1 && (
                  <DisccountLabel json_style_data={transferData} />
                )}
                {activeTab == 2 && (
                  <PopupModal json_style_data={transferData} />
                )}
                {activeTab == 3 && (
                  <OfferRibbon json_style_data={transferData} />
                )}
              </Layout.Section>
            </Layout>
          </Card>
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
