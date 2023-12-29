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
  Tabs,
  Text,
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

export default function PageName() {
  const [transferData, setTransferData] = useState(json_style_data);
  const [APIresponse, setAPIresponse] = useState(json_style_data);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
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

  // TO ENABLE OR DISABLE SAVE BUTTON
  useEffect(() => {
    setIsSaveButtonDisabled(isEqual(transferData, APIresponse));
  }, [transferData, APIresponse]);

  // HANDLE FUNCTION FOR TRANSFER DATA
  const handleTransferData = (data) => {
    setTransferData(data);
  };

  return (
    <div className="customization_page">
      <Page fullWidth>
        {/* <TitleBar
          title={
            isSaveButtonDisabled ? "Customization Corner" : "Unsaved Changes"
          }
          primaryAction={{
            content: "Save",
            disabled: isSaveButtonDisabled,
            onAction: () => console.log("Primary heyy"),
          }}
        /> */}
        <div className="customization_fullscreenbar">
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
                  onClick={() => console.log("Primary heyy")}
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
          </FullscreenBar>
        </div>
        <Card>
          {/* TABS  */}
          <InlineGrid gap="400" columns={3}>
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <Card
                  roundedAbove="md"
                  background={
                    tab.id == activeTab
                      ? "bg-surface-info"
                      : "bg-surface-secondary"
                  }
                >
                  {tab.content}
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
              {activeTab == 2 && <PopupModal json_style_data={transferData} />}
              {activeTab == 3 && <OfferRibbon json_style_data={transferData} />}
            </Layout.Section>
          </Layout>
        </Card>
      </Page>
    </div>
  );
}
