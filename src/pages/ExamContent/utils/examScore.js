/**
 * 根据题目与答案计算成绩（模拟 SAT 400-1600）
 */
const SCORABLE_TYPES = [
  'multiple-choice',
  'reading-passage',
  'table-question',
  'complex-table',
  'multiple-choice-with-image'
];

export function calculateScore(examData, answers) {
  const total = examData.totalQuestions;
  const answered = Object.keys(answers).length;
  const correct = examData.questions.filter((q) => {
    if (SCORABLE_TYPES.includes(q.type)) {
      return answers[q.id] === q.correctAnswer;
    }
    return false;
  }).length;

  const rwScore = 200 + Math.round((correct / total) * 600 * 0.6);
  const mathScore = 200 + Math.round((correct / total) * 600 * 0.4);

  return {
    total: rwScore + mathScore,
    rw: rwScore,
    math: mathScore,
    correct,
    incorrect: answered - correct,
    omitted: total - answered
  };
}
