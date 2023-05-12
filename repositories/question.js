const { readFile, writeFile } = require('fs/promises')
const { v4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const question = questions.find(q => q.id === questionId)

    return question
  }

  const addQuestion = async question => {
    const questions = await getQuestions()
    const newQuestion = { ...question, id: v4() }
    questions.push(newQuestion)
    const newQuestions = JSON.stringify(questions, null, 2)
    const response = await writeFile(fileName, newQuestions)

    return newQuestion
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    const answers = question.answers

    return answers
  }
  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    const answer = answers.find(a => a.id === answerId)

    return answer
  }
  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    const question = await getQuestionById(questionId)
    const newAnswer = { ...answer, id: v4() }
    question.answers.push(newAnswer)
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return question
      }
      return q
    })

    const newQuestions = JSON.stringify(updatedQuestions, null, 2)
    await writeFile(fileName, newQuestions)

    return newAnswer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
