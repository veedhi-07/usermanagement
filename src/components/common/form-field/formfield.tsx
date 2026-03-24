import { Checkbox, Label, TextInput } from "flowbite-react";
import { useState, memo } from "react";
import type { FC } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormProps } from "../../../types/index";
import type { InputHTMLAttributes } from "react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  keyof FormProps
>;

type FormComponentProps = FormProps & NativeInputProps;
const FormField: FC<FormComponentProps> = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  checked,
  className,
  ...rest
}) => {
  const baseStyle = `
        [&>div>input]:bg-white!
        [&>div>input]:text-black!
        [&>div>input]:focus:bg-white!
        ${
          touched && error
            ? "[&>div>input]:border-red-500!"
            : "[&>div>input]:border-gray-300!"
        }
      `;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  if (type === "checkbox") {
    return (
      <div className="flex gap-2 justify-center items-center">
        <Checkbox
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={className}
        />
        {label && <Label htmlFor={id}>{label}</Label>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-black!">
        {label}
      </Label>

      <div className="relative">
        <TextInput
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onBlur={onBlur}
          {...rest}
          className={`${baseStyle} ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default memo(FormField);
