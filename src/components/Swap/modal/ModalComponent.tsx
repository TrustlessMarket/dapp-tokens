import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import cx from "classnames";

import styles from "./styles.module.scss";
import { ReactNode } from "react";
import {useAppDispatch} from "@/state/hooks";
import {closeModal} from "@/state/modal";

export interface ModalComponentProps {
  id: string;
  render: Function;
  title?: string | ReactNode;
  className?: string;
  actions?: object;
  modalProps?: ModalProps;
  onClose?: Function;
  theme?: "light" | "dark";
}

const ModalComponent = (props: ModalComponentProps) => {
  const { id, render, title, className, actions, modalProps, onClose, theme } =
    props;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal({ id }));
    if (onClose) onClose(props);
  };

  return (
    <Modal isOpen onClose={handleClose} isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent className={className}>
        <Flex
          className="modal-header-wrap"
          justifyContent={"space-between"}
          alignItems="center"
          mb={[6]}
        >
          <Box flex={1}>
            <ModalHeader>{title}</ModalHeader>
          </Box>
          <Box>
            <ModalCloseButton size={"sm"} className="modal-close-btn" />
          </Box>
        </Flex>

        <ModalBody className={cx(styles.modalBody)}>
          {render && render(actions)}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
