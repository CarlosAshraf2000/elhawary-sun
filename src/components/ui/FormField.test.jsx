import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "./FormField";

describe("FormField", () => {
    it("renders label linked to input", () => {
        render(
            <FormField
                label="الاسم"
                name="name"
                value=""
                onChange={() => {}}
            />
        );

        expect(screen.getByLabelText("الاسم")).toBeInTheDocument();
    });
});
