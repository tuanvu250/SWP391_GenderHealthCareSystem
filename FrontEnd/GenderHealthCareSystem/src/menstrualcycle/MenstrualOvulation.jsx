"use client"

import { useEffect, useState } from "react"

const defaultCalendarData = [
  ["27", "28", "29", "30", "1", "2", "3"],
  ["4", "5", "6", "7", "8", "9", "10"],
  ["11", "12", "13", "14", "15", "16", "17"],
  ["18", "19", "20", "21", "22", "23", "24"],
  ["25", "26", "27", "28", "29", "30", "31"],
  ["1", "2", "3", "4", "5", "6", "7"],
]

const defaultColorCode = {
  "5": "bg-red-300",
  "6": "bg-red-300",
  "7": "bg-red-300",
  "8": "bg-red-300",
  "9": "bg-red-300",
  "10": "bg-green-200",
  "11": "bg-green-200",
  "12": "bg-yellow-300",
  "13": "bg-yellow-300",
  "14": "bg-orange-300",
  "15": "bg-yellow-300",
  "16": "bg-yellow-300",
  "17": "bg-blue-200",
  "18": "bg-green-200",
  "19": "bg-green-200",
  "20": "bg-green-200",
  "21": "bg-green-200",
  "22": "bg-green-200",
  "23": "bg-green-200",
  "24": "bg-green-200",
  "25": "bg-green-200",
  "26": "bg-green-200",
  "27": "bg-green-200",
  "28": "bg-green-200",
  "29": "bg-green-200",
  "30": "bg-green-200",
  "31": "bg-green-200",
}

const legendItems = [
  { color: "bg-red-300", label: "Ngày có kinh nguyệt" },
  { color: "bg-yellow-300", label: "Ngày có khả năng thụ thai" },
  { color: "bg-orange-300", label: "Ngày rụng trứng, khả năng thụ thai cao nhất" },
  { color: "bg-blue-200", label: "Tỷ lệ thụ thai giảm" },
  { color: "bg-green-200", label: "Ngày an toàn tương đối" },
]

const weekdays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

export default function OvulationCalendar() {
  const [calendarData, setCalendarData] = useState(defaultCalendarData)
  const [colorCode, setColorCode] = useState(defaultColorCode)
  const [currentMonth, setCurrentMonth] = useState("Tháng 5 - 2025")


  const handlePrevMonth = () => {
    setCurrentMonth("Tháng 4 - 2025")
  }

  const handleNextMonth = () => {
    setCurrentMonth("Tháng 6 - 2025")
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-center">Kết quả của bạn</h2>

      {/* Điều hướng tháng */}
      <div className="flex justify-center items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h3 className="text-lg font-medium mx-4">{currentMonth}</h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lịch */}
        <div className="md:col-span-2">
          {/* Tiêu đề các ngày trong tuần */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekdays.map((day, index) => (
              <div key={index} className="text-center p-2 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Lưới ngày */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((week, i) =>
              week.map((day, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`text-center p-3 border rounded-md flex items-center justify-center ${colorCode[day] || "bg-white"
                    }`}
                >
                  <span className="text-sm">{day}</span>
                  {colorCode[day] === "bg-red-300" && (
                    <div className="absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#ef4444"
                        stroke="none"
                      >
                        <circle cx="12" cy="12" r="5" />
                      </svg>
                    </div>
                  )}
                  {colorCode[day] === "bg-orange-300" && (
                    <div className="absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#f97316"
                        stroke="none"
                      >
                        <circle cx="12" cy="12" r="5" />
                      </svg>
                    </div>
                  )}
                </div>
              )),
            )}
          </div>

          {/* Ghi chú */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Chú thích:</h3>
            <ul className="space-y-2">
              {legendItems.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-sm">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nội dung liên quan */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Nội dung liên quan</h3>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Tư vấn chu kỳ kinh nguyệt</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Thời điểm dễ thụ thai</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Biện pháp tránh thai</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Kiểm tra sức khỏe sinh sản</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Gặp bác sĩ phụ khoa</span>
            </li>
          </ul>

          {/* Thông tin chu kỳ */}
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-700"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Ngày có kinh nguyệt</p>
                  <p className="text-xs text-gray-500">Đây là ngày có kỳ kinh nguyệt của bạn</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-700"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Ngày bắt đầu có khả năng thụ thai</p>
                  <p className="text-xs text-gray-500">Đây là ngày đầu trong giai đoạn có khả năng thụ thai của bạn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
