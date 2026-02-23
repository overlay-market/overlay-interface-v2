import { useZodiacContext } from '../providers/ZodiacProvider';

export const useAvatarTrading = () => {
    const context = useZodiacContext();
    return {
        isAvatarTradingActive: context.isAvatarTradingActive,
        activeAvatar: context.activeAvatar,
        setStatus: context.setStatus,
        setActiveAvatar: context.setActiveAvatar,
    };
};
