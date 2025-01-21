// src/components/Header.jsx
import { motion } from 'framer-motion';
import AnimatedBanner from './AnimatedBanner';

export default function Header() {
    return (
        <motion.div
            className="text-center py-6 bg-gradient-to-r from-red-500 to-yellow-400 text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
        >
            <AnimatedBanner />
            <h1 className="text-4xl font-bold">在线占卜平台</h1>
            <p className="text-lg mt-2">选择您的占卜方式，探索未来的奥秘</p>
        </motion.div>
    );
}
