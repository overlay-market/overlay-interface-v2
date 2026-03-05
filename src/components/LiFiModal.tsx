
import React from 'react';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import Modal from './Modal';
import theme from '../theme';

interface LiFiModalProps {
    open: boolean;
    handleClose: () => void;
}

const widgetConfig: WidgetConfig = {
    integrator: 'overlay-market',
    variant: 'compact',
    subvariant: 'default',
    appearance: 'dark',
    toChain: 56, // BSC
    toToken: '0x55d398326f99059ff775485246999027b3197955', // USDT on BSC
    theme: {
        palette: {
            primary: { main: theme.color.blue3 },
            secondary: { main: theme.color.grey4 },
        },
        container: {
            border: `1px solid ${theme.color.grey4}`,
            borderRadius: '16px',
        },
    },
    buildUrl: false,
};

const LiFiModal: React.FC<LiFiModalProps> = ({ open, handleClose }) => {
    return (
        <Modal
            triggerElement={null}
            open={open}
            handleClose={handleClose}
            title="Bridge & Swap to USDT"
            width="460px"
            maxWidth="95vw"
        >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <LiFiWidget integrator="overlay-market" config={widgetConfig} />
            </div>
        </Modal>
    );
};

export default LiFiModal;
