import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Toaster } from "react-hot-toast";

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
    const onSubmit = vi.fn();

    render(<>
    <ProductForm product={product} onSubmit={onSubmit} />
    <Toaster />
    </>, {
      wrapper: AllProviders,
    });

    
    type FormData = {
      // here, we iterate over all the keys of the Product type, and for each key we allow values to be anything (avoids typing errors with `undefined`)
      [K in keyof Product]: any;
    }
    
    const validData: FormData = {
      id: 1,
      name: 'a',
      price: 1,
      categoryId: category.id
    }

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        //this object represents our form
        // must define these outside of the returned object to access them inside of `fill` method
        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", { name: /category/i });
        const submitButton = screen.getByRole("button");

        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          // we are not filling out the name field for validation purposes
          // note we are passing a string to the type method, this is because the value of the input field is always a string
          if (product.name !== undefined) {
            await user.type(nameInput, product.name);
          }
          if (product.price !== undefined) {
            await user.type(priceInput, product.price.toString());
          }

          // this clear warnings for 
          await user.tab();
          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          // add a method for filling out the form
          fill,
          validData
        };
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

  it("should put focus on the name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  // you can use it.only to only run a single chosen test
  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderComponent();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderComponent();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price })

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it('should call onSubmit with the correct data', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData })

    const { id, ...formData } = form.validData
    expect(onSubmit).toHaveBeenCalledWith(formData);
  })

  it('should display a toast if submission fails', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    
    //simulate a failure
    onSubmit.mockRejectedValue({});

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData })

    // use screen.debug() to see how our toast notification is rendered - in this case its a div with a role of "status"
    // make sure to render your component with a <Toaster /> (if using react-hot-toast) or else you won't see the toast
    // screen.debug()

    const toast = await screen.findByRole('status');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i)
  })
});
