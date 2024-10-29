import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

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

    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: /add to cart/i });

    const getQuantityControls = () => {
      const quantity = screen.getByRole("status");
      const decrementButton = screen.getByRole("button", { name: "-" });
      const incrementButton = screen.getByRole("button", { name: "+" });

      return { quantity, decrementButton, incrementButton };
    };

    const user = userEvent.setup();

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton);
    };

    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      user,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const {
      getAddToCartButton,
      addToCart,
      getQuantityControls,
    } = renderComponent();

    await addToCart();

    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    screen.debug();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    //arrange
    const { incrementQuantity, addToCart, getQuantityControls } = renderComponent();
    await addToCart();
    //act
    await incrementQuantity();
    
    //assert
    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    //arrange
    const { incrementQuantity, decrementQuantity, addToCart, getQuantityControls } = renderComponent();
    await addToCart();
    await incrementQuantity();
    
    //act
    await decrementQuantity();
    
    //assert
    const { quantity } =
      getQuantityControls();
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    //arrange
    const { getAddToCartButton, addToCart, getQuantityControls, decrementQuantity } = renderComponent()
    await addToCart();
    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();

    //act
    await decrementQuantity();

    //assert
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();

    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
