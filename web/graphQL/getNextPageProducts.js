import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export default async function getNextPageProducts(data) {
  var { session, first, after, searchValue } = data;
  first = Number(first);
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const response = await client.query({
      data: {
        query: `
        query products($first: Int, $after: String ${searchValue !== '' ? ', $query: String' : ''}) {
          products(first: $first, after: $after${searchValue !== '' ? ', query: $query' : ''}) {
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
              `,
        variables: {
          first: first,
          after: after,
          query: JSON.stringify(`*${searchValue}*`).replace(/"/g, '\\"'),
        },
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
