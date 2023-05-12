exports.getQuestions = async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
}

exports.getQuestionById = async (req, res) => {
  const { questionId } = req.params
  const question = await req.repositories.questionRepo.getQuestionById(
    questionId
  )
  res.json(question)
}

exports.addQuestion = async (req, res) => {
  const { question } = req.body
  const newQuestion = await req.repositories.questionRepo.addQuestion(question)
  res.status(201).json(newQuestion)
}

exports.getAnswers = async (req, res) => {
  const { questionId } = req.params
  const answers = await req.repositories.questionRepo.getAnswers(questionId)
  res.json(answers)
}

exports.addAnswer = async (req, res) => {
  const { questionId } = req.params
  const { answer } = req.body
  const newAnswer = await req.repositories.questionRepo.addAnswer(
    questionId,
    answer
  )
  res.status(201).json(newAnswer)
}

exports.getAnswer = async (req, res) => {
  const { questionId, answerId } = req.params
  const answer = await req.repositories.questionRepo.getAnswer(
    questionId,
    answerId
  )
  res.json(answer)
}
