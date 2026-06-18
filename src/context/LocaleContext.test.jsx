import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LocaleProvider } from "./LocaleContext";
import { useLocale } from "../hooks/useLocale";

describe("LocaleContext", () => {
    const wrapper = ({ children }) => <LocaleProvider>{children}</LocaleProvider>;

    it("defaults to Arabic RTL", () => {
        const { result } = renderHook(() => useLocale(), { wrapper });
        expect(result.current.lang).toBe("ar");
        expect(result.current.dir).toBe("rtl");
        expect(result.current.t("nav.home")).toBe("الرئيسية");
    });

    it("switches to English", () => {
        const { result } = renderHook(() => useLocale(), { wrapper });
        act(() => result.current.setLang("en"));
        expect(result.current.lang).toBe("en");
        expect(result.current.dir).toBe("ltr");
        expect(result.current.t("nav.home")).toBe("Home");
    });
});
