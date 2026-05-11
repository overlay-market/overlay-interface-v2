import { useNavigate } from 'react-router-dom';

const decodeQueryValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const useRedirectToTradePage = () => {
  const navigate = useNavigate();

  return (marketName: string, groupId?: string) => {
    const encodedMarket = encodeURIComponent(decodeQueryValue(marketName));
    const groupParam = groupId
      ? `&group=${encodeURIComponent(decodeQueryValue(groupId))}`
      : '';
    navigate(`/trade?market=${encodedMarket}${groupParam}`, { replace: true });
    window.scrollTo(0, 0);
  };
};

export default useRedirectToTradePage;
