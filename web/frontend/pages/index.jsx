import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAuthenticatedFetch } from "../hooks";
import axios from "axios";

import { ProductsCard } from "../components";
import { useEffect } from "react";


export default function HomePage() {
  const shop_url = document.getElementById("shopOrigin").value;
  const appFetch = useAuthenticatedFetch();
  const { t } = useTranslation();
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

  return (
    <Page narrowWidth>
      <TitleBar title="DASHBOARD" primaryAction={null} />
      <Layout>
        <Layout.Section>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
