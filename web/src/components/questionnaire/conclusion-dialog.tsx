import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { QuestionnaireResponse, Answer } from '../../types'

type ConclusionDialogProps = {
  response: QuestionnaireResponse
  open: boolean
  onClose: () => void
}

const ConclusionDialog = ({
  response,
  open,
  onClose,
}: ConclusionDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6">
          Thanks again! Here’s what we heard:
        </Typography>

        <List sx={{ bgcolor: 'background.paper' }}>
          {response.answers.map((answer: Answer) => {
            return (
              <ListItem key={answer.id} alignItems="flex-start">
                <ListItemText
                  primary={answer.question.body}
                  secondary={
                    <>
                      {answer.response}
                      <br />
                      {answer.alternate_response}
                    </>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConclusionDialog
