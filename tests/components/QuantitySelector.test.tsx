import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";
import { de } from "@faker-js/faker";

describe("QuantitySelector", () => {
  const product: Product = {
    id: 1,
    name: "Milk",
    price: 5,
    categoryId: 1,
  };

  const renderComponent = () => {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCartButton: () => screen.queryByRole("button", { name: /add to cart/i }),
      queryAddToCartButton: () => screen.queryByRole("button", { name: /add to cart/i }),
      user: userEvent.setup(),
      // we need to use a lazy evaluation technique (turn them into functions) because they don't exist in the DOM until the user clicks the Add to Cart button
    
      // the elements inside of here are all highly related to each other, so it makes sense to group them together
      getQuantityControls: () => ({
        quantity: screen.getByRole("status"),
        decrementButton: screen.getByRole("button", { name: "-" }),
        incrementButton: screen.getByRole("button", { name: "+" }),
      }),
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCartButton, user, getQuantityControls, queryAddToCartButton} = renderComponent();

    await user.click(getAddToCartButton()!);

    const { quantity, decrementButton, incrementButton } = getQuantityControls();
    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    screen.debug();
    expect(queryAddToCartButton()).not.toBeInTheDocument();
  });

  it('should increment the quantity', async () => {
    //arrange
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();
    await user.click(getAddToCartButton()!);
    const {incrementButton, quantity} = getQuantityControls() 
    //act
    await user.click(incrementButton);

    //assert
    expect(quantity).toHaveTextContent("2");
  });

  it('should decrement the quantity', async () => {
    //arrange
    const { getAddToCartButton, user, getQuantityControls} = renderComponent();
    await user.click(getAddToCartButton()!);
    const {incrementButton, decrementButton, quantity} = getQuantityControls();
    await user.click(incrementButton!);

    //act
    await user.click(decrementButton!);

    //assert
    expect(quantity).toHaveTextContent("1");
  });

  it('should remove the product from the cart', async () => {
    //arrange
    const { getAddToCartButton, user, getQuantityControls} = renderComponent();
    await user.click(getAddToCartButton()!);
    const { incrementButton, decrementButton, quantity} = getQuantityControls();

    //act
    await user.click(decrementButton!);

    //assert
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();


    expect(getAddToCartButton()).toBeInTheDocument();
  });

});
