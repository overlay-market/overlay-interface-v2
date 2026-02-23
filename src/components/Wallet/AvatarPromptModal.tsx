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
            title="Funded Trader Account Detected"
            triggerElement={<></>}
            width="400px"
        >
            <Flex direction="column" gap="20px" p="40px" align="center">
                <Text align="center" style={{ color: theme.color.grey1 }}>
                    Your wallet has been granted access to a Funded Trader account. You can trade using the funded account and keep 80% of the profits.
                </Text>
                <Flex direction="column" gap="4px" align="center">
                    <Text size="1" style={{ color: theme.color.grey3 }}>
                        Funded Account:
                    </Text>
                    <Text size="2" weight="bold" style={{ color: theme.color.green2, wordBreak: "break-all", textAlign: "center" }}>
                        {avatar.avatar}
                    </Text>
                </Flex>
                <Text align="center" style={{ color: theme.color.grey1 }}>
                    Would you like to switch to your funded account?
                </Text>
                <Flex gap="12px" width="100%">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        style={{ flex: 1, cursor: "pointer" }}
                    >
                        No, use my wallet
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
                        Start Trading
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    );
};

export default AvatarPromptModal;
