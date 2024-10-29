import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

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
      waitForFormToLoad: async () => {
        await screen.findByRole("form")
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole('button')
        }
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();
    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
   const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

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

    const { waitForFormToLoad } = renderComponent(product);

    // we don't want to use different methods to assert, so we can 1) use find to wait for the form to be rendered
    const inputs = await waitForFormToLoad();

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

  it('should put focus on the name field', async () => {
    const {waitForFormToLoad} = renderComponent();

    const {nameInput} = await waitForFormToLoad();
    
    expect(nameInput).toHaveFocus();
  })
  
  it('should display an error if name is missing', async () => {
    const {waitForFormToLoad} = renderComponent();
    
    const form = await waitForFormToLoad();
    const user = userEvent.setup();
    // we are not filling out the name field for validation purposes
    // note we are passing a string to the type method, this is because the value of the input field is always a string
    await user.type(form.priceInput, '10');
    await user.click(form.categoryInput);
    const options = screen.getAllByRole('option')
    await user.click(options[0]);
    await user.click(form.submitButton);
  
    const error = screen.getByRole('alert')
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i)
  })
});
