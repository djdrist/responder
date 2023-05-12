exports.validateQuestion = (req, res, next) => {
  const question = req.body
  if (!question.author)
    return res.status(400).send({ message: 'Author is required' })
  if (!question.summary)
    return res.status(400).send({ message: 'Summary is required' })
  next()
}

exports.validateAnswer = (req, res, next) => {
  const answer = req.body
  if (!answer.author)
    return res.status(400).send({ message: 'Author is required' })
  if (!answer.summary)
    return res.status(400).send({ message: 'Summary is required' })
  next()
}
