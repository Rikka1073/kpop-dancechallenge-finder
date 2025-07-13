import { ButtonProps } from "@/types";
import { X } from "lucide-react";

const Button = ({ id, name, text, onClick, className }: ButtonProps) => {
  return (
    <div>
      <button id={id} name={name} onClick={onClick} className={`btn w-full md:btn-lg rounded-2xl btn-outline bg-white ${className && className}`}>
        {name === "clear" ? (
          <>
            <X /> {text}
          </>
        ) : (
          "#" + text
        )}
      </button>
    </div>
  );
};

export default Button;
