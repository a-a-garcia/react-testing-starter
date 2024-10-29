import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  // tests should have a flat structure, but in this case it's okay to have nested tests. (past 2 levels of nesting is not recommended as tests will become very hard to read)
  describe("Given the curent language is English", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text for $labeld", ({ labelId, text }) => {
      renderComponent(labelId, 'en');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Given the curent language is Spanish", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text for $labeld", ({ labelId, text }) => {
      renderComponent(labelId, 'es');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('should throw an error if given an invalid labelId', () => {
    // we cant call renderComponent before our assertion or our test will always fail
    expect(() => renderComponent('!', 'en')).toThrowError();
  })
});
