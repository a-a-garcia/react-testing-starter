import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { db, getProductsByCategory } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";
import { simulateDelay, simulateError } from "../utils";
import AllProviders from "../AllProviders";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  
  //create 3 category objects before running the tests
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      // pass in the item to ensure the category name is unique
      const category = db.category.create();
      categories.push(category);
      [1, 2, 3].forEach(() => {
        const product = db.product.create({ categoryId: category.id });
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
    simulateDelay("/categories");

    const { getCategorySkeleton } = renderComponent();

    expect(getCategorySkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching categories", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductSkeleton } = renderComponent();

    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after fetching products", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  // we want this test to fail first as part of TDD
  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getProductSkeleton, getCategoriesComboBox } = renderComponent();

    // this is a false positive, beause when we render the DOM initially, there is no error message
    // before we make this assertion we need to wait for the skeleton to be removed
    await waitForElementToBeRemoved(getProductSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    const comboBox = getCategoriesComboBox();
    // categories dropdown should not be rendered
    expect(comboBox).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the categories in the dropdown", async () => {
    const { getCategorySkeleton, getCategoriesComboBox } = renderComponent();

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

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    // Assert
    const products = getProductsByCategory(selectedCategory.id);

    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    // Assert
    const products = db.product.getAll();

    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(
    //we must wrap the component in CartProvider as well to avoid `getItem()` is not a function
        <BrowseProducts />
    , { wrapper: AllProviders }
  );

  const getCategorySkeleton = () =>
    screen.getByRole("progressbar", { name: /categories/i });
  const getProductSkeleton = () =>
    screen.getByRole("progressbar", { name: /products/i });
  const getCategoriesComboBox = () => screen.queryByRole("combobox");
  // typing this as `RegExp | string` to avoid `argument of type 'string' is not assignable to parameter of type 'RegExp'` error
  const selectCategory = async (name: RegExp | string) => {
    // Arrange
    await waitForElementToBeRemoved(getCategorySkeleton);
    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox!);
    await user.click(screen.getByRole("option", { name }));
  };

  // helper functions for assertions
  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };


  return {
    getProductSkeleton,
    getCategorySkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};