import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputMenstrualCycle = () => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);
    const [usesPill, setUsesPill] = useState("yes");
    const [pillType, setPillType] = useState("21 ngày");
    const [pillStartDate, setPillStartDate] = useState("");
    const [pillTime, setPillTime] = useState("");

    const handleCalculate = () => {
        const cLength = Number(cycleLength);
        const pLength = Number(periodLength);

        if (!startDate || cLength <= 0 || pLength <= 0) {
            alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
            return;
        }

        if (usesPill === "yes") {
            if (!pillStartDate || !pillTime) {
                alert("Vui lòng nhập đầy đủ thông tin về thuốc tránh thai.");
                return;
            }

            localStorage.setItem("pillStartDate", pillStartDate);
            localStorage.setItem("pillType", pillType);
            localStorage.setItem("pillTime", pillTime);
        }

        localStorage.setItem("startDate", startDate);
        localStorage.setItem("cycleLength", cLength);
        localStorage.setItem("periodLength", pLength);
        localStorage.setItem("usesPill", usesPill);

        navigate("/menstrual-ovulation");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h2 className="text-xl font-bold mb-4">Tính Chu Kỳ Kinh Nguyệt</h2>

            <div>
                <label className="block mb-1 font-medium">Ngày bắt đầu kỳ kinh:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Độ dài chu kỳ kinh nguyệt (ngày):</label>
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
                <label className="block mb-1 font-medium">Số ngày hành kinh (ngày):</label>
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

            <div>
                <label className="block mb-1 font-medium">Có dùng thuốc tránh thai không?</label>
                <div className="space-x-4 mt-2">
                    <label>
                        <input
                            type="radio"
                            name="usesPill"
                            value="yes"
                            checked={usesPill === "yes"}
                            onChange={() => setUsesPill("yes")}
                            className="mr-1"
                        />
                        Có
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="usesPill"
                            value="no"
                            checked={usesPill === "no"}
                            onChange={() => setUsesPill("no")}
                            className="mr-1"
                        />
                        Không
                    </label>
                </div>
            </div>

            {usesPill === "yes" && (
                <>
                    <div>
                        <label className="block mb-1 font-medium">Chọn loại thuốc tránh thai:</label>
                        <select
                            value={pillType}
                            onChange={(e) => setPillType(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full"
                        >
                            <option value="21 ngày">21 ngày</option>
                            <option value="28 ngày">28 ngày</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Ngày bắt đầu uống thuốc:</label>
                        <input
                            type="date"
                            value={pillStartDate}
                            onChange={(e) => setPillStartDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Giờ uống thuốc:</label>
                        <input
                            type="time"
                            value={pillTime}
                            onChange={(e) => setPillTime(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full"
                        />
                    </div>
                </>
            )}

            <p className="text-sm text-gray-500">* Công cụ này chỉ mang tính chất tham khảo.</p>

            <button
                onClick={handleCalculate}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Tính ngay
            </button>
        </div>
    );
};

export default InputMenstrualCycle;
