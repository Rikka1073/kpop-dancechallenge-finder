import { ButtonProps } from "@/types";

const Button = ({ id, name, text, onClick, className }: ButtonProps) => {
  return (
    <div>
      <button id={id} name={name} onClick={onClick} className={className ? className : "btn btn-neutral btn-outline rounded-2xl"}>
        {"#" + text}
      </button>
    </div>
  );
};

export default Button;
