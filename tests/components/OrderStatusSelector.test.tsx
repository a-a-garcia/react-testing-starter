import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import exp from "constants";

describe("OrderStatusSelector", () => {
  it("should render New as the default value", () => {
    // you will get an error that says "UseThemeContext" must be used within a Theme. This is because the Select component from Radix UI requires a theme to be provided. You can fix this by wrapping the OrderStatusSelector component in a Theme component from Radix UI.

    // you'll get another error that says "ResizeObserver" is not defined. Fix this with `npm i -D resize-observer-polyfill` and add it to setup.
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    // this role has to be changed to combobox because radix ui component library has a different role for this component.
    // const button = screen.getByRole('button')
    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent(/new/i)
  });

  it("should render the correct statuses", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole("combobox");
    
    const user = userEvent.setup();
    await user.click(button);
    // The options appear asynchronously, so we need to look them up using the find method
    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(3)
    //at this point you might get an error like `Error: Uncaught [TypeError: target.hasPointerCapture is not a function]` and again this is because this is a browser API that's not available in Node

    //need to check if the options have the correct content. the options are html elements, so they have a textContent property
    const labels = options.map(option => option.textContent);

    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
    expect(button).toHaveTextContent(/new/i);
  });
});


//refactor

describe('OrderStatusSelector2', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    return { 
      trigger: screen.getByRole('combobox'),
      // options: screen.findAllByRole('option'),
      // we can also use "lazy evaluation" which is a technique that postpones execution of a function until its result is needed.
      getOptions: () => screen.findAllByRole('option'),
      user: userEvent.setup()
    }
  }

  it('should render New as the default value 2', () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/new/i);
  })

  it('should render the correct statuses 2', async () => {
    const { trigger,
      //  options, 
        getOptions,
       user 
      } = renderComponent();

    await user.click(trigger);
    // const optionsArray = await options;
    const optionsArray = await getOptions();

    expect(optionsArray).toHaveLength(3);
    const labels = optionsArray.map(option => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
    expect(trigger).toHaveTextContent(/new/i);
  });
})