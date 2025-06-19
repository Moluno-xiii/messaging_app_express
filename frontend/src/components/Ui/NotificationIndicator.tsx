interface Props {
  number?: number;
}

const NotificationIndicator: React.FC<Props> = ({ number }) => {
  return (
    <div className="bg-primary absolute -top-4 -right-2 flex size-6 flex-col items-center justify-center rounded-full">
      {number ?? null}
    </div>
  );
};

export default NotificationIndicator;
