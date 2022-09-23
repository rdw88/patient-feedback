import { createContext } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { QuestionnaireResponse } from '../../types'
import QuestionnaireHeader from './questionnaire-header'
import QuestionResponsesView from './question-responses'

export type QuestionnaireProps = {
  response: QuestionnaireResponse
  setResponse: (response: QuestionnaireResponse) => void
  onSubmit: (updatedResponse: QuestionnaireResponse) => void
}

export const QuestionnaireResponseContext =
  createContext<QuestionnaireResponse>({
    id: 0,
    name: '',
    appointment: {
      id: 0,
      start_date: '',
      doctor: {
        id: 0,
        first_name: '',
        last_name: '',
      },
      patient: {
        id: 0,
        first_name: '',
        last_name: '',
      },
      status: '',
    },
    answers: [],
  })

const QuestionnaireResponseView = ({
  response,
  setResponse,
  onSubmit,
}: QuestionnaireProps) => {
  return (
    <QuestionnaireResponseContext.Provider value={response}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: '800px',
            minWidth: '800px',
            borderRadius: 2,
            p: 3,
          }}
        >
          <QuestionnaireHeader />
          <QuestionResponsesView onSubmit={onSubmit} />
        </Paper>
      </Box>
    </QuestionnaireResponseContext.Provider>
  )
}

export default QuestionnaireResponseView
