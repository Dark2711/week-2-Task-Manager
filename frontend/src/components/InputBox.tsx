interface InputBoxProps {
  label: string;
  placeholder: string;
  value: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputBox = ({ label, placeholder, value, type, onChange }: InputBoxProps) => {
  return (
    <div className="w-full flex flex-col pb-5 ">
      <h2 className="font-semibold pb-1">{label}</h2>
      <input
        type={type}
        className="border border-slate-200 rounded-md w-full shadow-sm focus:outline-none focus:border-slate-500 focus:shadow-md py-2 px-5"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputBox;
