import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputMenstrualCycle = () => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);

    const handleCalculate = () => {
        if (!startDate || cycleLength <= 0 || periodLength <= 0) {
            alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
            return;
        }

        // Lưu vào localStorage để sử dụng ở trang kế tiếp
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("cycleLength", cycleLength);
        localStorage.setItem("periodLength", periodLength);

        navigate("/menstrual-ovulation");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8 space-y-6">
                <h2 className="text-xl font-bold mb-4">Tính Chu Kỳ Kinh Nguyệt</h2>

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
                        min={20}
                        max={45}
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
                        min={1}
                        max={10}
                        value={periodLength}
                        onChange={(e) => setPeriodLength(e.target.value)}
                        className="w-full"
                    />
                    <p>{periodLength} ngày</p>
                </div>

                <p className="text-sm text-gray-500">
                    * Công cụ này chỉ mang tính chất tham khảo.
                </p>

                <button
                    onClick={handleCalculate}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                    Tính ngay
                </button>
            </div>
        </div>
    );
};

export default InputMenstrualCycle;
