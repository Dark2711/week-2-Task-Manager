interface HeadingProps {
  label: string;
}
const Heading = ({ label }: HeadingProps) => {
  return <div className="text-3xl  font-bold mb-10">{label}</div>;
};

export default Heading;
