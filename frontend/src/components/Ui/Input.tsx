import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface Props {
  name: string;
  isDisabled: boolean;
  minLength?: number;
}

const PasswordInput: React.FC<Props> = ({
  name,
  isDisabled,
  minLength = 6,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        className="border-foreground focus:border-primary rounded-xl border p-2 transition-all duration-200 outline-none disabled:cursor-not-allowed max-sm:w-xs md:min-w-sm"
        type={showPassword ? "text" : "password"}
        name={name}
        minLength={minLength}
        disabled={isDisabled}
        required
      />
      {showPassword ? (
        <IoEyeOffOutline
          className="hover:text-primary absolute right-2 bottom-3 cursor-pointer transition-all duration-300"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <IoEyeOutline
          className="hover:text-primary absolute right-2 bottom-3 cursor-pointer transition-all duration-300"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
};

export { PasswordInput };
