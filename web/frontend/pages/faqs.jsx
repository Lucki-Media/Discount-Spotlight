import {
  Card,
  Page,
  Layout,
  TextContainer,
  Text,
  Icon,
  Collapsible,
  FullscreenBar,
} from "@shopify/polaris";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import DataFAQ from "../Static/DataFAQ";
import { useState } from "react";
import "../css/settings.css";

export default function PageName() {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => {
    setExpanded(panel);
  };

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
              <p className="fullscreenbar_headertitle">FAQs: Quick Answers</p>
            </div>
          </div>
        </FullscreenBar>
      </div>
      <Page>
        <Layout>
          <Layout.Section>
            {DataFAQ.map((item) => (
              <div
                className="faq_div"
                onClick={() => {
                  handleChange(item.panel);
                }}
                key={item.key}
                id={item.key}
              >
                <Card sectioned>
                  <div className="setting_title">
                    <span className="show_span">{item.question}</span>
                    <span>
                      {expanded === item.panel ? (
                        <Icon source={ChevronDownMinor} />
                      ) : (
                        <Icon source={ChevronRightMinor} />
                      )}
                    </span>
                  </div>
                  <div>
                    <Collapsible
                      open={expanded === item.panel}
                      id="basic-collapsible"
                      transition={{
                        duration: "500ms",
                        timingFunction: "ease-in-out",
                      }}
                      expandOnPrint
                    >
                      <hr />
                      <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
                    </Collapsible>
                  </div>
                </Card>
              </div>
            ))}
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
