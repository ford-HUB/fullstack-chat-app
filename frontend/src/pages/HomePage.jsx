import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const newParticles = [];
        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 1 + 0.5
            });
        }
        setParticles(newParticles);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 z-0">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-white opacity-30"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animation: `float ${particle.speed * 5}s infinite ease-in-out`
                        }}
                    />
                ))}
            </div>

            <div className="z-10 text-center px-4">
                <h1 className="text-5xl font-bold mb-2 text-white tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Global Chat
                    </span>
                </h1>
                <p className="text-lg text-blue-100 mb-8 max-w-md">
                    Connect with people around the world in real-time conversations
                </p>

                {/* Buttons container */}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {/* Join Global Chat Button */}
                    <button onClick={() => navigate('/login')}
                        className={`relative px-8 py-3 overflow-hidden font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 ${isHovered ? "shadow-blue-500/50" : ""
                            }`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Join Global Chat
                        </span>

                        {/* Animated shine effect */}
                        <span
                            className={`absolute top-0 left-0 w-full h-full bg-white transform ${isHovered ? "translate-x-full" : "-translate-x-full"
                                } transition-transform duration-700 opacity-30 skew-x-12`}
                        />
                    </button>

                    {/* Create Account Button */}
                    <button onClick={() => navigate('/signup')} className="px-8 py-3 font-medium rounded-lg border-2 border-blue-400 text-white hover:bg-blue-800/30 transition-all duration-300">
                        Create Account
                    </button>
                </div>
            </div>

            {/* Style for animation */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    );
};

export default HomePage;