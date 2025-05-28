const Loading = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-primary flex size-9 animate-spin items-center justify-center"></div>
      <span>{message ? message + "..." : "Loading..."}</span>
    </div>
  );
};

export default Loading;
