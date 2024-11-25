import { useModal } from "connectkit";

export const useModalHelper = () => {
    const { setOpen } = useModal();
  
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
  
    return { openModal, closeModal };
};
