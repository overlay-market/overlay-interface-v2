import { Button } from "@radix-ui/themes"
import { Play } from "react-feather"
import styled from "styled-components"
import theme from "../../theme"

export const Table = styled.table`
  width: 100%;
  min-width: 400px;
  border-collapse: collapse;
`

export const TableHeader = styled.th<{ width?: number }>`
  text-align: right;
  padding: 16px;
  width: ${({ width }) => (width ? `${width}%` : 'auto')};
  color: ${theme.color.grey3};
  font-weight: 500;
  font-size: 12px;
`

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.color.grey6};
`

export const TableCell = styled.td`
  padding: 16px;
  text-align: right;
  font-size: 12px;
`

interface RotatingTriangleProps {
  open: boolean
}

export const RotatingTriangle = styled(Play)<RotatingTriangleProps>`
  transform: ${props => (props.open ? 'rotate(270deg)' : 'rotate(90deg)')};
  transition: transform ease-out 0.25s;
`

export const TriangleButton = styled(Button)`
  padding: 0;
  padding-bottom: 2px;
  width: auto;
  min-width: 20px;
  margin-left: 4px;
  background: none;
`