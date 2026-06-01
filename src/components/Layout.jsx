import { BookOpen, GraduationCap, Home, KeyRound, LogOut, Menu, Shield, Table2, UserRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../features/data/uiSlice";
import { signOut } from "../features/auth/authSlice";
import { RoleBadge } from "./RoleBadge";
import { resources } from "../lib/schema";

function navForRole(role) {
  const base = [
    { to: "/dashboard", label: "Панель", icon: Home },
    { to: "/catalog", label: "Каталог", icon: BookOpen },
  ];
  if (role === "admin") {
    return [
      ...base,
      { to: "/success_rate", label: resources.success_rate.navTitle, icon: Table2 },
      { to: "/students", label: resources.students.navTitle, icon: GraduationCap },
      { to: "/teachers", label: resources.teachers.navTitle, icon: UserRound },
      { to: "/subjects", label: resources.subjects.navTitle, icon: BookOpen },
      { to: "/access", label: "Доступи", icon: KeyRound },
      { to: "/admin/users", label: "Користувачі", icon: Shield },
      { to: "/groups", label: "Групи", icon: Table2 },
      { to: "/departments", label: "Факультети", icon: Table2 },
    ];
  }
  if (role === "teacher") {
    return [
      ...base,
      { to: "/grades", label: "Оцінки", icon: Table2 },
      { to: "/subjects", label: "Предмети", icon: BookOpen },
    ];
  }
  if (role === "student") {
    return [
      ...base,
      { to: "/my-grades", label: "Мої оцінки", icon: GraduationCap },
    ];
  }
  return base;
}

export function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const navItems = navForRole(user?.role);

  async function handleSignOut() {
    await dispatch(signOut()).unwrap();
    navigate("/login");
  }

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <img src="/images/campus-mark.svg" alt="" />
          <div>
            <strong>DDPU Cloud</strong>
            <span>Журнал успішності</span>
          </div>
        </div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => dispatch(closeSidebar())}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button type="button" className="icon-button menu-button" onClick={() => dispatch(toggleSidebar())} title="Меню">
            <Menu size={20} />
          </button>
          <div className="topbar-user">
            <span>{user?.full_name || "Гість"}</span>
            <RoleBadge role={user?.role} />
          </div>
          {user ? (
            <button type="button" className="button secondary" onClick={handleSignOut}>
              <LogOut size={16} />
              Вийти
            </button>
          ) : (
            <NavLink to="/login" className="button primary">Увійти</NavLink>
          )}
        </header>
        <Outlet />
      </main>
    </div>
  );
}
