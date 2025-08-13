// src/components/AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login, loading } = useAuth();
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        if (!isLogin && password !== confirmPassword) {
            setError(t("passwords_not_match"));
            return;
        }

        try {
            if (!isLogin) {
                const registrationResult = await authService.register(username, email, password);
                if (registrationResult.success) {
                    const loginError = await login(username, password);
                    if (!loginError) {
                        navigate('/');
                    } else {
                        setError(loginError);
                    }
                } else {
                    if (registrationResult.validationErrors) {
                        const errorMap = {};
                        registrationResult.validationErrors.forEach(err => {
                            if (errorMap[err.field]) {
                                errorMap[err.field] += `\n${t(`${err.message}`)}`;
                            } else {
                                errorMap[err.field] = t(`${err.message}`);
                            }
                        });
                        setFieldErrors(errorMap);
                        setError(t("validation_errors"));
                    } else {
                      setError(t("registration_failed"));
                    }
                }
            } else {
                const loginError = await login(username, password);
                if (!loginError) {
                    navigate('/');
                } else {
                    setError(loginError);
                }
            }
        } catch (err) {
            console.error("AuthForm handleSubmit Error:", err);
            setError(err.message || t("unexpected_error"));
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
                        {isLogin ? t("login_title") : t("register_title")}
                    </h2>
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">{t("error")}:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            {t("username")}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder={t("username")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {fieldErrors.username && <p className="text-red-500 text-xs italic whitespace-pre-line">{fieldErrors.username}</p>}
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {t("email")}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder={t("email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {fieldErrors.email && <p className="text-red-500 text-xs italic whitespace-pre-line">{fieldErrors.email}</p>}
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            {t("password")}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder={t("password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {fieldErrors.password && <p className="text-red-500 text-xs italic whitespace-pre-line">{fieldErrors.password}</p>}
                    </div>
                    {!isLogin && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                {t("confirm_password")}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="confirmPassword"
                                type="password"
                                placeholder={t("confirm_password")}
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
                            {loading ? (isLogin ? t("logging_in") : t("registering")) : (isLogin ? t("login") : t("register"))}
                        </button>
                        <button
                            type="button"
                            className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? t("create_account") : t("already_have_account")}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;{new Date().getFullYear()} {t("copyright")}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;