import ComponentCard from "../../../component-card";
import Label from "../../label";
import Input from "../../input/form-field/index";
import { EnvelopeIcon } from "../../../../assets/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

export default function InputGroup() {
  const [phone, setPhone] = useState<string>("");
  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            country="in"
            enableSearch
            value={phone}
            onChange={(phone) => setPhone(phone)}
          />
        </div>{" "}
      </div>
    </ComponentCard>
  );
}
