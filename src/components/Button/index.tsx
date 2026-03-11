import type React from "react";
import  type {FC } from "react";
import type { ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  success?: boolean;
  children: ReactNode;
}

//new type for native elements and omit to handle custom
type NativeButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
keyof ButtonProps>;

type ButtonComponentProps = ButtonProps & NativeButtonProps;

const Button: FC<ButtonComponentProps> = ({
  type = "button",
  onClick,
  className = "",
  error = false,
  disabled = false,
  success = false,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-blue-600! hover:bg-gray-600! text-white h-10 w-24"
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
export default Button;
