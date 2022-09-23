import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios from './common'
import QuestionnaireResponseView from './components/questionnaire/questionnaire-response'

import { QuestionnaireResponse } from './types'
import LoadingStatus, { LoadingState } from './components/loading-status'

const PatientFeedback = () => {
  const { id } = useParams()

  const [response, setResponse] = useState<QuestionnaireResponse | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.LOADING
  )

  useEffect(() => {
    axios
      .get<QuestionnaireResponse>(`/responses/${id}`)
      .then((apiResponse) => setResponse(apiResponse.data))
      .catch((error) => {
        if (error.response.status === 404) {
          setLoadingState(LoadingState.NOT_FOUND)
        }
      })
  }, [])

  const onSubmit = (updatedResponse: QuestionnaireResponse) => {
    axios.post(`/responses/${id}`, { ...updatedResponse }).then((response) => {
      setResponse(response.data)
    })
  }

  if (response === null) {
    return <LoadingStatus state={loadingState} />
  }

  return (
    <QuestionnaireResponseView
      response={response}
      setResponse={setResponse}
      onSubmit={onSubmit}
    />
  )
}

export default PatientFeedback
