import { ButtonProps } from "@/types";

const Button = ({ id, name, onClick, className, children }: ButtonProps) => {
  return (
    <div>
      <button id={id} name={name} onClick={onClick} className={`btn w-full md:btn-lg rounded-2xl btn-outline bg-white ${className && className}`}>
        {/* {name === "clear" ? (
          <>
            <X /> {text}
          </>
        ) : (
          "#" + text
        )} */}
        {children}
      </button>
    </div>
  );
};

export default Button;
