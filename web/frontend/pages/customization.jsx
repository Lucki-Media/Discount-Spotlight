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

export default function PageName() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

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

        <hr />

        {/* SETTINGS FEATURE */}
        <Layout>
          {/* SIDEBAR FUNCTIONALITY */}
          <Layout.Section variant="oneThird">
            {activeTab == 2 && <PopupSettings/>}
            {activeTab == 1 && <DiscountLabelSettings/>}
            {activeTab == 3 && <OfferRibbonSettings/>}
          </Layout.Section>

          {/* LIVE PREVIEW */}
          <Layout.Section>
            {activeTab == 2 && "Popup Modal"}
            {activeTab == 1 && "Discount Label"}
            {activeTab == 3 && "Offer Ribbon"}
          </Layout.Section>
        </Layout>
      </Card>
    </Page>
  );
}
