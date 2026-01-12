import React, { useEffect, useState } from "react";
import useAccount from "../../hooks/useAccount";
import { useZodiacRoles, useAvatarTrading, RolesModifier } from "../../hooks/useZodiacRoles";
import AvatarPromptModal from "./AvatarPromptModal";

const ZodiacManager: React.FC = () => {
    const { signerAddress, chainId } = useAccount();
    const { data: rolesData } = useZodiacRoles(signerAddress);
    const { isAvatarTradingActive, setStatus, setActiveAvatar } = useAvatarTrading();
    const [showPrompt, setShowPrompt] = useState(false);
    const [detectedAvatar, setDetectedAvatar] = useState<RolesModifier | null>(null);

    useEffect(() => {
        if (!rolesData || !chainId) return;

        const chainMemberships = rolesData.memberOf.filter(
            (m) => Number(m.chainId) === Number(chainId)
        );

        if (chainMemberships.length > 0) {
            const firstMembership = chainMemberships[0].rolesModifier;
            const storageKey = `wallet-avatar-status:${signerAddress?.toLowerCase()}:${chainId}`;

            // If we don't have a status saved for this wallet/chain, prompt
            if (!isAvatarTradingActive && signerAddress && !localStorage.getItem(storageKey)) {
                setDetectedAvatar(firstMembership);
                setShowPrompt(true);
            }
        } else if (isAvatarTradingActive) {
            // If they are no longer members according to the subgraph for this chain, deactivate
            setStatus('inactive');
            setActiveAvatar(null);
        }
    }, [rolesData, signerAddress, chainId, isAvatarTradingActive, setStatus, setActiveAvatar]);

    const handleConfirm = (avatar: RolesModifier) => {
        setStatus('active');
        setActiveAvatar(avatar);
        setShowPrompt(false);
    };

    const handleClose = () => {
        setStatus('inactive');
        setShowPrompt(false);
    };

    if (!showPrompt || !detectedAvatar) return null;

    return (
        <AvatarPromptModal
            isOpen={showPrompt}
            avatar={detectedAvatar}
            onClose={handleClose}
            onConfirm={handleConfirm}
        />
    );
};

export default ZodiacManager;
