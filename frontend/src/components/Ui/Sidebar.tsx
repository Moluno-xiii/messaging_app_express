import { CiMail, CiUser } from "react-icons/ci";
import { GiConvergenceTarget } from "react-icons/gi";
import { GoGear } from "react-icons/go";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import type { LinkType } from "../../types";
import { useState } from "react";
import Modal from "./Modal";
import useAuth from "../../hooks/useAuth";
import { Link } from "@tanstack/react-router";
import useGetFriendRequests from "../../hooks/queryHooks/useGetFriendRequests";
import NotificationIndicator from "./NotificationIndicator";
import useGetNotifications from "../../hooks/queryHooks/useGetNotifications";

const navLinks: LinkType[] = [
  {
    route: "/chat",
    component: <CiMail className="h-full w-full" />,
  },
  {
    route: "/notifications",
    component: <IoIosNotificationsOutline className="h-full w-full" />,
  },
  {
    route: "/settings",
    component: <GoGear className="h-full w-full" />,
  },
];

const Sidebar: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout, isLoading, user } = useAuth();
  const { isPending, data } = useGetFriendRequests("received");
  const { isPending: loadingNotifications, data: notifications } =
    useGetNotifications("unread");
  if (isPending || loadingNotifications) return;
  const total = data.length + notifications.length;
  return (
    <aside className="bg-secondary text-primary flex min-h-full flex-col items-center justify-between rounded-xl px-5 py-6">
      <div>
        <Link to="/">
          <GiConvergenceTarget
            size={30}
            className="text-primary cursor-pointer transition-all duration-200 hover:rotate-180"
          />
        </Link>
      </div>
      <ul className="flex flex-col items-center gap-y-6 text-white md:gap-y-14">
        {navLinks.map((link: LinkType) => (
          <li key={link.route} className="relative size-6 duration-200">
            <Link
              to={link.route}
              className="[&.active]:text-primary hover:text-primary text-white"
            >
              {link.component}
            </Link>
            {link.route === "/notifications" && total > 0 ? (
              <NotificationIndicator number={total} />
            ) : null}
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-y-4 text-white">
        <Link
          className="hover:text-primary [&.active]:text-primary cursor-pointer duration-200"
          to="/profile"
        >
          {user?.profilePic ? (
            <img
              src={user?.profilePic}
              className="ring-primary size-6 rounded-full ring-1 ring-offset-1"
              alt="user profile picture"
              loading="lazy"
            />
          ) : (
            <CiUser size={24} />
          )}
        </Link>
        <IoLogOutOutline
          onClick={() => setIsLogoutModalOpen(true)}
          size={24}
          className="hover:text-primary cursor-pointer duration-200"
        />
      </div>
      {isLogoutModalOpen ? (
        <Modal
          title="Are you sure you want to Logout?"
          handleClose={() => setIsLogoutModalOpen(false)}
        >
          <div className="flex flex-row items-center gap-x-6">
            <button
              className="btn-fill"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              No
            </button>
            <button
              className="btn-error"
              onClick={() => logout(() => setIsLogoutModalOpen(false))}
            >
              {isLoading ? "Logging out..." : "Yes"}
            </button>
          </div>
        </Modal>
      ) : null}
    </aside>
  );
};

export default Sidebar;
