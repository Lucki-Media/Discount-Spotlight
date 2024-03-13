import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export default async function createWebPixel(data) {
  var { session } = data;
  console.log("session");
  console.log(session);
  const client = new shopify.api.clients.Graphql({
    session: session,
  });
  console.log("client");
  console.log(client);
  try {
    const response = await client.query({
      data: {
        query: `
          mutation webPixelCreate($webPixelInput: WebPixelInput!) {
              webPixelCreate(webPixel: $webPixelInput) {
                webPixel {
                  settings
                  id
                }
                userErrors {
                  code
                  field
                  message
                }
              }
            }
                `,
        variables: {
          webPixelInput: {
            settings: {
              accountID: crypto.randomUUID(),
            },
          },
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
