type Props = {
  title?: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, children }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {title && (
        <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>
      )}
      <div className="w-full h-87.5">{children}</div>
    </div>
  );
};

export default ChartCard;
