import { http, HttpResponse } from "msw";
import { products } from "./data";

const allProducts = new Map();

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Beauty" },
      { id: 1, name: "Gardening" },
    ]);
  }),

  //define a handler for the API call on ProductList.tsx
  http.get("/products", () => {
    return HttpResponse.json(products);
  }),

  //define a handler for the API call on ProductDetail.tsx
  http.get("/products/:id", ({ params }) => {
    //use type assertion to tell typescript we know that params.id is a string, not a read-only string
    // then parse it as an integer
    const id = parseInt(params.id as string);
    const foundProduct = products.find((product) => product.id === id);

    if (!foundProduct) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(foundProduct);
  }),
];
