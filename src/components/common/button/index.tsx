import type React from "react";
import type { FC } from "react";
import type { ButtonProps } from "../../../types";

//new type for native elements and omit to handle custom
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof ButtonProps
>;

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
  const baseStyles = "bg-blue-600! hover:bg-gray-600! text-white h-10 w-24";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
export default Button;
