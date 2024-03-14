import {
  Button,
  ButtonGroup,
  Card,
  FullscreenBar,
  Layout,
  LegacyTabs,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Tabs,
  TextContainer,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import "../css/index.css";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { json_style_data } from "../Static/General_settings";
import DiscountLabelSettings from "../components/SidebarSettings/DiscountLabelSettings";
import PopupSettings from "../components/SidebarSettings/PopupSettings";
import OfferRibbonSettings from "../components/SidebarSettings/OfferRibbonSettings";
import DisccountLabel from "../components/Preview/DiscountLabel";
import PopupModal from "../components/Preview/PopupModal";
import OfferRibbon from "../components/Preview/OfferRibbon";
import { ToastContainer, toast } from "react-toastify";

function CustomizationCorner() {
  const shop_url = document.getElementById("shopOrigin").value;

  const [transferData, setTransferData] = useState(json_style_data);
  const [APIresponse, setAPIresponse] = useState(json_style_data);
  const [loading, setLoading] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "0",
      content: "DISCOUNT LABEL",
      panelID: "Discount-Label",
    },
    {
      id: "1",
      content: "POPUP MODAL",
      panelID: "Popup-Modal",
    },
    {
      id: "2",
      content: "OFFER RIBBON",
      panelID: "Offer-Ribbon",
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
                    ? "Customization Corner"
                    : "Unsaved Changes"}
                </p>
              </div>
              <ButtonGroup>
                <Button
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
            <LegacyTabs
              fitted
              tabs={tabs}
              selected={activeTab}
              onSelect={(value) => {
                setActiveTab(value);
              }}
            >
              {/* SETTINGS FEATURE */}
              <div style={{ marginTop: "15px" }}>
                <Layout>
                  {/* SIDEBAR FUNCTIONALITY */}
                  <Layout.Section variant="oneThird">
                    {activeTab == 0 && (
                      <DiscountLabelSettings
                        json_style_data={transferData}
                        dataCallback={handleTransferData}
                      />
                    )}
                    {activeTab == 1 && (
                      <PopupSettings
                        json_style_data={transferData}
                        dataCallback={handleTransferData}
                      />
                    )}
                    {activeTab == 2 && (
                      <OfferRibbonSettings
                        json_style_data={transferData}
                        dataCallback={handleTransferData}
                      />
                    )}
                  </Layout.Section>

                  {/* LIVE PREVIEW */}
                  <Layout.Section>
                    {activeTab == 0 && (
                      <DisccountLabel json_style_data={transferData} />
                    )}
                    {activeTab == 1 && (
                      <PopupModal json_style_data={transferData} />
                    )}
                    {activeTab == 2 && (
                      <OfferRibbon json_style_data={transferData} />
                    )}
                  </Layout.Section>
                </Layout>
              </div>
            </LegacyTabs>
          </Card>
        </Page>

        <ToastContainer />
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

export default CustomizationCorner;
