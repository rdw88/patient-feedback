import { ChangeEvent, useState } from 'react'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Answer } from '../../../types'

export type YesNoAnswerProps = {
  answer: Answer
  setResponseContent: (content: string) => void
  setAlternateResponseContent: (content: string) => void
}

const YesNoAnswer = ({
  answer,
  setResponseContent,
  setAlternateResponseContent,
}: YesNoAnswerProps) => {
  const [value, setValue] = useState<string>(answer.response)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setResponseContent(event.target.value)

    if (event.target.value === 'Yes') {
      setAlternateResponseContent('')
    }
  }

  const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAlternateResponseContent(event.target.value)
  }

  const yesLabel = <Box fontSize={'small'}>Yes</Box>
  const noLabel = <Box fontSize={'small'}>No</Box>

  return (
    <RadioGroup
      onChange={onChange}
      sx={{ m: 1 }}
      defaultValue={answer.response}
    >
      <FormControlLabel value="Yes" control={<Radio />} label={yesLabel} />
      <FormControlLabel value="No" control={<Radio />} label={noLabel} />

      {value === 'No' && (
        <Box>
          <Typography variant="body2">
            We're sorry to hear that. Is there any way we could improve in the
            future?
          </Typography>
          <TextField
            required
            multiline
            rows={2}
            defaultValue={answer.alternate_response}
            margin="dense"
            sx={{ width: '75%' }}
            InputProps={{
              style: { fontSize: 'small' },
              onChange: onTextFieldChange,
            }}
          />
        </Box>
      )}
    </RadioGroup>
  )
}

export default YesNoAnswer
