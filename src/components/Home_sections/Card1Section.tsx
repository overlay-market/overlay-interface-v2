import { Container, Grid } from "@mui/material";
import { CARD1_SECTION_LIST } from "../../home_config/Card1_Section";
import { Card } from "../Cards/Card";

function Card1Section() {
  const cards =
    CARD1_SECTION_LIST &&
    Object.keys(CARD1_SECTION_LIST).map((id: string) => {
      return (
        <Grid item xs={CARD1_SECTION_LIST[id].cardSize}>
          <Card card={CARD1_SECTION_LIST[id]} />
        </Grid>
      );
    });
  return (
    <Container
      sx={{ width: "100%", background: "rgb(46,51,67)", padding: "32px" }}
    >
      <Grid
        container
        rowSpacing={{ xs: 1.5, md: 2.5 }}
        columnSpacing={{ xs: 2, md: 2, lg: 2.5 }}
      >
        {cards}
      </Grid>
    </Container>
  );
}

export default Card1Section;
