import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const FindContainer = () => {
  return (
    <Container disableGutters className="h-full">
      <Grid container spacing={2} className="h-full">
        <Grid size={6}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper elevation={3}>
            <Button
              variant="contained"
              className="text-hh-primary bg-hh-secondary w-full"
            >
              Search
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default FindContainer
