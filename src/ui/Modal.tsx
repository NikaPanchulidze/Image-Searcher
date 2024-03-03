import { ReactNode, ReactPortal } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { createPortal } from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

// Reusable modal template for any content
function Modal({ onClose, children }: ModalProps): ReactPortal {
  const ref = useOutsideClick(onClose);

  return createPortal(
    <div className="overlay">
      <div className="modal" ref={ref}>
        <button className="modalBtn" onClick={onClose}>
          <img className='icon-close' src="/public/closeIcon.svg" alt="close icon" />
        </button>
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
