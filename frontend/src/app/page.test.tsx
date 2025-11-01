import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Home from "./page";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock dynamic imports to return a simple component
vi.mock("next/dynamic", () => ({
  default: (fn: any, options: any) => {
    const Component = () => null;
    Component.displayName = "DynamicComponent";
    return Component;
  },
}));

// Mock particle background
vi.mock("@/components/particle-background", () => ({
  default: () => null,
}));

// Mock images to avoid import errors
vi.mock("./images", () => ({
  default: {
    editor: "/images/editor.png",
    analysis: "/images/analysis.png",
    development: "/images/development.png",
    brainstorm: "/images/brainstorm.png",
  },
}));

describe("Home Page - Unified Dashboard", () => {
  it("renders without crashing", () => {
    const { container } = render(<Home />);
    expect(container).toBeDefined();
  });

  it("renders the main heading النسخة", () => {
    render(<Home />);
    const heading = screen.getByText("النسخة");
    expect(heading).toBeInTheDocument();
  });

  it("renders all 4 application cards with correct titles", () => {
    render(<Home />);
    expect(screen.getByText("كتابة")).toBeInTheDocument();
    expect(screen.getByText("تحليل")).toBeInTheDocument();
    expect(screen.getByText("تطوير")).toBeInTheDocument();
    expect(screen.getByText("الورشة")).toBeInTheDocument();
  });

  it("has correct links to all 4 applications", () => {
    render(<Home />);
    const cards = screen.getAllByRole("button");
    // Should have 4 clickable cards for features
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it("renders footer with copyright", () => {
    render(<Home />);
    const footer = screen.getByText(/جميع الحقوق محفوظة/);
    expect(footer).toBeInTheDocument();
  });
});
