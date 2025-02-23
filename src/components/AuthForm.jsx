// AuthForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTranslation } from 'react-i18next';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login, loading } = useAuth(); // Get loading from AuthContext
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError(t("auth.passwords_not_match"));
            return;
        }

        try {
            if (!isLogin) {
                const registrationResult = await authService.register(username, email, password);
                if (registrationResult.success) {
                    const loginError = await login(username, password); // Get potential error
                    if (!loginError) { // Check for login error
                        navigate('/');
                    } else {
                        setError(loginError); // Display login error
                    }
                } else {
                    setError(registrationResult.message || t("auth.registration_failed"));
                }
            } else {
                const loginError = await login(username, password); // Get potential error
                if (!loginError) {
                    navigate('/');
                } else {
                    setError(loginError); // Display login error
                }
            }
        } catch (err) {
            console.error("AuthForm handleSubmit Error:", err);
            setError(err.message || t("auth.unexpected_error"));
        }
    };


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isLogin ? t("auth.login_title") : t("auth.register_title")}
                    </h2>
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">{t("auth.error")}:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            {t("auth.username")}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder={t("auth.username")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {t("auth.email")}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder={t("auth.email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {t("auth.password")}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder={t("auth.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                {t("auth.confirm_password")}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="confirmPassword"
                                type="password"
                                placeholder={t("auth.confirm_password")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (isLogin ? t("auth.logging_in") : t("auth.registering")) : (isLogin ? t("auth.login") : t("auth.register"))}
                        </button>
                        <button
                            type="button"
                            className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? t("auth.create_account") : t("auth.already_have_account")}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;{new Date().getFullYear()} {t("auth.copyright")}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;