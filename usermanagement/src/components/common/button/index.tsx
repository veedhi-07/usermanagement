import React from "react";
import type { FC } from "react";
import type { ButtonProps } from "../../../types";

//take all buttons props and remove the defined
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
export default React.memo(Button, (prev, next) => {
  return (
    prev.children === next.children &&
    prev.className === next.className &&
    prev.disabled === next.disabled &&
    prev.error === next.error &&
    prev.success === next.success &&
    prev.onClick === next.onClick
  );
});
