const express = require('express')
const router = express.Router()
const QuestionsController = require('../controllers/questions.controller')
const { validateQuestion, validateAnswer } = require('../middleware/validate')

router.get('/', QuestionsController.getQuestions)
router.get('/:questionId', QuestionsController.getQuestionById)
router.post('/', validateQuestion, QuestionsController.addQuestion)
router.get('/:questionId/answers', QuestionsController.getAnswers)
router.post(
  '/:questionId/answers',
  validateAnswer,
  QuestionsController.addAnswer
)
router.get('/:questionId/answers/:answerId', QuestionsController.getAnswer)

module.exports = router
