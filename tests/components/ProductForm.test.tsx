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

  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
    await screen.findByRole("form");

    // or 2) wait for the loading indicator to be removed
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    //assert name field is in the document
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();

    //we don't need to use a find method for the second field since once the first finishes, our form is already rendered
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

    //dropdown assertion
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 4.99,
      categoryId: category.id,
    };

    render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProviders });

    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
    await screen.findByRole("form");

    // or 2) wait for the loading indicator to be removed
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    //assert name field is in the document
    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);

    //we don't need to use a find method for the second field since once the first finishes, our form is already rendered
    // must convert product.price to string because value property of a form field is always a string
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(product.price.toString());

    //dropdown assertion
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });
});
