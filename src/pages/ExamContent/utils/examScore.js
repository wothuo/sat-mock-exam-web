/**
 * 根据题目与答案计算成绩（模拟 SAT 400-1600）
 */
const SCORABLE_TYPES = ['CHOICE'];

export function calculateScore(examData, answers, answerResults) {
  const total = examData.totalQuestions;
  
  let correct, answered, incorrect, omitted;
  
  if (answerResults && answerResults.length > 0) {
    // 使用服务器返回的答题结果
    answered = answerResults.filter(ar => ar.userAnswer).length;
    correct = answerResults.filter(ar => ar.isCorrect === 1).length;
    incorrect = answerResults.filter(ar => ar.isCorrect === 0 && ar.userAnswer).length;
    omitted = answerResults.filter(ar => !ar.userAnswer).length;
  } else {
    // 回退到客户端计算
    answered = Object.keys(answers).length;
    correct = examData.questions.filter((q) => {
      if (SCORABLE_TYPES.includes(q.type)) {
        return answers[q.id] === q.correctAnswer;
      }
      return false;
    }).length;
    incorrect = answered - correct;
    omitted = total - answered;
  }

  const rwScore = 200 + Math.round((correct / total) * 600 * 0.6);
  const mathScore = 200 + Math.round((correct / total) * 600 * 0.4);

  return {
    total: rwScore + mathScore,
    rw: rwScore,
    math: mathScore,
    correct,
    incorrect,
    omitted
  };
}