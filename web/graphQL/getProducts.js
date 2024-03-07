import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

const GET_PRODUCTS = `
  query {
    products(first: 10) {
      edges {
        cursor
        node {
          id
          featuredImage {
            id
            url
          }
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export default async function getProducts(session) {
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
