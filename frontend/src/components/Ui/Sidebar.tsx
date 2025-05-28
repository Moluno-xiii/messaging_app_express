import { CiMail, CiUser } from "react-icons/ci";
import { GiConvergenceTarget } from "react-icons/gi";
import { GoGear } from "react-icons/go";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import type { LinkType } from "../../types";
// import authenticatedFetch from "../../utils/authenticatedFetch";

const navLinks: LinkType[] = [
  {
    route: "/messages",
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
  return (
    <aside className="bg-secondary text-primary flex min-h-full flex-col items-center justify-between rounded-xl px-5 py-6">
      <div>
        <GiConvergenceTarget
          size={30}
          className="text-primary cursor-pointer transition-all duration-200 hover:rotate-180"
        />
      </div>
      <ul className="flex flex-col items-center gap-y-6 text-white md:gap-y-14">
        {navLinks.map((link: LinkType) => (
          <li
            key={link.route}
            className="hover:text-primary size-6 cursor-pointer duration-200"
          >
            {link.component}
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-y-4 text-white">
        <CiUser
          size={24}
          className="hover:text-primary cursor-pointer duration-200"
        />
        <IoLogOutOutline
          size={24}
          className="hover:text-primary cursor-pointer duration-200"
        />
        {/* <button
          className="btn-fill"
          onClick={() =>
            (async function () {
              try {
                console.log("i ran for protected routes");
                const query = await authenticatedFetch(
                  "http://localhost:7002/me",
                  {
                    method: "GET",
                  },
                );
                const data = await query.json();
                console.log("data  : ", data);
              } catch (error) {
                console.error(error);
              }
            })()
          }
        >
          View protected route
        </button>
        <button
          className="btn-fill"
          onClick={() =>
            (async function () {
              try {
                const query = await fetch(
                  "http://localhost:7002/auth/refresh",
                  {
                    method: "post",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    mode: "cors",
                  },
                );
                const data = await query.json();
                console.log("data  : ", data);
              } catch (error) {
                console.error(error);
              }
            })()
          }
        >
          refresh tokens
        </button> */}
      </div>
    </aside>
  );
};

export default Sidebar;
