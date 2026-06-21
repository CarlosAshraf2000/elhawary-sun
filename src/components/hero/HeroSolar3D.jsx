import { Suspense, lazy } from "react";

const SolarScene3D = lazy(() => import("./SolarScene3D"));

export default function HeroSolar3D() {
    return (
        <Suspense fallback={null}>
            <SolarScene3D />
        </Suspense>
    );
}
