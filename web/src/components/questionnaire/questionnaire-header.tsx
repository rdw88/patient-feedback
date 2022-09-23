import { useContext } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { QuestionnaireResponseContext } from './questionnaire-response'

const QuestionnaireHeader = () => {
  const response = useContext(QuestionnaireResponseContext)

  const doctor = response.appointment.doctor
  const doctorName = `Dr. ${doctor.first_name} ${doctor.last_name}`

  return (
    <Box>
      <Typography variant="h4">{response.name}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 0.5,
          pb: 1,
          pt: 1,
        }}
      >
        <Avatar
          alt={doctorName}
          src="/doctor.jpg"
          sx={{ width: 32, height: 32 }}
        />
        <Typography sx={{ ml: 1 }} variant="subtitle2">
          {doctorName}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, pb: 1 }}>
        <CalendarMonthIcon color="disabled" />
        <Typography sx={{ ml: 1.5 }} variant="subtitle2">
          {new Date(response.appointment.start_date).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}

export default QuestionnaireHeader
