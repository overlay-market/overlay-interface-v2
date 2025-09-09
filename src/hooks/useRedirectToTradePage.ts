import { useNavigate } from 'react-router-dom';

const useRedirectToTradePage = () => {
  const navigate = useNavigate();

  return (marketName: string) => {
    const encodedMarket = encodeURIComponent(marketName);
    navigate(`/trade?market=${encodedMarket}`, { replace: true });
    window.scrollTo(0, 0);
  };
};

export default useRedirectToTradePage;