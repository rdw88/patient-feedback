import { ChangeEvent } from 'react'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

import { Answer } from '../../../types'

export type RatingAnswerProps = {
  answer: Answer
  setResponseContent: (content: string) => void
}

const marks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => ({
  value: value,
  label: value,
}))

const RatingAnswer = ({ answer, setResponseContent }: RatingAnswerProps) => {
  const handleChange = (
    event: Event,
    value: number | Array<number>,
    activeStep: number
  ) => {
    setResponseContent(value.toString())
  }

  return (
    <Box sx={{ width: '75%', pb: 2 }}>
      <Slider
        valueLabelDisplay="auto"
        marks={marks}
        defaultValue={
          answer.response === '' ? 5 : Number.parseInt(answer.response)
        }
        step={1}
        min={1}
        max={10}
        sx={{ m: 1 }}
        onChange={handleChange}
      />
    </Box>
  )
}

export default RatingAnswer
