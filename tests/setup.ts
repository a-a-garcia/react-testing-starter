import "@testing-library/jest-dom/vitest";

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
