import { Link } from "@tanstack/react-router";

const NotFound: React.FC = () => {
  return (
    <div className="font-montserrat flex min-h-dvh w-full flex-col items-center justify-center gap-y-3 text-xl text-red-600 md:text-2xl">
      Page not found.
      <Link replace={true} to="/" className="btn-fill">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
