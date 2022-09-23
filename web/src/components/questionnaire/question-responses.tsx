import { useContext, useState } from 'react'

import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'

import AnswerView from './answer'
import ConclusionDialog from './conclusion-dialog'

import { QuestionnaireResponse, Answer } from '../../types'
import { QuestionnaireResponseContext } from './questionnaire-response'

export type QuestionnaireResponsesProps = {
  onSubmit: (updatedResponse: QuestionnaireResponse) => void
}

const updateAnswerForResponse = (
  currentResponse: QuestionnaireResponse,
  updatedAnswer: Answer
): QuestionnaireResponse => {
  return {
    ...currentResponse,
    answers: currentResponse.answers.map((answer) =>
      answer.question.id === updatedAnswer.question.id ? updatedAnswer : answer
    ),
  }
}

const QuestionResponsesView = ({ onSubmit }: QuestionnaireResponsesProps) => {
  const response = useContext(QuestionnaireResponseContext)

  const [activeStep, setActiveStep] = useState(0)
  const [newResponse, setNewResponse] = useState(response)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onNext = (updatedAnswer: Answer) => {
    setNewResponse(updateAnswerForResponse(newResponse, updatedAnswer))

    setActiveStep((previousStep) => previousStep + 1)
  }

  const onBack = () => {
    setActiveStep((previousStep) => previousStep - 1)
  }

  const onSubmitStep = (updatedAnswer: Answer) => {
    onSubmit(updateAnswerForResponse(newResponse, updatedAnswer))
    setDialogOpen(true)

    setActiveStep((previousStep) => previousStep + 1)
  }

  const onCloseDialog = () => {
    setDialogOpen(false)
    setActiveStep(0)
  }

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {newResponse.answers.map((answer, index) => (
          <Step key={answer.question.id} data-testid="answer-view">
            <AnswerView
              answer={answer}
              order={index}
              onNext={onNext}
              onBack={onBack}
              onSubmit={onSubmitStep}
              isSubmitStep={index === response.answers.length - 1}
            />
          </Step>
        ))}
      </Stepper>

      <ConclusionDialog
        response={response}
        open={dialogOpen}
        onClose={onCloseDialog}
      />
    </Box>
  )
}

export default QuestionResponsesView
