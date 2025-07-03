import React from 'react';

const HeroBanner = () => {
    return (
        <div className="relative mt-[70px] p-5 lg:mt-[212px] sm:ml-[50px]">
            <h1 className="text-[#FF2625] font-semibold text-[26px]">
                Fitness Club
            </h1>
            <h2 className="font-bold mt-5 mb-4 text-[40px] lg:text-[44px]">
                Sleep <br />
                Grind <br />
                Repeat
            </h2>
            <p className="text-[22px] leading-[35px] mb-2">
                Check out the Most Effective Workouts
            </p>
            <a
                href="#exercises"
                className="inline-block bg-[#ff2625] text-white py-2 px-4 rounded hover:bg-[#e52422] transition"
            >
                Explore Exercises
            </a>

            {/* Mobile-only redirect bubble buttons */}
            <div className="flex flex-wrap gap-3 mt-4 md:hidden">
            <div>
                <a
                    href="/calc"
                    className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                    Caloric Calculator
                </a>

                <a
                    href="/workout"
                    className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                    Workout Log
                </a>
                    <a
                        href="/Profile"
                        className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                    >
                        Profile
                    </a>
                </div>
                <div>
                
                <a
                    href="/AI"
                    className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                    AI Helper
                </a>
                <a
                    href="/FitBit"
                    className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                    FitBit
                    </a>
                    <a
                    href="/Calories"
                    className="text-gray-800 text-sm border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                    Caloric Counter
                    </a>
                </div>
            </div>

            <h1 className="font-bold text-[200px] text-[#ff2625] opacity-10 hidden lg:block">
                Exercises
            </h1>
        </div>
    );
};

export default HeroBanner;
