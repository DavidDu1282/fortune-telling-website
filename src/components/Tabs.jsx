import { useState } from 'react';

export default function Tabs({ onTabChange }) {
    const [activeTab, setActiveTab] = useState('bazi');

    // Check if onTabChange is passed and is a function
    if (typeof onTabChange !== 'function') {
        console.error('Tabs component requires a valid onTabChange function prop.');
        return null; // Return null to avoid rendering broken components
    }

    const tabs = [
        { id: 'bazi', name: '八字命理' },
        { id: 'tarot', name: '塔罗牌占卜' },
        { id: 'horoscope', name: '星座运势' },
    ];

    const handleTabClick = (id) => {
        console.log(`Switching to tab: ${id}`);
        setActiveTab(id);
        onTabChange(id); // Notify parent of the tab change
    };

    return (
        <div className="flex justify-center mt-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4 py-2 mx-2 rounded ${
                        activeTab === tab.id
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {tab.name}
                </button>
            ))}
        </div>
    );
}
// export default function Tabs({ onTabChange }) {
//     const [activeTab, setActiveTab] = useState('bazi');

//     const handleTabClick = (id) => {
//         console.log(`Clicked tab: ${id}`);
//         setActiveTab(id);
//         onTabChange(id);
//     };

//     return (
//         <div>
//             <button onClick={() => handleTabClick('bazi')}>八字命理</button>
//             <button onClick={() => handleTabClick('tarot')}>塔罗牌占卜</button>
//             <button onClick={() => handleTabClick('horoscope')}>星座运势</button>
//         </div>
//     );
// }
