import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./AdminLogin.jsx";
import AdminLayout from "./AdminLayout.jsx";

import DashboardHome from "./DashboardHome.jsx";
import AdminProducts from "./AdminProducts.jsx";
import AdminProjects from "./AdminProjects.jsx";
import AdminOrders from "./AdminOrders.jsx";
import AdminQuotes from "./AdminQuotes.jsx";
import AdminCourses from "./AdminCourses.jsx";
import AdminPromotions from "./AdminPromotions.jsx";
import AdminCoupons from "./AdminCoupons.jsx";

import ProtectedAdminRoute from "../components/ProtectedAdminRoute.jsx";
import { ToastProvider } from "../components/ui/Toast.jsx";

export default function AdminRoutes() {
    return (
        <ToastProvider>
        <Routes>

            {/* لو كتب /admin من غير حاجة → يروح للوغن */}
            <Route path="/" element={<Navigate to="login" replace />} />

            {/* صفحة تسجيل الدخول */}
            <Route path="login" element={<AdminLogin />} />

            {/* الصفحة الرئيسية */}
            <Route
                path="dashboard"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <DashboardHome />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* المنتجات */}
            <Route
                path="products"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminProducts />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* المشاريع */}
            <Route
                path="projects"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminProjects />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* الطلبات */}
            <Route
                path="orders"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminOrders />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* عروض السعر */}
            <Route
                path="quotes"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminQuotes />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* الإعلانات والعروض */}
            <Route
                path="promotions"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminPromotions />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* أكواد الخصم */}
            <Route
                path="coupons"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminCoupons />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

            {/* كورسات تعليمية */}
            <Route
                path="courses"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AdminCourses />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />

        </Routes>
        </ToastProvider>
    );
}
