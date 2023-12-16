import { Card, Page, Layout, TextContainer, Text, Icon, Collapsible } from "@shopify/polaris";
import { ChevronRightMinor, ChevronDownMinor } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import DataFAQ from "../Static/DataFAQ";
import { useState } from "react";
import "../css/faqs.css";

export default function PageName() {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => {
    setExpanded(panel);
  };

  return (
    <Page>
      <TitleBar
        title="FAQs: Quick Answers"
      />
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
  );
}
