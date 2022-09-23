import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export enum LoadingState {
  LOADING = 'LOADING',
  NOT_FOUND = 'NOT_FOUND',
}

export type LoadingStatusProps = {
  state: LoadingState
}

const LoadingStatus = ({ state }: LoadingStatusProps) => {
  const message = {
    LOADING: 'Loading...',
    NOT_FOUND: 'Not found!',
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4">{message[state]}</Typography>
    </Box>
  )
}

export default LoadingStatus
