interface EmptyProps {
  message?: string,
}


export const Empty:React.FC<EmptyProps> = ({message}) => {
  return (
    <div className="absolute left-0 right-0 flex items-center flex-col">
      <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
      <p>{message}</p>
    </div>
  );
};

