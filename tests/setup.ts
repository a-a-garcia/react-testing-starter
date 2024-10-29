import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// remember when we call the mock option, all exports in this module will be replaced with mock functions
// the reason we are mocking in setup, is that we have several components that use the useAuth0 hook, and we don't want to mock it in every test file
vi.mock('@auth0/auth0-react')

// this solves a "matchmedia not found" error
// this is required because our tests are run in a Node environment, simulated in a JSDOM environment. It doesn't have a window object the matchMedia property, so we need to mock it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// We need to mock the ResizeObserver because the Radix UI Select component uses it.
// this will fix the error "ResizeObserver is not defined"
global.ResizeObserver = ResizeObserver;

// We need to mock these to avoid `Error: Uncaught [TypeError: target.hasPointerCapture is not a function]`
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
