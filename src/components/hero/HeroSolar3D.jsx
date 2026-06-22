import { Suspense, lazy } from "react";
import QuietErrorBoundary from "../ui/QuietErrorBoundary";

const SolarScene3D = lazy(() => import("./SolarScene3D"));

export default function HeroSolar3D() {
    return (
        <QuietErrorBoundary>
            <Suspense fallback={null}>
                <SolarScene3D />
            </Suspense>
        </QuietErrorBoundary>
    );
}
