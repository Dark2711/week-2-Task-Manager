interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ label }: ButtonProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className=" bg-black  text-white px-10 py-2 rounded-lg font-semibold">
        <button>{label}</button>
      </div>
    </div>
  );
};

export default Button;
