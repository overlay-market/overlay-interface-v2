import {Container, Stack} from '@mui/material'
import {SECTIONS_STRUCTURE} from '../home_config/_Sections_structure'

function Home() {
  const sections = SECTIONS_STRUCTURE.map((section: () => JSX.Element) => {
    const Section = section
    return <Section />
  })

  return (
    <Container>
      <Stack>{sections}</Stack>
    </Container>
  )
}

export default Home
