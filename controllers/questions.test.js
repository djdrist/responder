const request = require('supertest')
const app = require('../index')
const { writeFile, rm } = require('fs/promises')

const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'

const testQuestions = [
  {
    summary: 'What is my name?',
    author: 'Jack London',
    answers: []
  },
  {
    summary: 'Who are you?',
    author: 'Tim Doods',
    answers: []
  }
]

const getQuestionId = async () => {
  const questions = await request(app).get('/questions')
  return questions.body[0].id
}

describe('question routes', () => {
  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
  })

  describe('GET /questions', () => {
    test('should return a list of 0 questions', async () => {
      const response = await request(app).get('/questions')

      expect(response.body).toHaveLength(0)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST /questions', () => {
    test('should add a question', async () => {
      const response = await request(app)
        .post('/questions')
        .send(testQuestions[0])

      expect(response.body).toEqual({
        ...testQuestions[0],
        id: expect.any(String)
      })
      expect(response.statusCode).toBe(201)
    })

    test('should return a 400 if no author provided', async () => {
      const response = await request(app)
        .post('/questions')
        .send({ summary: 'What is my name?' })

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        message: 'Author is required'
      })
    })

    test('should return a 400 if no summary provided', async () => {
      const response = await request(app)
        .post('/questions')
        .send({ author: 'Jack London' })

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        message: 'Summary is required'
      })
    })
  })

  describe('GET /questions/:questionId', () => {
    test('should return a question', async () => {
      const questions = await request(app).get('/questions')
      const questionId = questions.body[0].id
      const response = await request(app).get(`/questions/${questionId}`)
      expect(response.body).toEqual(questions.body[0])
      expect(response.statusCode).toBe(200)
    })

    test('should return a 404 if no question by ID found', async () => {
      const response = await request(app).get('/questions/123')
      expect(response.statusCode).toBe(404)
    })
  })

  describe('GET /questions/:questionId/answers', () => {
    test('should return a list of 0 answers', async () => {
      const questionId = await getQuestionId()
      const response = await request(app).get(
        `/questions/${questionId}/answers`
      )
      expect(response.body).toHaveLength(0)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST /questions/:questionId/answers', () => {
    test('should add an answer', async () => {
      const questionId = await getQuestionId()
      const newAnswer = {
        author: 'Brian McKenzie',
        summary: 'The Earth is flat.'
      }
      const response = await request(app)
        .post(`/questions/${questionId}/answers`)
        .send(newAnswer)

      expect(response.body).toEqual({
        ...newAnswer,
        id: expect.any(String)
      })
      expect(response.statusCode).toBe(201)
    })

    test('should return a 400 if no author provided', async () => {
      const questionId = await getQuestionId()
      const response = await request(app)
        .post(`/questions/${questionId}/answers`)
        .send({ summary: 'The Earth is flat.' })

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        message: 'Author is required'
      })
    })

    test('should return a 400 if no summary provided', async () => {
      const questionId = await getQuestionId()
      const response = await request(app)
        .post(`/questions/${questionId}/answers`)
        .send({ author: 'Brian McKenzie' })

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({
        message: 'Summary is required'
      })
    })
  })

  describe('GET /questions/:questionId/answers/:answerId', () => {
    test('should return an answer', async () => {
      const questionId = await getQuestionId()
      const answers = await request(app).get(`/questions/${questionId}/answers`)
      const answerId = answers.body[0].id
      const response = await request(app).get(
        `/questions/${questionId}/answers/${answerId}`
      )
      expect(response.body).toEqual(answers.body[0])
      expect(response.statusCode).toBe(200)
    })

    test('should return a 404 if no answer by ID found', async () => {
      const questionId = await getQuestionId()
      const response = await request(app).get(
        `/questions/${questionId}/answers/123`
      )
      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual({
        message: 'Answer not found'
      })
    })
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })
})
