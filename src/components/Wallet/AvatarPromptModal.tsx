import React from "react";
import { Flex, Text, Button } from "@radix-ui/themes";
import Modal from "../Modal";
import theme from "../../theme";
import { RolesModifier } from "../../hooks/useZodiacRoles";

interface AvatarPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (avatar: RolesModifier) => void;
    avatar: RolesModifier;
}

const AvatarPromptModal: React.FC<AvatarPromptModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    avatar,
}) => {
    return (
        <Modal
            open={isOpen}
            handleClose={onClose}
            title="Safe Multisig Detected"
            triggerElement={<></>}
            width="400px"
        >
            <Flex direction="column" gap="20px" p="40px" align="center">
                <Text align="center" style={{ color: theme.color.grey1 }}>
                    We detected that your wallet is a member of a Safe multisig via Zodiac Roles.
                </Text>
                <Flex direction="column" gap="4px" align="center">
                    <Text size="1" style={{ color: theme.color.grey3 }}>
                        Avatar (Safe):
                    </Text>
                    <Text size="2" weight="bold" style={{ color: theme.color.green2 }}>
                        {avatar.avatar}
                    </Text>
                </Flex>
                <Text align="center" style={{ color: theme.color.grey1 }}>
                    Would you like to trade on behalf of this Safe?
                </Text>
                <Flex gap="12px" width="100%">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        style={{ flex: 1, cursor: "pointer" }}
                    >
                        No, keep EOA
                    </Button>
                    <Button
                        onClick={() => onConfirm(avatar)}
                        style={{
                            flex: 1,
                            cursor: "pointer",
                            backgroundColor: theme.color.green2,
                            color: theme.color.background,
                        }}
                    >
                        Yes, trade as Safe
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    );
};

export default AvatarPromptModal;
