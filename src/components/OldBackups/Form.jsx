// src/components/Form.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Form({ onSubmit, formType }) {
    const [tarotCards, setTarotCards] = useState([]);
    const zodiacSigns = [
        '白羊座', '金牛座', '双子座', '巨蟹座',
        '狮子座', '处女座', '天秤座', '天蝎座',
        '射手座', '摩羯座', '水瓶座', '双鱼座',
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        if (formType === 'tarot') {
            onSubmit({ tarotCards });
        } else {
            onSubmit(Object.fromEntries(data));
        }
    };

    const handleCardSelection = (card) => {
        setTarotCards((prev) =>
            prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
        );
    };

    return (
        <motion.form
            onSubmit={handleFormSubmit}
            className="max-w-lg mx-auto mt-6 p-4 bg-white rounded shadow"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delayChildren: 0.2, staggerChildren: 0.1 },
                },
            }}
        >
           {formType === 'bazi' && (
                <>
                    <motion.label
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="block mb-2"
                    >
                        出生日期:
                        <input
                            type="date"
                            name="birthDate"
                            className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </motion.label>
                    <motion.label
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="block mb-4"
                    >
                        出生时间 (可选):
                        <input
                            type="time"
                            name="birthTime"
                            className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-red-500"
                        />
                    </motion.label>
                </>
            )}


            {formType === 'tarot' && (
                <motion.div
                    className="text-center"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    <p className="mb-4">选择三张塔罗牌:</p>
                    <div className="flex justify-center gap-2">
                        {['牌1', '牌2', '牌3', '牌4', '牌5'].map((card) => (
                            <motion.div
                                key={card}
                                className={`w-16 h-24 border rounded ${
                                    tarotCards.includes(card)
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-200'
                                } flex items-center justify-center cursor-pointer`}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleCardSelection(card)}
                            >
                                {card}
                            </motion.div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        （点击卡片选择/取消选择）
                    </p>
                </motion.div>
            )}

            {formType === 'horoscope' && (
                <motion.div
                    className="mb-4"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    <label className="block mb-2">请选择您的星座:</label>
                    <select
                        name="zodiacSign"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                        required
                    >
                        <option value="">选择星座</option>
                        {zodiacSigns.map((sign) => (
                            <option key={sign} value={sign}>
                                {sign}
                            </option>
                        ))}
                    </select>
                </motion.div>
            )}

            <motion.button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                开始占卜
            </motion.button>
        </motion.form>
    );
}
