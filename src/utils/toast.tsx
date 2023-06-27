import ToastError from '@/components/ToastError';
import toast from 'react-hot-toast';

export const showError = ({
  url,
  linkText,
  message,
}: {
  url?: string;
  linkText?: string;
  message: string;
}) => {
  toast.error(
    (t) => <ToastError id={t.id} message={message} url={url} linkText={linkText} />,
    {
      duration: 50000,
      position: 'top-right',
      style: {
        maxWidth: '900px',
        borderLeft: '4px solid #FF4747',
      },
    },
  );
};

export const showSuccess = ({
  url,
  linkText,
  message,
}: {
  url?: string;
  linkText?: string;
  message: string;
}) => {
  toast.success(
    (t) => <ToastError id={t.id} message={message} url={url} linkText={linkText} />,
    {
      duration: 50000,
      position: 'top-right',
      style: {
        maxWidth: '900px',
        borderLeft: '4px solid #62d344',
      },
    },
  );
};
