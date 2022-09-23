import { ChangeEvent } from 'react'

import TextField from '@mui/material/TextField'

import { Answer } from '../../../types'

export type QuestionnaireAnswerProps = {
  answer: Answer
  setResponseContent: (content: string) => void
}

const TextAnswer = ({
  answer,
  setResponseContent,
}: QuestionnaireAnswerProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResponseContent(event.target.value)
  }

  return (
    <TextField
      multiline
      required
      rows={4}
      defaultValue={answer.response}
      margin="normal"
      sx={{ width: '75%' }}
      InputProps={{ style: { fontSize: 'small' }, onChange: handleChange }}
    />
  )
}

export default TextAnswer
