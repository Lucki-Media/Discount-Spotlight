import {
  Card,
  Frame,
  InlineGrid,
  Layout,
  LegacyTabs,
  Page,
  Tabs,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useState } from "react";
import PopupSettings from "../components/SidebarSettings/PopupSettings";
import DiscountLabelSettings from "../components/SidebarSettings/DiscountLabelSettings";
import OfferRibbonSettings from "../components/SidebarSettings/OfferRibbonSettings";
import { json_style_data } from "../Static/General_settings";
import OfferRibbon from "../components/Preview/OfferRibbon";
import DisccountLabel from "../components/Preview/DiscountLabel";
import PopupModal from "../components/Preview/PopupModal";

export default function PageName() {
  const [transferData, setTransferData] = useState(json_style_data);
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

  return (
    <div className="customization_page">
      <Page fullWidth>
        <TitleBar
          title="Customization Corner"
          primaryAction={{
            content: "Save",
            onAction: () => console.log("Primary heyy"),
          }}
        />
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
                <DiscountLabelSettings json_style_data={transferData} />
              )}
              {activeTab == 2 && <PopupSettings />}
              {activeTab == 3 && (
                <OfferRibbonSettings json_style_data={transferData} />
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
