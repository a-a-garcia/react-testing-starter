import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { http, delay, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { db } from "../mocks/db";

describe("BrowseProductsPage", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };

  // const productIds: number[] = [];
  // //create 3 product objects before running the tests
  // beforeAll(() => {
  //   [1, 2, 3].forEach(() => {
  //     const product = db.product.create();
  //     productIds.push(product.id);
  //   });
  // });
  // //clean them up after running the tests, since the db object is global and shared between tests
  // afterAll(() => {
  //   db.product.deleteMany({ where: { id: { in: productIds } } });
  // });


  it("should show a loading skeleton when fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should show a loading skeleton when fetching products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching products", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  // we want this test to fail first as part of TDD
  it('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
  
    renderComponent();

    // this is a false positive, beause when we render the DOM initially, there is no error message
    // before we make this assertion we need to wait for the skeleton to be removed
    await waitForElementToBeRemoved(() => screen.queryByRole("progressbar", { name: /categories/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    // categories dropdown should not be rendered
    expect(screen.queryByRole('combobox', { name: /categories/i })).not.toBeInTheDocument();
  })

  it('should render an error if products cannot be fetched', async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
  
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
