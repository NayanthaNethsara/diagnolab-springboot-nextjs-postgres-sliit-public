import React from "react";
import Link from "next/link";
import classNames from "classnames";

interface NavItemProps {
  active?: boolean;
  href?: string;
  icon: React.ElementType;
  title: string;
}

const NavItem: React.FC<NavItemProps> = ({
  active = false,
  href = "#",
  icon: Icon,
  title,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        "h-14 px-4 w-11/12 py-6 rounded-lg justify-start items-center gap-3 inline-flex transition-all duration-200 ease-in-out",
        {
          "bg-white shadow-sm shadow-slate-200 hover:shadow-neutral-200":
            active, // Glow effect for active route
          "dark:bg-slate-900 dark:shadow-sm dark:shadow-cyan-900 hover:dark:shadow-cyan-700":
            active,
          "hover:bg-neutral-100": !active, // Hover for inactive routes
          "hover:dark:bg-slate-800": !active,
        }
      )}
    >
      <div className="flex items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 ease-in-out hover:text-neutral-800 dark:hover:text-white shadow hover:shadow-lg">
        <Icon className="h-[17px] w-[17px]" />
      </div>
      <div
        className={classNames(
          "text-sm transition-colors duration-200 ease-in-out",
          {
            "text-neutral-800 font-semibold": active,
            "dark:text-neutral-300": active, // Hover effect for text in dark mode
            "text-neutral-600 font-normal hover:text-neutral-700": !active, // Hover effect for text on inactive routes
            "dark:text-neutral-300 hover:dark:text-neutral-400": !active, // Hover effect for text in dark mode
          }
        )}
      >
        {title}
      </div>
    </Link>
  );
};

export default NavItem;
