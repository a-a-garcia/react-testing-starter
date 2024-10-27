import { http, HttpResponse } from "msw";
import { products } from "./data";
import { db } from "./db";


export const handlers = [
    // returns an array of request handlers for all http methods
  ...db.product.toHandlers('rest')
];
