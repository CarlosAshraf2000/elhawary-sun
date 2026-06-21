import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx';
import Home from './pages/Home.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import QuotePage from './pages/QuotePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ShowcaseRedirect from './pages/ShowcaseRedirect.jsx';
import { isShowcaseMode } from './config/commerce.js';
import ProjectDetails from './pages/ProjectDetails.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseViewer from './pages/CourseViewer.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AdminRoutes from './admin/AdminRoutes.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { LocaleProvider } from './context/LocaleContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import './styles/3d.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <LocaleProvider>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route element={<App />}>
                                <Route index element={<Home />} />
                                <Route path="about" element={<AboutPage />} />
                                <Route path="services" element={<ServicesPage />} />
                                <Route path="projects" element={<ProjectsPage />} />
                                <Route path="project/:id" element={<ProjectDetails />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="quote" element={<QuotePage />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="register" element={<RegisterPage />} />
                                <Route path="account" element={<AccountPage />} />
                                <Route path="courses" element={<CoursesPage />} />
                                <Route path="course-viewer" element={<CourseViewer />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="product/:id" element={<ProductDetails />} />
                                <Route path="cart" element={isShowcaseMode() ? <ShowcaseRedirect /> : <CartPage />} />
                                <Route path="checkout" element={isShowcaseMode() ? <ShowcaseRedirect /> : <CheckoutPage />} />
                                <Route path="admin/*" element={<AdminRoutes />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </LocaleProvider>
        </BrowserRouter>
    </React.StrictMode>
);
