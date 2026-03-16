import { useNavigate } from 'react-router-dom';

const useRedirectToTradePage = () => {
  const navigate = useNavigate();

  return (marketName: string, groupId?: string) => {
    const encodedMarket = encodeURIComponent(marketName);
    const groupParam = groupId ? `&group=${encodeURIComponent(groupId)}` : '';
    navigate(`/trade?market=${encodedMarket}${groupParam}`, { replace: true });
    window.scrollTo(0, 0);
  };
};

export default useRedirectToTradePage;