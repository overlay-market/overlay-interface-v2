import { useNavigate } from 'react-router-dom';

const useRedirectToTradePage = () => {
  const navigate = useNavigate();

  return (marketId: string) => {
    navigate(`/trade/${marketId}`);
  };
};

export default useRedirectToTradePage;