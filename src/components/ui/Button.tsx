import { ButtonProps } from "@/types";

const Button = ({ id, name, onClick, className, children }: ButtonProps) => {
  return (
    <div>
      <button
        id={id}
        name={name}
        onClick={onClick}
        className={`btn md:btn-lg btn-outline w-full rounded-2xl bg-white ${className && className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
