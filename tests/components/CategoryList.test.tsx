import { render, waitForElementToBeRemoved } from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import ReduxProvider from "../../src/providers/ReduxProvider";
import { db } from "../mocks/db";
import { screen } from "@testing-library/dom";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  // define categories
  const categories: Category[] = [];

  // setup and teardown functions
  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    categories.forEach((category) => {
      db.category.delete({
        where: {
          id: {
            equals: category.id,
          },
        },
      });
    });
  });

  // renderComponent function
  const renderComponent = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );
  };

  //tests 
  it('should render a list of categories', async () => {
    renderComponent();

    // wait for loading message to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // check if all categories are rendered
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  })

  it('should render a loading message when fetching categories', async () => {
    // puts a delay on this endpoint
    simulateDelay("/categories")

    renderComponent();

    // check if loading message is rendered
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  })

  it('should render an error message when fetching categories fails', async () => {
    // puts a delay on this endpoint
    simulateError("/categories")

    renderComponent();

    // check if error message is rendered
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })
});
