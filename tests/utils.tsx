import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { User } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import path from "path";
import { createMemoryRouter } from "react-router-dom";
import routes from "../src/routes";
import { RouterProvider } from "react-router-dom";
import { render } from "@testing-library/react";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
}

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    // cmd+. to add all missing functions
    // we aren't using any of these functions so we can just mock them
    getAccessTokenSilently: vi.fn().mockResolvedValue("a"),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithPopup: vi.fn(),
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn()
  })
}

export const navigateTo = (path: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [path]
  })

  render(<RouterProvider router={router} />)
}