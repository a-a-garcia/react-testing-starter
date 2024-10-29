import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({
      where: {
        id: {
          equals: category.id,
        },
      },
    });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: () => screen.findByRole("form"),
      // this needs to be a function because if not, it will look for the input before the form finishes loading
      getInputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();
    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    // or 2) wait for the loading indicator to be removed
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    //assert name field is in the document
    expect(nameInput).toBeInTheDocument();

    //we don't need to use a find method for the second field since once the first finishes, our form is already rendered
    expect(priceInput).toBeInTheDocument();

    //dropdown assertion
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 4.99,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getInputs } = renderComponent(product);

    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
    await waitForFormToLoad();
    const inputs = getInputs();

    // or 2) wait for the loading indicator to be removed
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    //assert name field is in the document
    expect(inputs.nameInput).toHaveValue(product.name);

    //we don't need to use a find method for the second field since once the first finishes, our form is already rendered
    // must convert product.price to string because value property of a form field is always a string
    expect(inputs.priceInput).toHaveValue(product.price.toString());

    //dropdown assertion
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });
});
