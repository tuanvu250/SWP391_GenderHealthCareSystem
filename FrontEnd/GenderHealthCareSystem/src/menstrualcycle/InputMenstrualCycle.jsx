import React, { useState } from "react";


const InputMenstrualCycle = () => {
    const [startDate, setStartDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);

    const handleCalculate = () => {
        console.log("Ngày bắt đầu:", startDate);
        console.log("Độ dài chu kỳ:", cycleLength);
        console.log("Số ngày hành kinh:", periodLength);

    };

    return (
        <div>


            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-12 gap-8">
                <div className="col-span-8">

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-1 font-medium">
                                Ngày đầu tiên của chu kỳ gần nhất
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 px-3 py-2 rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Độ dài chu kỳ kinh nguyệt (ngày)
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={35}
                                value={cycleLength}
                                onChange={(e) => setCycleLength(e.target.value)}
                                className="w-full"
                            />
                            <p>{cycleLength} ngày</p>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Số ngày hành kinh (ngày)
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={12}
                                value={periodLength}
                                onChange={(e) => setPeriodLength(e.target.value)}
                                className="w-full"
                            />
                            <p>{periodLength} ngày</p>
                        </div>
                        <h3> Công cụ này dựa trên thông tin mà bạn cung cấp và chỉ mang tính chất tham khảo.</h3>
                        <button
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                            onClick={() => navigate("/menstrual-ovulation")}
                        >
                            Tính ngay
                        </button>


                    </div>
                </div>


            </div>
        </div>
    );
};

export default InputMenstrualCycle;
