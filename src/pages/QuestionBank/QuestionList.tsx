import { CalendarOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

function QuestionList({ onEdit }) {
  const [selectedSubject, setSelectedSubject] = useState('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');

  const subjects = ['全部', '数学', '阅读', '语法'];
  const difficulties = ['全部', 'Easy', 'Medium', 'Hard'];

  const mockQuestions = [
    {
      id: 1,
      type: '二次函数',
      subject: '数学',
      difficulty: 'Medium',
      question: '求解方程 $x^2 + 5x + 6 = 0$ 的解',
      options: ['A) x = -2 或 x = -3', 'B) x = 2 或 x = 3', 'C) x = -1 或 x = -6', 'D) x = 1 或 x = 6'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      type: '主旨细节题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'What is the main purpose of the passage?',
      options: ['A) To describe', 'B) To explain', 'C) To argue', 'D) To compare'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      type: '基础运算',
      subject: '数学',
      difficulty: 'Easy',
      question: '计算 $\\frac{3}{4} + \\frac{1}{2}$ 的值',
      correctAnswer: '1.25',
      source: '历年考题',
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Medium',
      question: 'Which of the following versions of the underlined portion most effectively uses punctuation to separate the clauses?',
      options: ['A) however; it', 'B) however, it', 'C) however: it', 'D) however it'],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-16'
    },
    {
      id: 5,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'As used in line 15, "plastic" most nearly means',
      options: ['A) synthetic', 'B) malleable', 'C) artificial', 'D) rigid'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-17'
    },
    {
      id: 6,
      type: '几何',
      subject: '数学',
      difficulty: 'Hard',
      question: '一个圆的方程为 $(x-3)^2 + (y+2)^2 = 25$，求该圆的周长。',
      options: ['A) $5\\pi$', 'B) $10\\pi$', 'C) $25\\pi$', 'D) $50\\pi$'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-18'
    },
    {
      id: 7,
      type: '逻辑词',
      subject: '语法',
      difficulty: 'Easy',
      question: 'The researchers found no evidence of the hormone in the control group. ________, the experimental group showed significant levels.',
      options: ['A) Furthermore', 'B) In contrast', 'C) Therefore', 'D) Similarly'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-01-19'
    },
    {
      id: 8,
      type: '统计',
      subject: '数学',
      difficulty: 'Medium',
      question: '一组数据的平均数为 15，标准差为 2。如果每个数据都增加 5，新的平均数和标准差分别是多少？',
      options: ['A) 20, 7', 'B) 20, 2', 'C) 15, 7', 'D) 15, 2'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-20'
    },
    {
      id: 9,
      type: '二次函数',
      subject: '数学',
      difficulty: 'Hard',
      question: '已知二次函数 $f(x) = ax^2 + bx + c$ 的图像经过点 $(1, 0)$ 和 $(3, 0)$，且最小值为 $-4$，求 $a+b+c$ 的值。',
      options: ['A) -4', 'B) 0', 'C) 4', 'D) 8'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-20'
    },
    {
      id: 10,
      type: '文本证据题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'Which choice best supports the claim that the author views the new policy with skepticism?',
      options: ['A) Lines 12-15 ("The...results")', 'B) Lines 22-24 ("While...unclear")', 'C) Lines 45-48 ("This...success")', 'D) Lines 55-58 ("Future...needed")'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-21'
    },
    {
      id: 11,
      type: '动词专项',
      subject: '语法',
      difficulty: 'Easy',
      question: 'Neither the students nor the teacher ________ aware of the schedule change until this morning.',
      options: ['A) was', 'B) were', 'C) has been', 'D) are'],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-22'
    },
    {
      id: 12,
      type: '指数函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'If $3^{2x-1} = 27$, what is the value of $x$?',
      options: ['A) 1', 'B) 2', 'C) 3', 'D) 4'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-01-23'
    },
    {
      id: 13,
      type: '图表题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'Based on the data in the graph, which statement accurately describes the relationship between temperature and reaction rate?',
      options: ['A) Linear increase', 'B) Exponential decrease', 'C) Initial increase followed by a plateau', 'D) No significant correlation'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-01-24'
    },
    {
      id: 14,
      type: '定语、状语、同位语',
      subject: '语法',
      difficulty: 'Medium',
      question: 'The novel, ________ by a young author from Brazil, has become an international bestseller.',
      options: ['A) written', 'B) writing', 'C) was written', 'D) having written'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-01-25'
    },
    {
      id: 15,
      type: '数据分析',
      subject: '数学',
      difficulty: 'Easy',
      question: 'A set of data consists of {10, 12, 15, 15, 18}. What is the median of this data set?',
      options: ['A) 12', 'B) 14', 'C) 15', 'D) 18'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-01-26'
    },
    {
      id: 16,
      type: '推断题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'It can be inferred from the passage that the primary reason for the decline in the population was',
      options: ['A) Habitat loss', 'B) Climate change', 'C) Overhunting', 'D) Disease'],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-01-27'
    },
    {
      id: 17,
      type: 'notes题',
      subject: '语法',
      difficulty: 'Medium',
      question: 'The student wants to emphasize the scale of the project. Which choice uses relevant information from the notes to accomplish this goal?',
      options: ['A) The project started in 2010.', 'B) Over 500 researchers participated.', 'C) It was funded by the government.', 'D) The results were published in 2022.'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-01-28'
    },
    {
      id: 18,
      type: '应用题',
      subject: '数学',
      difficulty: 'Medium',
      question: 'A car travels 300 miles on 12 gallons of gas. How many gallons are needed for a 500-mile trip?',
      options: ['A) 15', 'B) 18', 'C) 20', 'D) 25'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-01-29'
    },
    {
      id: 19,
      type: '结构目的题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'The main purpose of the third paragraph is to',
      options: ['A) Introduce a new theory', 'B) Provide a counterargument', 'C) Elaborate on a previous point', 'D) Summarize the findings'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-01-30'
    },
    {
      id: 20,
      type: '句子连接',
      subject: '语法',
      difficulty: 'Easy',
      question: 'The weather was beautiful; ________, we decided to go for a hike.',
      options: ['A) therefore', 'B) however', 'C) otherwise', 'D) instead'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-01-31'
    },
    {
      id: 21,
      type: '三角函数',
      subject: '数学',
      difficulty: 'Hard',
      question: 'In a right triangle, if $\\sin(\\theta) = 0.6$, what is the value of $\\cos(\\theta)$?',
      options: ['A) 0.4', 'B) 0.7', 'C) 0.8', 'D) 1.0'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-01'
    },
    {
      id: 22,
      type: '双篇题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'Which statement best describes the relationship between the two passages?',
      options: ['A) Passage 2 supports Passage 1', 'B) Passage 2 challenges Passage 1', 'C) Passage 2 provides context for Passage 1', 'D) Passage 2 ignores Passage 1'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-02'
    },
    {
      id: 23,
      type: '名词、代词、形容词',
      subject: '语法',
      difficulty: 'Easy',
      question: 'Each of the participants was asked to bring ________ own laptop to the workshop.',
      options: ['A) their', 'B) his or her', 'C) its', 'D) our'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-03'
    },
    {
      id: 24,
      type: '圆方程',
      subject: '数学',
      difficulty: 'Medium',
      question: 'What is the center of the circle with equation $(x+5)^2 + (y-2)^2 = 16$?',
      options: ['A) (5, -2)', 'B) (-5, 2)', 'C) (5, 2)', 'D) (-5, -2)'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-04'
    },
    {
      id: 25,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'As used in line 42, "arresting" most nearly means',
      options: ['A) capturing', 'B) striking', 'C) stopping', 'D) legal'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-05'
    },
    {
      id: 26,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Medium',
      question: 'The city is famous for its landmarks: the Eiffel Tower, the Louvre, and ________.',
      options: ['A) Notre Dame', 'B) ; Notre Dame', 'C) : Notre Dame', 'D) , Notre Dame'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-06'
    },
    {
      id: 27,
      type: '基础运算',
      subject: '数学',
      difficulty: 'Easy',
      question: 'Simplify the expression: $2(x + 3) - 4(x - 1)$.',
      options: ['A) $-2x + 10$', 'B) $-2x + 2$', 'C) $2x + 10$', 'D) $2x + 2$'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-07'
    },
    {
      id: 28,
      type: '主旨细节题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'According to the passage, what was the main finding of the 2018 study?',
      options: ['A) Increased efficiency', 'B) Reduced costs', 'C) Improved safety', 'D) Higher satisfaction'],
      correctAnswer: 'A',
      source: '官方样题',
      createdAt: '2024-02-08'
    },
    {
      id: 33,
      type: '一次函数',
      subject: '数学',
      difficulty: 'Easy',
      question: 'If $2x + 5 = 13$, what is the value of $x$?',
      options: ['A) 3', 'B) 4', 'C) 6', 'D) 9'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-09'
    },
    {
      id: 34,
      type: '词汇题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'As used in the context of the second paragraph, "convey" most nearly means',
      options: ['A) transport', 'B) communicate', 'C) lead', 'D) support'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-10'
    },
    {
      id: 35,
      type: '标点符号',
      subject: '语法',
      difficulty: 'Hard',
      question: 'The discovery was unexpected ________ it challenged long-held beliefs in the scientific community.',
      options: ['A) ; however,', 'B) : however', 'C) , however', 'D) however'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-11'
    },
    {
      id: 36,
      type: '几何',
      subject: '数学',
      difficulty: 'Medium',
      question: 'A cylinder has a radius of 3 and a height of 5. What is its volume?',
      options: ['A) $15\\pi$', 'B) $30\\pi$', 'C) $45\\pi$', 'D) $90\\pi$'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-12'
    },
    {
      id: 37,
      type: '结构目的题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'The primary purpose of the passage is to',
      options: ['A) critique a methodology', 'B) propose a new theory', 'C) summarize recent research', 'D) resolve a historical debate'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-13'
    },
    {
      id: 38,
      type: '动词专项',
      subject: '语法',
      difficulty: 'Easy',
      question: 'The group of students ________ planning a surprise party for their teacher.',
      options: ['A) is', 'B) are', 'C) was', 'D) were'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-14'
    },
    {
      id: 39,
      type: '统计',
      subject: '数学',
      difficulty: 'Medium',
      question: 'A bag contains 4 red marbles and 6 blue marbles. If one marble is drawn at random, what is the probability it is red?',
      options: ['A) 0.4', 'B) 0.6', 'C) 0.25', 'D) 0.66'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-15'
    },
    {
      id: 40,
      type: '文本证据题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'Which choice provides the best evidence for the answer to the previous question?',
      options: ['A) Lines 5-8', 'B) Lines 15-19', 'C) Lines 30-34', 'D) Lines 45-49'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-16'
    },
    {
      id: 41,
      type: '逻辑词',
      subject: '语法',
      difficulty: 'Medium',
      question: 'The experiment failed to produce the expected results. ________, the team decided to try a different approach.',
      options: ['A) However', 'B) Therefore', 'C) Furthermore', 'D) Similarly'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-17'
    },
    {
      id: 42,
      type: '二次函数',
      subject: '数学',
      difficulty: 'Easy',
      question: 'What are the solutions to the equation $x^2 - 9 = 0$?',
      options: ['A) x = 3', 'B) x = -3', 'C) x = 3 or x = -3', 'D) x = 9'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-18'
    },
    {
      id: 43,
      type: '推断题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'Based on the passage, the author would most likely agree with which of the following statements?',
      options: ['A) Technology is always beneficial', 'B) Human intuition is irreplaceable', 'C) Data can be misleading', 'D) Progress is inevitable'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-19'
    },
    {
      id: 44,
      type: '名词、代词、形容词',
      subject: '语法',
      difficulty: 'Medium',
      question: 'The scientist ________ won the Nobel Prize is coming to our university.',
      options: ['A) who', 'B) whom', 'C) whose', 'D) which'],
      correctAnswer: 'A',
      source: 'Question Bank考题',
      createdAt: '2024-02-20'
    },
    {
      id: 45,
      type: '应用题',
      subject: '数学',
      difficulty: 'Easy',
      question: 'A jacket is on sale for 20% off its original price of $80. What is the sale price?',
      options: ['A) $16', 'B) $60', 'C) $64', 'D) $72'],
      correctAnswer: 'C',
      source: '历年考题',
      createdAt: '2024-02-21'
    },
    {
      id: 46,
      type: '图表题',
      subject: '阅读',
      difficulty: 'Medium',
      question: 'According to the graph, in which year did the population reach its peak?',
      options: ['A) 2010', 'B) 2015', 'C) 2020', 'D) 2025'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-22'
    },
    {
      id: 47,
      type: '定语、状语、同位语',
      subject: '语法',
      difficulty: 'Medium',
      question: 'She enjoys hiking, swimming, and ________ in the mountains.',
      options: ['A) to camp', 'B) camping', 'C) camp', 'D) having camped'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-23'
    },
    {
      id: 48,
      type: '基础函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'Solve the system of equations: $x + y = 10$ and $x - y = 2$.',
      options: ['A) (6, 4)', 'B) (4, 6)', 'C) (5, 5)', 'D) (7, 3)'],
      correctAnswer: 'A',
      source: '历年考题',
      createdAt: '2024-02-24'
    },
    {
      id: 49,
      type: '双篇题',
      subject: '阅读',
      difficulty: 'Hard',
      question: 'The tone of the author in Passage 1 is best described as',
      options: ['A) optimistic', 'B) skeptical', 'C) objective', 'D) passionate'],
      correctAnswer: 'B',
      source: '官方样题',
      createdAt: '2024-02-25'
    },
    {
      id: 50,
      type: '句子连接',
      subject: '语法',
      difficulty: 'Hard',
      question: 'Walking down the street, ________.',
      options: ['A) the trees were beautiful', 'B) I saw many beautiful trees', 'C) beauty was everywhere', 'D) it was a sunny day'],
      correctAnswer: 'B',
      source: 'Question Bank考题',
      createdAt: '2024-02-26'
    },
    {
      id: 51,
      type: '指数函数',
      subject: '数学',
      difficulty: 'Medium',
      question: 'Simplify the expression: $(2^3)^2$.',
      options: ['A) 32', 'B) 64', 'C) 128', 'D) 256'],
      correctAnswer: 'B',
      source: '历年考题',
      createdAt: '2024-02-27'
    },
    {
      id: 52,
      type: '主旨细节题',
      subject: '阅读',
      difficulty: 'Easy',
      question: 'What is the main reason the character decided to leave the city?',
      options: ['A) To find a job', 'B) To seek adventure', 'C) To escape the noise', 'D) To visit family'],
      correctAnswer: 'C',
      source: '官方样题',
      createdAt: '2024-02-28'
    }
  ];

  const filteredQuestions = mockQuestions.filter(q => {
    if (selectedSubject !== '全部' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== '全部' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getTypeLabel = (type) => {
    // 直接返回类型名称，因为现在存储的就是专业题型名称
    return type;
  };

      useEffect(() => {
        if (window.renderMathInElement) {
          const containers = document.querySelectorAll('.math-container');
          containers.forEach(container => {
            window.renderMathInElement(container, {
              delimiters: [
                {left: '$', right: '$', display: false},
                {left: '$$', right: '$$', display: true}
              ],
              throwOnError: false
            });
          });
        }
      }, [filteredQuestions]);

      return (
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">科目</label>
              <Space>
                {subjects.map(subject => (
                  <Button
                    key={subject}
                    type={selectedSubject === subject ? 'primary' : 'default'}
                    onClick={() => setSelectedSubject(subject)}
                    className={selectedSubject === subject ? 'bg-red-600 hover:!bg-red-600 border-0' : 'hover:!border-red-500 hover:!text-red-600'}
                  >
                    {subject}
                  </Button>
                ))}
              </Space>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
              <Space>
                {difficulties.map(diff => (
                  <Button
                    key={diff}
                    type={selectedDifficulty === diff ? 'primary' : 'default'}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={selectedDifficulty === diff ? 'bg-red-600 hover:!bg-red-600 border-0' : 'hover:!border-red-500 hover:!text-red-600'}
                  >
                    {diff}
                  </Button>
                ))}
              </Space>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            共 {filteredQuestions.length} 道题目
          </div>
        </Card>

        <div className="space-y-4">
          {filteredQuestions.map(question => (
            <Card key={question.id} hoverable>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Space size="small" className="mb-3" wrap>
                    <Tag color="blue">{getTypeLabel(question.type)}</Tag>
                    <Tag color="purple">{question.subject}</Tag>
                    <Tag color={
                      question.difficulty === 'Easy' ? 'success' :
                      question.difficulty === 'Medium' ? 'warning' : 'error'
                    }>
                      {question.difficulty}
                    </Tag>
                    <Tag>{question.source}</Tag>
                  </Space>

                  <div className="text-gray-900 mb-3 font-medium math-container">
                    {question.question}
                  </div>

                  {question.options && (
                    <div className="space-y-1 text-sm text-gray-600">
                      {question.options.slice(0, 2).map((option, index) => (
                        <div key={index}>{option}</div>
                      ))}
                      {question.options.length > 2 && (
                        <div className="text-gray-400">... 共 {question.options.length} 个选项</div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 text-sm text-gray-500">
                    <CalendarOutlined className="mr-1" />
                    创建时间：{question.createdAt}
                  </div>
                </div>

                <div className="ml-6">
                  <Space direction="vertical">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(question)}
                      className="bg-blue-600 hover:bg-blue-700 border-0"
                    >
                      编辑
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                    >
                      删除
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          ))}
        </div>
    </div>
  );
}

export default QuestionList;

