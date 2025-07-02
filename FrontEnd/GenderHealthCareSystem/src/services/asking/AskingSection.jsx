"use client"

import { useState } from "react"

export default function AskingSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    question: "",
    tag: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [myQuestions, setMyQuestions] = useState([])
  const [selectedTag, setSelectedTag] = useState("all")
  const [searchText, setSearchText] = useState("")

  const tagOptions = [
    { label: "Sức Khỏe", value: "suckhoe", color: "bg-green-100 text-green-800" },
    { label: "Giới tính", value: "gioitinh", color: "bg-pink-100 text-pink-800" },
    { label: "Tư vấn", value: "tuvan", color: "bg-blue-100 text-blue-800" },
    { label: "STIs", value: "stis", color: "bg-red-100 text-red-800" },
    { label: "Kinh nguyệt", value: "kinhnguyet", color: "bg-purple-100 text-purple-800" },
  ]

  const answeredQuestions = [
    {
      customerName: "Mai",
      tag: "kinhnguyet",
      consultantName: "TVV A",
      question: "Kinh nguyệt không đều có ảnh hưởng mang thai không?",
      answer: "Có thể ảnh hưởng đến rụng trứng và khả năng mang thai.",
    },
    {
      customerName: "An",
      tag: "kinhnguyet",
      consultantName: "TVV B",
      question: "Em bị trễ kinh 10 ngày, có sao không?",
      answer: "Trễ kinh có thể do stress, mang thai hoặc bệnh lý. Cần test thử thai.",
    },
    {
      customerName: "Chi",
      tag: "suckhoe",
      consultantName: "TVV C",
      question: "Em từng phá thai, ảnh hưởng đến sinh sản không?",
      answer: "Nếu đúng cách và chăm sóc tốt thì không ảnh hưởng nhiều.",
    },
    {
      customerName: "Linh",
      tag: "suckhoe",
      consultantName: "TVV D",
      question: "Em hay bị đau bụng dưới, có phải viêm gì không?",
      answer: "Có thể là viêm nhiễm phụ khoa. Nên đi khám để chẩn đoán chính xác.",
    },
    {
      customerName: "Tuấn",
      tag: "gioitinh",
      consultantName: "TVV E",
      question: "Dùng thuốc tránh thai rồi có cần dùng bao không?",
      answer: "Vẫn nên dùng bao để phòng bệnh lây qua đường tình dục.",
    },
    {
      customerName: "Hà",
      tag: "gioitinh",
      consultantName: "TVV F",
      question: "Nam giới có cần kiểm tra sức khỏe sinh sản không?",
      answer: "Có, đặc biệt khi lập gia đình hoặc gặp vấn đề sinh lý.",
    },
    {
      customerName: "Nam",
      tag: "stis",
      consultantName: "TVV G",
      question: "Quan hệ xong thấy ngứa, có phải bệnh lây không?",
      answer: "Có thể là triệu chứng STIs. Nên đi khám sớm.",
    },
    {
      customerName: "Vy",
      tag: "stis",
      consultantName: "TVV H",
      question: "Có test nhanh nào phát hiện HIV không?",
      answer: "Có test nhanh tại các trung tâm y tế sau 3-6 tuần quan hệ.",
    },
    {
      customerName: "Minh",
      tag: "tuvan",
      consultantName: "TVV I",
      question: "Em chưa có người yêu, có cần khám phụ khoa không?",
      answer: "Khuyến nghị khám định kỳ 6 tháng/lần dù chưa quan hệ.",
    },
    {
      customerName: "Tú",
      tag: "tuvan",
      consultantName: "TVV J",
      question: "Tư vấn giúp em cách tránh thai an toàn nhất?",
      answer: "Bao cao su + thuốc tránh thai uống là hiệu quả nhất.",
    },
    ...Array.from({ length: 10 }).map((_, i) => ({
      customerName: `User${i + 1}`,
      tag: tagOptions[i % tagOptions.length].value,
      consultantName: `TVV ${i + 1}`,
      question: `Đây là câu hỏi số ${i + 1} về chủ đề ${tagOptions[i % tagOptions.length].label}`,
      answer: `Đây là câu trả lời cho câu hỏi số ${i + 1}.`,
    })),
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newQuestion = { ...form, answer: null, status: "pending" }
    setMyQuestions([...myQuestions, newQuestion])
    setSubmitted(true)
    setForm({ name: "", email: "", question: "", tag: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const getTagColor = (tagValue) => {
    const tag = tagOptions.find((t) => t.value === tagValue)
    return tag ? tag.color : "bg-gray-100 text-gray-800"
  }

  const getTagLabel = (tagValue) => {
    const tag = tagOptions.find((t) => t.value === tagValue)
    return tag ? tag.label : tagValue
  }

  const filteredAnswered = answeredQuestions.filter((q) => {
    const matchTag = selectedTag === "all" || q.tag === selectedTag
    const search = searchText.toLowerCase()
    const matchSearch = q.question.toLowerCase().includes(search) || q.customerName.toLowerCase().includes(search)
    return matchTag && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* FORM SECTION */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4">
          <div className="p-6 border-b border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-[#0099CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#0099CF]">Đặt câu hỏi</h2>
            </div>
            <p className="text-gray-600 text-sm">Gửi câu hỏi của bạn để nhận được tư vấn từ chuyên gia</p>
          </div>

          <div className="p-6">
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium text-sm">
                  ✅ Gửi câu hỏi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Tên của bạn
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <select
                  id="tag"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors"
                >
                  <option value="">-- Lựa chọn chủ đề --</option>
                  {tagOptions.map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                  Câu hỏi của bạn
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors min-h-[120px] resize-none"
                  placeholder="Mô tả chi tiết câu hỏi của bạn..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0099CF] hover:bg-[#007ca8] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Gửi câu hỏi
              </button>
            </form>
          </div>
        </div>

        {/* ANSWERED QUESTIONS SECTION */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-[#0099CF] mb-2">Câu hỏi đã được tư vấn</h3>
            <p className="text-gray-600 mb-6">Tham khảo các câu hỏi và câu trả lời từ chuyên gia</p>
          </div>

          {/* FILTERS */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700">
                  Lọc theo chủ đề
                </label>
                <select
                  id="tag-filter"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors"
                >
                  <option value="all">Tất cả chủ đề</option>
                  {tagOptions.map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    id="search"
                    type="text"
                    placeholder="Từ khóa hoặc tên người hỏi..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {filteredAnswered.length > 0 ? (
              filteredAnswered.map((q, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0099CF] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {q.customerName.charAt(0)}
                          </div>
                          <span className="font-semibold text-[#0099CF]">{q.customerName}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(q.tag)}`}>
                          {getTagLabel(q.tag)}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 font-medium mb-2">Câu hỏi:</p>
                        <p className="text-gray-700">{q.question}</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-[#0099CF]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-[#0099CF] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                            TV
                          </div>
                          <span className="text-sm font-medium text-[#0099CF]">Tư vấn viên: {q.consultantName}</span>
                        </div>
                        <p className="text-gray-700">{q.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Không tìm thấy câu hỏi phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
