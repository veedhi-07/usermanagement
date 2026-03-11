import { Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: any;
  error?: string;
  touched?: boolean;
}

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

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
          onBlur={onBlur}
          className={`
        [&>div>input]:bg-white!
        [&>div>input]:text-black!
        [&>div>input]:focus:bg-white!
        ${
          touched && error
            ? "[&>div>input]:border-red-500!"
            : "[&>div>input]:border-gray-300!"
        }
      `}
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

export default FormField;
