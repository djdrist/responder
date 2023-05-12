exports.getQuestions = async (req, res) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    return res.json(questions)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.getQuestionById = async (req, res) => {
  const { questionId } = req.params
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      questionId
    )
    if (!question)
      return res.status(404).send({ message: 'Question not found' })
    return res.json(question)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.addQuestion = async (req, res) => {
  let question = req.body
  if (!question.answers || typeof question.answers !== 'array') {
    question.answers = []
  }
  try {
    const newQuestion = await req.repositories.questionRepo.addQuestion(
      question
    )
    return res.status(201).json(newQuestion)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.getAnswers = async (req, res) => {
  const { questionId } = req.params
  try {
    const answers = await req.repositories.questionRepo.getAnswers(questionId)
    return res.json(answers)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.addAnswer = async (req, res) => {
  const { questionId } = req.params
  const answer = req.body
  try {
    const newAnswer = await req.repositories.questionRepo.addAnswer(
      questionId,
      answer
    )
    return res.status(201).json(newAnswer)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.getAnswer = async (req, res) => {
  const { questionId, answerId } = req.params
  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      questionId,
      answerId
    )
    if (!answer) return res.status(404).send({ message: 'Answer not found' })
    return res.json(answer)
  } catch (error) {
    res.status(500).send(error.message)
  }
}
