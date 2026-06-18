import { Routes, Route } from "react-router-dom";

// صفحات المستخدم العامة
import Home from "../pages/Home.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import ServicesPage from "../pages/ServicesPage.jsx";
import QuotePage from "../pages/QuotePage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import CartPage from "../pages/CartPage.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import ProjectDetails from "../pages/ProjectDetails.jsx";
import CoursesPage from "./../pages/CoursesPage.jsx";
import CourseViewer from "../pages/CourseViewer";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import AccountPage from "../pages/AccountPage.jsx";

// مسارات الأدمن
import AdminRoutes from "../admin/AdminRoutes.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export default function AppRouter() {
    return (
        <Routes>

            {/* صفحات عامة */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course-viewer" element={<CourseViewer />} />




            {/* متجر العملاء */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* ⭐ إدخال كل مسارات الأدمن هنا */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 404 */}
            <Route path="*" element={
                <NotFoundPage />
            } />
        </Routes>
    );
}
