// routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import FeedPage from './pages/FeedPage'
import ImageDetailPage from './pages/ImageDetailPage'
import UploadImagePage from './pages/UploadImagePage'
import NotFoundPage from './pages/NotFoundPage'
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path={"/forgot-password"} element={<ForgotPasswordPage />} />
                <Route path={"/reset-password"} element={<ResetPasswordPage />} />

                {}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/upload" element={<UploadImagePage />} />
                    <Route path="/image/:id" element={<ImageDetailPage />} />
                </Route>

                {}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
