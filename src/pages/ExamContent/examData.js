/**
 * 考试题目与说明的 mock 数据，后续可替换为 API 请求
 */
export const examData = {
  title: 'Section 1, Module 1: Reading and Writing',
  totalQuestions: 27,
  directions: {
    title: 'Directions',
    content: `The questions in this section address a number of important reading and writing skills.
Use of a calculator is not permitted for this section. These directions can be accessed throughout the test.

**For multiple-choice questions**, solve each problem and choose the correct answer from the choices provided.
Each multiple-choice question has a single correct answer.

**Mathematical Formulas Reference:**
• Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
• Area of a Circle: $A = \\pi r^2$
• Pythagorean Theorem: $a^2 + b^2 = c^2$

**Reference Table:**
<table class="w-full border-collapse border border-gray-200 mt-0 mb-6 text-sm rounded-xl overflow-hidden">
      <thead>
        <tr class="bg-gray-50">
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">Property</th>
      <th class="border border-gray-200 p-3 text-left font-bold text-gray-900">Formula / Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Slope-Intercept Form</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$y = mx + b$</td>
    </tr>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Volume of a Sphere</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$V = \\frac{4}{3}\\pi r^3$</td>
    </tr>
    <tr>
      <td class="border border-gray-200 p-3 text-gray-700">Constant $\\pi$</td>
      <td class="border border-gray-200 p-3 font-mono text-blue-600">$\\approx 3.14159$</td>
    </tr>
  </tbody>
</table>

**For student-produced response questions:**
• If you find more than one correct answer, enter only one answer.
• You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.
• If your answer is a fraction that doesn't fit in the provided space, enter the decimal equivalent.
• If your answer is a decimal that doesn't fit in the provided space, enter it by truncating or rounding at the fourth digit.`
  },
  questions: [
    { id: 1, type: 'multiple-choice', question: '求解方程 $x^2 + 5x + 6 = 0$ 的解', description: '这是一道二次方程求解题，需要使用因式分解或求根公式来找出方程的所有解。', options: ['A) x = -2 或 x = -3', 'B) x = 2 或 x = 3', 'C) x = -1 或 x = -6', 'D) x = 1 或 x = 6'], correctAnswer: 'A' },
    { id: 2, type: 'student-produced', question: '计算 $\\sum_{i=1}^{n}$ 当 n=5 时的值', description: '求和公式 $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$，请计算当 n=5 时的结果。', answerFormat: 'Enter your answer as a number.' },
    { id: 3, type: 'multiple-choice', question: '根据以下数据，$\\sqrt{x}$ 当 x=16 时的值是多少？', description: '平方根运算：找出一个数，使其平方等于给定的数值。', options: ['A) 2', 'B) 4', 'C) 8', 'D) 16'], correctAnswer: 'B' },
    { id: 4, type: 'multiple-choice', question: '以下哪个公式表示**分数**的正确形式？', description: '识别数学表达式中分数的标准写法。', options: ['A) $\\frac{numerator}{denominator}$', 'B) $\\sqrt{x}$', 'C) $x^{n}$', 'D) $\\sum_{i=1}^{n}$'], correctAnswer: 'A' },
    { id: 5, type: 'student-produced', question: '计算 $x^{2}$ 当 x=3 时的值', answerFormat: 'Enter your answer as a number.' },
    { id: 6, type: 'multiple-choice', question: '积分符号 $\\int_{lower}^{upper}$ 中，lower 和 upper 分别代表什么？', options: ['A) 上限和下限', 'B) 下限和上限', 'C) 左边界和右边界', 'D) 起点和终点'], correctAnswer: 'B' },
    { id: 7, type: 'multiple-choice', question: '极限符号 $\\lim_{x \\to infinity}$ 表示什么含义？', options: ['A) x 趋向于 0', 'B) x 趋向于无穷大', 'C) x 趋向于 1', 'D) x 趋向于负无穷'], correctAnswer: 'B' },
    { id: 8, type: 'student-produced', question: '如果 $\\frac{a}{b} = \\frac{3}{4}$，且 a = 6，求 b 的值', answerFormat: 'Enter your answer as a number.' },
    { id: 9, type: 'multiple-choice', question: '下列哪个表达式等价于 $\\sqrt{x}$ 当 x = 25？', options: ['A) 5', 'B) 12.5', 'C) 25', 'D) 50'], correctAnswer: 'A' },
    { id: 10, type: 'multiple-choice', question: '求和符号 $\\sum_{i=1}^{5} i$ 的结果是多少？', options: ['A) 10', 'B) 15', 'C) 20', 'D) 25'], correctAnswer: 'B' },
    { id: 11, type: 'student-produced', question: '计算 $x^{3}$ 当 x = 2 时的值', answerFormat: 'Enter your answer as a number.' },
    { id: 12, type: 'multiple-choice-with-image', question: 'Based on the graph shown, what is the approximate value of y when x = 3?', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', imageAlt: 'Line graph showing relationship between x and y', options: ['A) 5', 'B) 7', 'C) 9', 'D) 11'], correctAnswer: 'C' },
    { id: 13, type: 'table-question', question: 'The table below shows the number of students enrolled in different courses. Which course has the highest enrollment?', table: { title: 'Student Enrollment by Course', headers: ['Course', 'Fall 2023', 'Spring 2024', 'Total'], rows: [['Mathematics', '120', '135', '255'], ['English', '145', '150', '295'], ['Science', '110', '125', '235'], ['History', '95', '105', '200']] }, options: ['A) Mathematics', 'B) English', 'C) Science', 'D) History'], correctAnswer: 'B' },
    { id: 14, type: 'reading-passage', question: 'Which of the following best describes the main purpose of the passage?', passage: 'Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, caused primarily by greenhouse gas emissions from human activities, are leading to widespread environmental changes. These include melting polar ice caps, rising sea levels, and more frequent extreme weather events. Scientists warn that without immediate action to reduce carbon emissions, the consequences could be catastrophic for future generations.', options: ['A) To explain the causes of climate change', 'B) To describe the effects of rising temperatures', 'C) To warn about the urgency of addressing climate change', 'D) To compare different environmental challenges'], correctAnswer: 'C' },
    { id: 15, type: 'student-produced-with-image', question: 'The diagram shows a rectangular garden. If the length is 12 meters and the width is 8 meters, what is the area in square meters?', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop', imageAlt: 'Diagram of a rectangular garden', answerFormat: 'Enter your answer as a number.' },
    { id: 16, type: 'complex-table', question: 'The table shows the average monthly temperatures (in °C) for three cities. Which city has the greatest temperature variation between summer and winter?', table: { title: 'Average Monthly Temperatures (°C)', headers: ['Month', 'City A', 'City B', 'City C'], rows: [['January', '5', '-2', '12'], ['April', '15', '8', '18'], ['July', '25', '22', '28'], ['October', '16', '10', '20']] }, options: ['A) City A', 'B) City B', 'C) City C', 'D) All cities have equal variation'], correctAnswer: 'B' },
    { id: 17, type: 'image-with-blanks', question: 'Complete the sentences based on the pie chart showing market share distribution.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', imageAlt: 'Pie chart showing market share', content: 'Company A holds _____ of the market share, while Company B has _____ percent. Together, they control _____ of the total market.', blanks: [{ id: 'blank1', placeholder: 'percentage' }, { id: 'blank2', placeholder: 'number' }, { id: 'blank3', placeholder: 'fraction' }] },
    { id: 18, type: 'multiple-choice-with-image', question: 'According to the bar chart, which year showed the greatest increase in sales compared to the previous year?', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', imageAlt: 'Bar chart showing annual sales data', options: ['A) 2020', 'B) 2021', 'C) 2022', 'D) 2023'], correctAnswer: 'C' }
  ]
};
