import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

const GET_PRODUCTS = `
  query{
    priceRules (first:50){
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        id
        title
        status
      }
    }
  }
`;

export default async function getPriceRules(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const response = await client.query({
      data: {
        query: GET_PRODUCTS,
      },
    });
    return response.body.data;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
