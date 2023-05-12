const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

const testQuestions = [
  {
    id: faker.datatype.uuid(),
    summary: 'What is my name?',
    author: 'Jack London',
    answers: []
  },
  {
    id: faker.datatype.uuid(),
    summary: 'Who are you?',
    author: 'Tim Doods',
    answers: []
  }
]

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe('getQuestions', () => {
    test('should return a list of 0 questions', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe('getQuestionById', () => {
    test('should return a question', async () => {
      const question = await questionRepo.getQuestionById(testQuestions[0].id)

      expect(question).toEqual(testQuestions[0])
    })
  })

  describe('addQuestion', () => {
    test('should add a question', async () => {
      const newQuestion = {
        summary: 'What is the shape of the Earth?',
        author: 'John Stockton',
        answers: []
      }

      await questionRepo.addQuestion(newQuestion)

      const questions = await questionRepo.getQuestions()

      expect(questions).toHaveLength(3)
      expect(questions[2]).toEqual({
        ...newQuestion,
        id: expect.any(String)
      })
    })
  })

  describe('addAnswer', () => {
    test('should add an answer', async () => {
      const newAnswer = {
        author: 'Brian McKenzie',
        summary: 'The Earth is flat.'
      }

      const questions = await questionRepo.getQuestions()

      await questionRepo.addAnswer(questions[2].id, newAnswer)

      const updatedQuestions = await questionRepo.getQuestions()

      expect(updatedQuestions[2].answers).toHaveLength(1)
      expect(updatedQuestions[2].answers[0]).toEqual({
        ...newAnswer,
        id: expect.any(String)
      })
    })
  })

  describe('getAnswers', () => {
    test('should return a list of 0 answers', async () => {
      expect(await questionRepo.getAnswers(testQuestions[0].id)).toHaveLength(0)
    })
  })

  describe('getAnswer', () => {
    test('should return an answer', async () => {
      const questions = await questionRepo.getQuestions()

      const answer = await questionRepo.getAnswer(
        questions[2].id,
        questions[2].answers[0].id
      )

      expect(answer).toEqual(questions[2].answers[0])
    })
  })
})
