interface PercentWithSignProps {
  value: number | string | undefined;
}

const PercentWithSign: React.FC<PercentWithSignProps> = ({ value }) => {
  const number = Number(value);
  return (
    <span>{number > 0 ? `+${number.toFixed(2)}` : number.toFixed(2)}%</span>
  );
};

export default PercentWithSign;
