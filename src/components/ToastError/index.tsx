import React from "react";
import { ToastPending } from "./ToastError.styled";
import { CDN_URL } from "@/configs";
import toast from "react-hot-toast";
import IconSVG from "../IconSVG";

interface IProps {
  id: string;
  message: string;
  url?: string;
  linkText?: string;
}

const ToastError: React.FC<IProps> = ({
  id,
  url,
  message,
  linkText,
}: IProps): React.ReactElement => {
  return (
    <ToastPending>
      <div>
        {message}
        {url && (
          <>
            <br />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="wallet-link"
            >
              {linkText || 'Find out more here'}
              <IconSVG
                src={`${CDN_URL}/icons/arrow-right.svg`}
                maxHeight="16"
                maxWidth="16"
                color="#898989"
                type="stroke"
              />
            </a>
          </>
        )}
      </div>
      <div className="cursor-pointer" onClick={() => toast.dismiss(id)}>
        <IconSVG
          src={`${CDN_URL}/icons/ic-close-1.svg`}
          maxWidth="16"
          maxHeight="16"
          color="black"
          type="fill"
        />
      </div>
    </ToastPending>
  )
}

export default ToastError;