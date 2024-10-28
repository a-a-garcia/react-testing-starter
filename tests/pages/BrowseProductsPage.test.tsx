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
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("BrowseProductsPage", () => {
  const renderComponent = () => {
    render(
      //we must wrap the component in CartProvider as well to avoid `getItem()` is not a function
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
  };

  const categories: Category[] = [];
  const products: Product[] = [];
  //create 3 category objects before running the tests
  beforeAll((item) => {
    [1, 2, 3].forEach(() => {
      // pass in the item to ensure the category name is unique
      const category = db.category.create({ name: "Category" + item });
      const product = db.product.create();
      categories.push(category);
      products.push(product);
    });
  });
  //clean them up after running the tests, since the db object is global and shared between tests
  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((product) => product.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

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
  it("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    renderComponent();

    // this is a false positive, beause when we render the DOM initially, there is no error message
    // before we make this assertion we need to wait for the skeleton to be removed
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    // categories dropdown should not be rendered
    expect(
      screen.queryByRole("combobox", { name: /categories/i })
    ).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the categories in the dropdown", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");

    const user = userEvent.setup();

    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  //can use .skip to skip a test
  it("should render products", async () => {
    renderComponent();

    // need to wait for the product skeleton to be removed or test will fail
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
