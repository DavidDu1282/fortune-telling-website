import { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Form from './components/Form';
import TarotReader from './components/TarotReader';

export default function App() {
    const [currentTab, setCurrentTab] = useState('bazi');

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    const handleFormSubmit = (formData) => {
        console.log('Form Data:', formData);
        alert('占卜结果正在生成...');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <Tabs onTabChange={setCurrentTab} />

            <Form formType={currentTab} onSubmit={handleFormSubmit} />
            <TarotReader />
        </div>
    );
}
