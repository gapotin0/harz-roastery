import { useEffect, useRef, useState } from "react";

import { css, cx } from "@emotion/css";

import AdminProducts from "./Admin_Page_Products";
import AdminOrders from "./Admin_Page_Orders";
import AdminCourses from "./Admin_Page_Courses";
import AdminCustomRoasting from "./Admin_Page_CustomRoasting";
import AdminCourseEnrollments from "./Admin_Page_CourseEnrollments";

import menu_icon from "../assets/header/menu.svg";

import type { Course } from "../data/courses";
import type { CourseEnrollment } from "../data/courseEnrollments";
import type { CustomRoastingRequest } from "../data/customRoasting";
import type { Order } from "../data/orders";
import type { CartProduct } from "../data/products";
import { applyTheme, readTheme } from "../preferences";

import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;

  setLanguage: React.Dispatch<React.SetStateAction<AdminLanguage>>;

  onLogout: () => void;

  products: CartProduct[];

  setProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;

  orders: Order[];

  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;

  ordersLoading: boolean;

  courses: Course[];

  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;

  customRoastingRequests: CustomRoastingRequest[];

  setCustomRoastingRequests: React.Dispatch<
    React.SetStateAction<CustomRoastingRequest[]>
  >;

  customRoastingRequestsLoading: boolean;

  courseEnrollments: CourseEnrollment[];

  setCourseEnrollments: React.Dispatch<
    React.SetStateAction<CourseEnrollment[]>
  >;

  courseEnrollmentsLoading: boolean;
};

type AdminPage =
  | "dashboard"
  | "products"
  | "orders"
  | "courses"
  | "course-enrollments"
  | "custom-roasting";

type AdminTheme = "dark" | "light";

// ----------------------------------------------------------------------
// THEME
// ----------------------------------------------------------------------

const light_theme = css`
  --bg-page: #f6f2ee;
  --bg-card: #ffffff;
  --chip-bg: #f1ebe7;

  --text-main: #251c19;
  --text-muted: #756a65;

  --sand-line: #ded4ce;
`;

// ----------------------------------------------------------------------
// LAYOUT
// ----------------------------------------------------------------------

const admin_layout = css({
  minWidth: "100%",
  minHeight: "100vh",

  display: "grid",
  gridTemplateColumns: "240px minmax(0, 1fr)",

  margin: 0,

  backgroundColor: "var(--bg-page)",
  color: "var(--text-main)",

  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

// ----------------------------------------------------------------------
// SIDEBAR
// ----------------------------------------------------------------------

const sidebar = css({
  position: "sticky",
  top: 0,

  alignSelf: "start",

  display: "flex",
  flexDirection: "column",

  width: "100%",
  height: "100vh",
  minHeight: "100vh",

  boxSizing: "border-box",

  padding: "28px 20px",

  backgroundColor: "var(--bg-card)",

  borderRight: "1px solid var(--sand-line)",

  overflow: "visible",

  "@media (max-width: 768px)": {
    zIndex: 1500,

    height: "auto",
    minHeight: "auto",

    padding: "14px 16px",

    borderRight: "none",
    borderBottom: "1px solid var(--sand-line)",
  },
});

const sidebar_top = css({
  position: "relative",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "14px",

  marginBottom: "28px",

  "@media (max-width: 768px)": {
    marginBottom: 0,
  },
});

const sidebar_logo = css({
  fontSize: "20px",
  fontWeight: "800",

  whiteSpace: "nowrap",
});

// ----------------------------------------------------------------------
// SETTINGS MENU
// ----------------------------------------------------------------------

const menu_wrapper = css({
  position: "relative",

  flexShrink: 0,
});

const menu_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "38px",
  height: "38px",

  padding: 0,

  backgroundColor: "transparent",

  border: "1px solid var(--sand-line)",
  borderRadius: "11px",

  cursor: "pointer",

  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--text-muted)",
  },

  "& img": {
    display: "block",

    width: "18px",
    height: "18px",
  },
});

const light_menu_icon = css({
  filter: "invert(1)",
});

const settings_menu = css({
  position: "absolute",

  top: "calc(100% + 10px)",
  right: 0,

  zIndex: 2000,

  width: "220px",
  boxSizing: "border-box",

  padding: "8px",

  backgroundColor: "var(--bg-card)",

  border: "1px solid var(--sand-line)",
  borderRadius: "16px",

  boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",

  "@media (max-width: 768px)": {
    width: "min(320px, calc(100vw - 32px))",
  },
});

const settings_item = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",

  padding: "11px 12px",

  backgroundColor: "transparent",

  border: "none",
  borderRadius: "10px",

  color: "var(--text-main)",

  font: "inherit",
  fontSize: "13px",
  fontWeight: "600",

  cursor: "pointer",

  transition: "background-color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const settings_value = css({
  marginLeft: "24px",

  color: "var(--text-muted)",

  fontSize: "12px",
  fontWeight: "700",
});

const menu_divider = css({
  height: "1px",

  margin: "6px 4px",

  backgroundColor: "var(--sand-line)",

  "@media (min-width: 769px)": {
    display: "none",
  },
});

// ----------------------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------------------

const sidebar_nav = css({
  display: "flex",
  flexDirection: "column",

  gap: "8px",

  "& button": {
    width: "100%",

    padding: "12px 14px",

    backgroundColor: "transparent",

    border: "none",
    borderRadius: "12px",

    color: "var(--text-muted)",

    font: "inherit",
    fontSize: "14px",
    fontWeight: "600",

    textAlign: "left",

    cursor: "pointer",

    transition: "background-color 0.15s ease, color 0.15s ease",

    "&:hover": {
      backgroundColor: "var(--chip-bg)",
      color: "var(--text-main)",
    },
  },

  "@media (max-width: 768px)": {
    display: "none",
  },
});

const mobile_nav = css({
  display: "none",

  "@media (max-width: 768px)": {
    display: "flex",
    flexDirection: "column",

    gap: "4px",

    "& button": {
      width: "100%",

      padding: "11px 12px",

      backgroundColor: "transparent",

      border: "none",
      borderRadius: "10px",

      color: "var(--text-muted)",

      font: "inherit",
      fontSize: "13px",
      fontWeight: "600",

      textAlign: "left",

      cursor: "pointer",

      "&:hover": {
        backgroundColor: "var(--chip-bg)",
        color: "var(--text-main)",
      },
    },
  },
});

const active_button = css({
  backgroundColor: "var(--chip-bg) !important",
  color: "var(--text-main) !important",
});

// ----------------------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------------------

const logout_button = css({
  width: "100%",

  marginTop: "auto",

  padding: "12px 14px",

  backgroundColor: "transparent",

  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",

  font: "inherit",
  fontWeight: "600",

  cursor: "pointer",

  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--clay)",
  },

  "@media (max-width: 768px)": {
    display: "none",
  },
});

const mobile_logout_button = css({
  display: "none",

  "@media (max-width: 768px)": {
    display: "block",

    width: "100%",

    marginTop: "6px",
    padding: "11px 12px",

    backgroundColor: "transparent",

    border: "1px solid var(--sand-line)",
    borderRadius: "10px",

    color: "var(--text-main)",

    font: "inherit",
    fontSize: "13px",
    fontWeight: "600",

    textAlign: "left",

    cursor: "pointer",

    "&:hover": {
      backgroundColor: "var(--chip-bg)",
      borderColor: "var(--clay)",
    },
  },
});

// ----------------------------------------------------------------------
// CONTENT
// ----------------------------------------------------------------------

const admin_content = css({
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  boxSizing: "border-box",

  padding: "40px",

  overflowX: "hidden",

  "@media (max-width: 768px)": {
    padding: "28px 24px",
  },

  "@media (max-width: 480px)": {
    padding: "22px 16px",
  },
});

const content_header = css({
  marginBottom: "32px",

  "& h1": {
    margin: 0,

    fontSize: "32px",
    fontWeight: "800",
  },

  "& p": {
    margin: "8px 0 0",

    color: "var(--text-muted)",

    fontSize: "14px",
    lineHeight: "150%",
  },

  "@media (max-width: 480px)": {
    marginBottom: "24px",

    "& h1": {
      fontSize: "28px",
    },
  },
});

// ----------------------------------------------------------------------
// DASHBOARD CARDS
// ----------------------------------------------------------------------

const dashboard_cards = css({
  display: "grid",

  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",

  gap: "20px",

  "@media (max-width: 1280px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },

  "@media (max-width: 900px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const dashboard_card = css({
  boxSizing: "border-box",

  padding: "24px",

  backgroundColor: "var(--bg-card)",

  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  "& p": {
    margin: 0,

    color: "var(--text-muted)",

    fontSize: "13px",
    fontWeight: "600",
  },

  "& h2": {
    margin: "12px 0 0",

    fontSize: "30px",
    fontWeight: "800",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminDashboard({
  language,
  setLanguage,

  onLogout,

  products,
  setProducts,

  orders,
  setOrders,
  ordersLoading,

  courses,
  setCourses,

  customRoastingRequests,
  setCustomRoastingRequests,
  customRoastingRequestsLoading,

  courseEnrollments,
  setCourseEnrollments,
  courseEnrollmentsLoading,
}: Props) {
  const [page, setPage] = useState<AdminPage>("dashboard");

  const [theme, setTheme] = useState<AdminTheme>(readTheme);

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const t = adminTranslations[language];

  // ----------------------------------------------------------------------
  // PAGE BACKGROUND
  // ----------------------------------------------------------------------

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    const previousHtmlBackground = html.style.backgroundColor;

    const previousBodyBackground = body.style.backgroundColor;

    const previousRootBackground = root?.style.backgroundColor ?? "";

    const background = theme === "light" ? "#f6f2ee" : "#120d0b";

    html.style.backgroundColor = background;
    body.style.backgroundColor = background;

    if (root) {
      root.style.backgroundColor = background;
    }

    return () => {
      html.style.backgroundColor = previousHtmlBackground;

      body.style.backgroundColor = previousBodyBackground;

      if (root) {
        root.style.backgroundColor = previousRootBackground;
      }
    };
  }, [theme]);

  // ----------------------------------------------------------------------
  // CLOSE MENU ON OUTSIDE CLICK / ESCAPE
  // ----------------------------------------------------------------------

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ----------------------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------------------

  const changePage = (nextPage: AdminPage) => {
    setPage(nextPage);
    setMenuOpen(false);
  };

  const navItems: {
    id: AdminPage;
    label: string;
  }[] = [
    {
      id: "dashboard",
      label: t.sidebar.dashboard,
    },
    {
      id: "products",
      label: t.sidebar.products,
    },
    {
      id: "orders",
      label: t.sidebar.orders,
    },
    {
      id: "courses",
      label: t.sidebar.courses,
    },
    {
      id: "course-enrollments",
      label: t.sidebar.courseEnrollments,
    },
    {
      id: "custom-roasting",
      label: t.sidebar.customRoasting,
    },
  ];

  const pageHeader = {
    dashboard: t.dashboard,
    products: t.products,
    orders: t.orders,
    courses: t.courses,
    "course-enrollments": t.enrollments,
    "custom-roasting": t.roasting,
  }[page];

  const dashboardItems = [
    {
      label: t.dashboard.products,
      value: products.length,
    },
    {
      label: t.dashboard.orders,
      value: orders.length,
    },
    {
      label: t.dashboard.courses,
      value: courses.length,
    },
    {
      label: t.dashboard.courseEnrollments,
      value: courseEnrollments.length,
    },
    {
      label: t.dashboard.roastingRequests,
      value: customRoastingRequests.length,
    },
  ];

  // ----------------------------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------------------------

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "uk" ? "en" : "uk"));
  };

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------

  return (
    <div
      className={cx(
        admin_layout,
        "font-onest",
        theme === "light" && light_theme,
      )}
    >
      <aside className={sidebar}>
        {/* TOP */}

        <div className={sidebar_top}>
          <div className={sidebar_logo}>HARZ ADMIN</div>

          <div ref={menuRef} className={menu_wrapper}>
            <button
              type="button"
              className={menu_button}
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={language === "uk" ? "Відкрити меню" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <img
                src={menu_icon}
                alt=""
                className={theme === "light" ? light_menu_icon : undefined}
              />
            </button>

            {menuOpen && (
              <div className={settings_menu}>
                {/* THEME */}

                <button
                  type="button"
                  className={settings_item}
                  onClick={toggleTheme}
                >
                  <span>{language === "uk" ? "Тема" : "Theme"}</span>

                  <span className={settings_value}>
                    {theme === "dark"
                      ? language === "uk"
                        ? "Темна"
                        : "Dark"
                      : language === "uk"
                        ? "Світла"
                        : "Light"}
                  </span>
                </button>

                {/* LANGUAGE */}

                <button
                  type="button"
                  className={settings_item}
                  onClick={toggleLanguage}
                >
                  <span>{language === "uk" ? "Мова" : "Language"}</span>

                  <span className={settings_value}>
                    {language === "uk" ? "UK" : "EN"}
                  </span>
                </button>

                {/* MOBILE NAVIGATION */}

                <div className={menu_divider} />

                <nav className={mobile_nav}>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={page === item.id ? active_button : undefined}
                      onClick={() => changePage(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={mobile_logout_button}
                    onClick={onLogout}
                  >
                    {t.sidebar.logout}
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}

        <nav className={sidebar_nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={page === item.id ? active_button : undefined}
              onClick={() => changePage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* DESKTOP LOGOUT */}

        <button type="button" className={logout_button} onClick={onLogout}>
          {t.sidebar.logout}
        </button>
      </aside>

      {/* -------------------------------------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------------------------------------- */}

      <main className={admin_content}>
        <div className={content_header}>
          <h1>{pageHeader.title}</h1>

          <p>{pageHeader.description}</p>
        </div>

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <div className={dashboard_cards}>
            {dashboardItems.map((item) => (
              <div key={item.label} className={dashboard_card}>
                <p>{item.label}</p>

                <h2>{item.value}</h2>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}

        {page === "products" && (
          <AdminProducts
            language={language}
            products={products}
            setProducts={setProducts}
          />
        )}

        {/* ORDERS */}

        {page === "orders" && (
          <AdminOrders
            language={language}
            orders={orders}
            setOrders={setOrders}
            isLoading={ordersLoading}
          />
        )}

        {/* COURSES */}

        {page === "courses" && (
          <AdminCourses
            language={language}
            courses={courses}
            setCourses={setCourses}
          />
        )}

        {/* COURSE ENROLLMENTS */}

        {page === "course-enrollments" && (
          <AdminCourseEnrollments
            language={language}
            enrollments={courseEnrollments}
            setEnrollments={setCourseEnrollments}
            isLoading={courseEnrollmentsLoading}
          />
        )}

        {/* CUSTOM ROASTING */}

        {page === "custom-roasting" && (
          <AdminCustomRoasting
            language={language}
            requests={customRoastingRequests}
            setRequests={setCustomRoastingRequests}
            isLoading={customRoastingRequestsLoading}
          />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
