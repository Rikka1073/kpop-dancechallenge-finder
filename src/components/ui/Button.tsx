import { ButtonProps } from "@/types";

const Button = ({ id, name, text }: ButtonProps) => {
  return (
    <div>
      <button id={id} name={name} className="btn btn-neutral btn-outline rounded-2xl">
        {text}
      </button>
    </div>
  );
};

export default Button;
