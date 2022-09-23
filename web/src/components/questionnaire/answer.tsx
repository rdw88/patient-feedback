import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

import RatingAnswer from './answers/rating-answer'
import TextAnswer from './answers/text-answer'
import YesNoAnswer from './answers/yesno-answer'

import { Answer } from '../../types'

export type QuestionResponseProps = {
  answer: Answer
  order: number
  onNext: (updatedAnswer: Answer) => void
  onBack: () => void
  onSubmit: (updatedAnswer: Answer) => void
  isSubmitStep: boolean
}

const AnswerView = ({
  answer,
  order,
  onNext,
  onBack,
  onSubmit,
  isSubmitStep,
}: QuestionResponseProps) => {
  const [responseText, setResponseText] = useState<string>(answer.response)
  const [alternateResponseText, setAlternateResponseText] = useState<string>(
    answer.alternate_response
  )

  const answerTypeMapping = {
    text: <TextAnswer answer={answer} setResponseContent={setResponseText} />,
    yesno: (
      <YesNoAnswer
        answer={answer}
        setResponseContent={setResponseText}
        setAlternateResponseContent={setAlternateResponseText}
      />
    ),
    rating: (
      <RatingAnswer answer={answer} setResponseContent={setResponseText} />
    ),
  }

  const onNextClicked = () => {
    const updatedAnswer: Answer = {
      ...answer,
      response: responseText,
      alternate_response: alternateResponseText,
    }

    isSubmitStep ? onSubmit(updatedAnswer) : onNext(updatedAnswer)
  }

  return (
    <>
      <StepLabel>{answer.question.title}</StepLabel>

      <StepContent>
        <Typography variant="body2">{answer.question.body}</Typography>

        {answerTypeMapping[answer.question.type]}

        <Box sx={{ mt: 1, mb: 2 }}>
          <Button variant="contained" onClick={onNextClicked} sx={{ mr: 1 }}>
            {isSubmitStep ? 'Submit' : 'Next'}
          </Button>
          <Button disabled={order === 0} onClick={onBack}>
            Back
          </Button>
        </Box>
      </StepContent>
    </>
  )
}

export default AnswerView
