interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-y-3">
      <p className="text-xl text-red-600">An error occured : {message}</p>
      <span className="text-foreground">Reload the page and try again</span>
    </div>
  );
};

export default ErrorMessage;
