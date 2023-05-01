import last from 'lodash/last';
import cx from 'classnames';
import ModalComponent, {ModalComponentProps} from './ModalComponent';
import styles from './styles.module.scss';
import {closeModal, openModal, selectModals} from "@/state/modal";
import {useAppDispatch, useAppSelector} from "@/state/hooks";

const ModalManager = () => {
  const modals: ModalComponentProps[] = useAppSelector(selectModals).modals;
  const dispatch = useAppDispatch();

  if (!modals.length) return null;

  const onBackdropClick = () => {
    const id = last(modals)?.id || '';
    dispatch(closeModal({ id }));
  };

  return (
    <div className={cx(styles.wrapper, modals.length > 0 && styles.show)}>
      <div className={styles.backdrop} onClick={onBackdropClick} />
      {modals.map(modal => (
        <ModalComponent
          key={modal.id}
          actions={{ openModal, closeModal }}
          id={modal.id}
          title={modal.title}
          render={modal.render}
          className={modal.className}
          modalProps={modal.modalProps}
          onClose={modal.onClose}
          theme={modal.theme}
        />
      ))}
    </div>
  )
}

export default ModalManager;
