import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";
import { get } from "http";
import { simulateDelay, simulateError } from "../utils";

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

    return {
      getProductSkeleton: () =>
        screen.getByRole("progressbar", { name: /products/i }),
      getCategorySkeleton: () =>
        screen.getByRole("progressbar", { name: /categories/i }),
      getCategoriesComboBox: () => screen.queryByRole("combobox")
    };
  };

  const categories: Category[] = [];
  const products: Product[] = [];
  //create 3 category objects before running the tests
  beforeAll((item) => {
    [1, 2, 3].forEach((item) => {
      // pass in the item to ensure the category name is unique
      const category = db.category.create({ name: "Category" + item });
      categories.push(category);
      [1, 2, 3].forEach(() => {
        const product = db.product.create();
        products.push(product);
      });
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
    simulateDelay("/categories")

    const {getCategorySkeleton} = renderComponent();

    expect(
      getCategorySkeleton()
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching categories", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products")

    const {getProductSkeleton} = renderComponent();

    expect(
      getProductSkeleton()
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching products", async () => {
    const {getProductSkeleton} = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton)
  });

  // we want this test to fail first as part of TDD
  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories")

    const {getProductSkeleton, getCategoriesComboBox} = renderComponent();

    // this is a false positive, beause when we render the DOM initially, there is no error message
    // before we make this assertion we need to wait for the skeleton to be removed
    await waitForElementToBeRemoved(getProductSkeleton)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    const comboBox = getCategoriesComboBox();
    // categories dropdown should not be rendered
    expect(
      comboBox
    ).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products")

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the categories in the dropdown", async () => {
    const {getCategorySkeleton, getCategoriesComboBox} = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    const combobox = getCategoriesComboBox();

    const user = userEvent.setup();

    // in this case, we know that combobox exists
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  //can use .skip to skip a test
  it("should render products", async () => {
    const { getProductSkeleton } = renderComponent();

    // need to wait for the product skeleton to be removed or test will fail
    // we don't call getProductSkeleton with () because waitForElementToBeRemoved expects a function
    await waitForElementToBeRemoved(getProductSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
