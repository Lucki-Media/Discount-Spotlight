import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Link,
  Text,
  FormLayout,
  TextField,
  Modal,
  FullscreenBar,
  Badge,
  ButtonGroup,
  Button,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAuthenticatedFetch } from "../hooks";
import axios from "axios";

import { ProductsCard } from "../components";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();

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
      <Banner title="Integrate app into theme" tone="info">
        <p>
          To enable our theme app extension please{" "}
          <a href={url} target="_blank">
            click here.
          </a>
        </p>
      </Banner>
      <Banner title="How does the app works?">
        <p>
          To familiarize yourself with the app's functionality, kindly{" "}
          <a href="#" onClick={handleChange}>
            follow this link.{" "}
          </a>
        </p>
      </Banner>
    </Page>
  );
}
