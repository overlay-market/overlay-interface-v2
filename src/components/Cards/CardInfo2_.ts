import { CardContent,  Typography, Box, styled} from '@mui/material'

interface CardProps {
  cardSize?: number;
}

export const CardTextContent = styled(CardContent, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  padding: '20px',
  paddingLeft: cardSize === 6 ? "100px" : '',
  position: 'relative',
  zIndex: 2,
  height: '100%',
  boxSizing: 'border-box'
}))

export const SubTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  color: 'rgba(240, 240, 240, 1)',
  fontSize: cardSize === 6 ? "16px" : '14px',
  fontWeight: 700,
  textAlign: 'right',
}))

export const Title = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  color: 'rgba(240, 240, 240, 1)',   
  fontSize: cardSize === 3 ? "28px" : cardSize === 4 ? '36px' : '44px',
  fontWeight: 500,
  lineHeight: '100%',
  letterSpacing: cardSize === 3 ? "-1.12px" : cardSize === 4 ? '-1.44px' : '-1.76px',
  textAlign: 'right',
  background:
    "linear-gradient(271.08deg, #ECFF75 6.76%, #FF3CEB 98.96%)",    
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

export const Description = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  color: 'rgba(240, 240, 240, 1)',   
  fontSize: cardSize === 3 ? "12px" : "14px",
  fontWeight: 400,
  lineHeight: '140%',
  textAlign: 'right',
}))

export const CardLink = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  border: cardSize === 6 ? '1px solid #FAA6FF' : '',
  borderRadius: cardSize === 6 ? '4px' : '',
  padding: cardSize === 6 ? '12px 16px' : '',
  position: cardSize === 6 ? 'absolute' : 'static',
  bottom: cardSize === 6 ? "20px" : ''
}))

export const CardLinkLabel = styled(Typography)({
  color: '#FAA6FF',   
  fontSize: "14px",
  fontWeight: 500,
  fontStyle: 'italic',
  lineHeight: '15.4px',
})

export const ImgContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cardSize"
})<CardProps>(({cardSize}) => ({
  position: 'absolute',
  left: cardSize === 6 ? '0' : '20px',
  bottom: '0',
  width: cardSize === 3 ? '58.4%' : cardSize === 4 ? '48.4%' : '35.2%',
  height: 'auto',
}))
