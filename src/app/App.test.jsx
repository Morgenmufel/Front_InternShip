import { describe, it, expect } from "vitest";
import App from "../App.jsx";
import { render, screen } from "@testing-library/react";

describe("App component", () => {
    it("renders without crashing", () => {
        render(<App />);
        expect(screen.getByText(/./)).toBeDefined();
    });
});
