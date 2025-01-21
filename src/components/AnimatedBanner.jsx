// src/components/AnimatedBanner.jsx
import Lottie from 'lottie-react';
import animationData from '../../src/assets/animations/banner-animation.json'; // Adjust path as needed

export default function AnimatedBanner() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}
