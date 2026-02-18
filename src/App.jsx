import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import FeedPage from './pages/FeedPage.jsx'
import ImageDetailPage from './pages/ImageDetailPage.jsx'
import UploadImagePage from './pages/UploadImagePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path={"/forgot-password"} element={<ForgotPasswordPage />} />
                <Route path={"/reset-password"} element={<ResetPasswordPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/upload" element={<UploadImagePage />} />
                    <Route path="/image/:id" element={<ImageDetailPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
