import { NavLink as RouterNavLink } from "react-router-dom";
import type { ReactNode } from "react";
import styles from "./BottomNav.module.css";

interface BottomNavProps {
  children: ReactNode;
  className?: string;
}

export function BottomNav({ children, className }: BottomNavProps) {
  return (
    <nav className={`${styles.bottomNav} ${className || ""}`}>{children}</nav>
  );
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  badge?: number;
}

export function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ""}`
      }
    >
      <div className={styles.navIconWrapper}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <div className={styles.navBadge}>{badge}</div>
        )}
      </div>
      {label}
    </RouterNavLink>
  );
}
