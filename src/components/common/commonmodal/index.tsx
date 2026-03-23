import { X } from "lucide-react";
import type { FC } from "react";
import type { ModalProps } from "../../../types/index";

type commonProps = React.HTMLAttributes<HTMLDivElement> & ModalProps;

const CommonModall: FC<commonProps> = ({
  className,
  disabled,
  isOpen,
  onClose,
  title,
  children,
  footer,
  onSubmit,
  user,
  onSave,
  mode,
  ...rest
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        {...rest}
        className={`relative bg-white p-6 rounded-lg shadow-lg w-[420px] ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          rest.onClick?.(e);
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {title && <div className="text-xl font-bold mb-4">{title}</div>}

        <div>{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};
export default CommonModall;
