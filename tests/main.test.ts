import { it, expect, describe } from "vitest";
import { faker } from "@faker-js/faker";
import { db } from "./mocks/db";

describe("group", () => {
  // it('should', async () => {
  //     const response = await fetch('/categories')
  //     const data = await response.json();
  //     console.log(data);
  //     expect(data).toHaveLength(3);
  //     expect(1).toBeTruthy();
  // })

  it("should", () => {
    const product = db.product.create({ name: "Apple" });
    console.log(product);
    // get all products
    console.log(db.product.getAll());
    // get the count of products
    console.log(db.product.count());
    // delete a product
    console.log(
      db.product.delete({ where: { id: { equals: product.id } } })
    );
  });
});
