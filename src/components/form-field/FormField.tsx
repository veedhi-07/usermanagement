import { Label, TextInput } from "flowbite-react";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: any;
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
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="!text-black">
        {label}
      </Label>

      <TextInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
         className="!bg-white !text-black focus:!bg-white focus:!text-black"

          ${
            touched && error
              ? "[&_input]:!border-red-500"
              : "[&_input]:!border-gray-300"
          }
        `}
      />

      {touched && error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormField;
