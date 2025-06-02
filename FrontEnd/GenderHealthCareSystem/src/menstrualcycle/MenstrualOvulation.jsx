"use client"

import { useState, useEffect } from "react"

const legendItems = [
  { color: "bg-red-300", label: "Ngày có kinh nguyệt" },
  { color: "bg-yellow-300", label: "Ngày có khả năng thụ thai" },
  { color: "bg-orange-300", label: "Ngày rụng trứng, khả năng thụ thai cao nhất" },
  { color: "bg-blue-200", label: "Tỷ lệ thụ thai giảm" },
  { color: "bg-green-200", label: "Ngày an toàn tương đối" },
]

const weekdays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

function generateCalendarData(year, month) {
  // month: 1-based (1 = Jan, 12 = Dec)
  const weeks = []
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Ngày trong tuần của ngày đầu tiên (0=CN,...6=Thứ 7)
  let startDay = firstDayOfMonth.getDay()

  let currentDay = 1 - startDay // có thể âm, để ngày tháng trước lấp đầy

  for (let week = 0; week < 6; week++) {
    const weekArr = []
    for (let i = 0; i < 7; i++) {
      let day = currentDay
      if (day < 1) {
        // Ngày tháng trước
        const prevMonthLastDate = new Date(year, month - 1, 0).getDate()
        weekArr.push(String(prevMonthLastDate + day))
      } else if (day > daysInMonth) {
        // Ngày tháng sau
        weekArr.push(String(day - daysInMonth))
      } else {
        // Ngày tháng hiện tại
        weekArr.push(String(day))
      }
      currentDay++
    }
    weeks.push(weekArr)
  }
  return weeks
}

// Giả sử ta chỉ đánh dấu ngày kinh từ 5-9, rụng trứng ngày 14, an toàn từ 18-31...
function generateColorCode(month) {
  const colorCode = {}
  if (month === 5) {
    for (let d = 5; d <= 9; d++) colorCode[String(d)] = "bg-red-300"
    colorCode["14"] = "bg-orange-300"
    for (let d = 10; d <= 13; d++) colorCode[String(d)] = "bg-yellow-300"
    for (let d = 15; d <= 17; d++) colorCode[String(d)] = "bg-yellow-300"
    for (let d = 18; d <= 31; d++) colorCode[String(d)] = "bg-green-200"
  }
  // Các tháng khác có thể tương tự
  return colorCode
}

export default function OvulationCalendar() {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(5)

  const [calendarData, setCalendarData] = useState([])
  const [colorCode, setColorCode] = useState({})

  useEffect(() => {
    setCalendarData(generateCalendarData(year, month))
    setColorCode(generateColorCode(month))
  }, [year, month])

  const handlePrevMonth = () => {
    let newMonth = month - 1
    let newYear = year
    if (newMonth < 1) {
      newMonth = 12
      newYear = year - 1
    }
    setMonth(newMonth)
    setYear(newYear)
  }

  const handleNextMonth = () => {
    let newMonth = month + 1
    let newYear = year
    if (newMonth > 12) {
      newMonth = 1
      newYear = year + 1
    }
    setMonth(newMonth)
    setYear(newYear)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Kết quả của bạn</h2>

      {/* Điều hướng tháng */}
      <div className="flex justify-center items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          &lt;
        </button>
        <h3 className="text-lg font-medium mx-4">
          Tháng {month} - {year}
        </h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          &gt;
        </button>
      </div>

      {/* Lịch */}
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekdays.map((day, idx) => (
            <div key={idx} className="text-center p-2 font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((week, i) =>
            week.map((day, j) => (
              <div
                key={`${i}-${j}`}
                className={`text-center p-3 border rounded-md flex items-center justify-center ${
                  colorCode[day] || "bg-white"
                }`}
              >
                <span className="text-sm">{day}</span>
              </div>
            )),
          )}
        </div>
      </div>

      {/* Chú thích */}
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
  )
}
