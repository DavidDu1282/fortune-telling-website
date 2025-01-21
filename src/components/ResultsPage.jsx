// src/components/ResultsPage.jsx
import { motion } from 'framer-motion';

export default function ResultsPage({ result }) {
    return (
        <motion.div
            className="min-h-screen bg-gradient-to-t from-purple-900 to-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h2 className="text-4xl text-center mt-10">您的占卜结果</h2>
            <motion.div
                className="p-6 text-xl text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {result}
            </motion.div>
        </motion.div>
    );
}
