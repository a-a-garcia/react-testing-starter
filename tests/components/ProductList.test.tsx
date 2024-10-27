import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse, delay } from "msw";
import exp from "constants";
import { db } from "../mocks/db";

describe("ProductList", () => {
  const productIds: number[] = [];
  //create 3 product objects before running the tests
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });
  //clean them up after running the tests, since the db object is global and shared between tests
  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />);

    //query elements by role
    //getAllByRole will fail because there are no list items until items finish loading, so use a find method
    const items = await screen.findAllByRole("listitem");

    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product is found", async () => {
    // we do this to simulate an empty response from the server
    server.use(http.get("/products", () => HttpResponse.json([])));

    render(<ProductList />);

    //again notice we're using a find method since it's an async operation
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it('should render an error message when there is an error', async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })

  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get("/products", async () => {
        await delay()
        return HttpResponse.json([])
    }));

    render(<ProductList />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  })

  it('should remove the loading indicator after data is fetched', async () => {
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })

  it('should remove the loading indicator after data is fetched', async () => {
    server.use(http.get("/products", async () => {
        await delay()
        return HttpResponse.json([])
    }));

    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })


  
});
