import { render, screen } from '@testing-library/react'
import QuestionnaireResponseView from './components/questionnaire/questionnaire-response'
import PatientFeedback from './PatientFeedback'
import { QuestionnaireResponse } from './types'

const testResponse: QuestionnaireResponse = {
  id: 1,
  name: 'Care Summary',
  appointment: {
    id: 1,
    start_date: '2022-09-22T23:00:00Z',
    doctor: {
      id: 1,
      first_name: 'Charles',
      last_name: 'Pepper',
    },
    patient: {
      id: 0,
      first_name: 'Tendo',
      last_name: 'Tenderson',
    },
    status: 'Finished',
  },
  answers: [
    {
      id: 1,
      question: {
        id: 1,
        title: 'Diagnosis',
        body: 'Did Dr. Pepper explain how to manage this diagnosis?',
        type: 'yesno',
      },
      response: 'No',
      alternate_response: 'He must have forgotten',
    },
    {
      id: 2,
      question: {
        id: 2,
        title: 'Additional Feedback',
        body: "Any additional feedback you'd like to share?",
        type: 'text',
      },
      response: 'Not at this time!',
      alternate_response: '',
    },
  ],
}

const renderQuestionnaire = () => {
  const setResponse = (response: QuestionnaireResponse) => {}
  const onSubmit = (updatedResponse: QuestionnaireResponse) => {}

  render(
    <QuestionnaireResponseView
      response={testResponse}
      setResponse={setResponse}
      onSubmit={onSubmit}
    />
  )
}

test('renders header title, doctor, and appointment start date', () => {
  renderQuestionnaire()

  const title = screen.getByText('Care Summary')
  expect(title).toBeInTheDocument()

  const doctorName = screen.getByText('Dr. Charles Pepper')
  expect(doctorName).toBeInTheDocument()

  const startDate = screen.getByText('9/22/2022, 4:00:00 PM')
  expect(startDate).toBeInTheDocument()
})

test('renders questionnaire steps', () => {
  renderQuestionnaire()

  const answer = screen.getAllByTestId('answer-view')
  expect(answer).toHaveLength(2)

  const firstAnswer = screen.getByText('Diagnosis')
  expect(firstAnswer).toBeInTheDocument()

  const firstQuestion = screen.getByText(
    'Did Dr. Pepper explain how to manage this diagnosis?'
  )
  expect(firstQuestion).toBeInTheDocument()

  const noAnswer: HTMLInputElement = screen.getByLabelText('No')
  expect(noAnswer).toBeInTheDocument()
  expect(noAnswer.checked).toBe(true)

  const alternateResponse = screen.getByText('He must have forgotten')
  expect(alternateResponse).toBeInTheDocument()

  const secondAnswer = screen.getByText('Additional Feedback')
  expect(secondAnswer).toBeInTheDocument()
})
