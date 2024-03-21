import { useAuthenticatedFetch } from "../hooks";
import {
  Card,
  Frame,
  FullscreenBar,
  Layout,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from "@shopify/polaris";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function pricingPlans() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

  const [loading, setLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState([
    { id: 1, status: "Active" },
    { id: 2, status: "Upgrade" },
    { id: 3, status: "Upgrade" },
  ]);

  //   API CALL TO UPDATE PLAN
  const handlePlanChange = async (data) => {
    if (data.status !== "Active") {
      setLoading(true);
      const response = await appFetch(`/api/updatePricingPlan`, {
        shop: shop_url,
        id: data.id,
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData");
        console.log(responseData);
        setLoading(false);
      }
    }
  };

  //   API CALL TO GET PLAN DATA
  const getPlanData = async () => {
    setLoading(true);
    const response = await appFetch(`/api/getPlanData?shop=${shop_url}`, {
      shop: shop_url,
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log("responseData");
      console.log(responseData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlanData();
  }, []);

  if (loading === false) {
    return (
      <>
        {/* LINK TO ADD PRICING ICONS  */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
          integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

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
                <p className="fullscreenbar_headertitle">Subscription Center</p>
              </div>
            </div>
          </FullscreenBar>
          <Page fullWidth>
            <section className="pricing-section">
              <div className="container">
                <Card>
                  <div className="outer-box">
                    <div className="row">
                      {/* FREE PLAN */}
                      <div className="pricing-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp">
                        <div className="inner-box">
                          <div className="icon-box">
                            <div className="icon-outer">
                              <i className="fas fa-star"></i>
                            </div>
                          </div>
                          <div className="price-box">
                            <div className="title"> Free Plan</div>
                            <h4 className="price">Free</h4>
                          </div>
                          <ul className="features">
                            <li className="true">All Basic Features</li>
                            <li className="true">
                              <b>10</b> products
                            </li>
                            <li className="true">
                              <b>3</b> discount
                            </li>
                            {/* <li className="true">Email support</li>
                          <li className="false">Unbranded</li> */}
                          </ul>
                          <div className="btn-box">
                            <a
                              href="#"
                              onClick={() => {
                                handlePlanChange(planDetails[0]);
                              }}
                              className="theme-btn"
                            >
                              {planDetails[0].status}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* BASIC PLAN */}
                      <div
                        className="pricing-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                        data-wow-delay="400ms"
                      >
                        <div className="inner-box">
                          <div className="icon-box">
                            <div className="icon-outer">
                              <i className="fas fa-rocket"></i>
                            </div>
                          </div>
                          <div className="price-box">
                            <div className="title">Basic Plan</div>
                            <h4 className="price">$5.99/month</h4>
                          </div>
                          <ul className="features">
                            <li className="true">All Basic Features</li>
                            <li className="true">
                              <b>50</b> products
                            </li>
                            <li className="true">
                              <b>5</b> discount
                            </li>
                            {/* <li className="true">Silver support</li>
                          <li className="true">Unbranded</li> */}
                          </ul>
                          <div className="btn-box">
                            <a
                              href="#"
                              onClick={() => {
                                handlePlanChange(planDetails[1]);
                              }}
                              className="theme-btn"
                            >
                              {planDetails[1].status}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* PREMIUM PLAN */}
                      <div
                        className="pricing-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                        data-wow-delay="800ms"
                      >
                        <div className="inner-box">
                          <div className="icon-box">
                            <div className="icon-outer">
                              <i className="fas fa-gem"></i>
                            </div>
                          </div>
                          <div className="price-box">
                            <div className="title">Premium Plan</div>
                            <h4 className="price">$50.99/month</h4>
                          </div>
                          <ul className="features">
                            <li className="true">All Basic Features</li>
                            <li className="true">
                              <b>unlimited</b> products
                            </li>
                            <li className="true">
                              <b>unlimited</b> discounts
                            </li>
                            {/* <li className="true">Gold support</li>
                          <li className="true">Unbranded</li> */}
                          </ul>
                          <div className="btn-box">
                            <a
                              href="#"
                              onClick={() => {
                                handlePlanChange(planDetails[2]);
                              }}
                              className="theme-btn"
                            >
                              {planDetails[2].status}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </Page>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <Frame>
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
        </Frame>
      </div>
    );
  }
}
