import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { css, cx } from "@emotion/css";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import AdminDashboard from "./Admin_Page_Dashboard";

import { getCourseEnrollments } from "../services/courseEnrollmentApi";
import { getCustomRoastingRequests } from "../services/customRoastingApi";
import { auth } from "../services/firebase";
import { applyLanguage, readLanguage } from "../preferences";
import { getOrders } from "../services/orderApi";

import type { Course } from "../data/courses";
import type { CourseEnrollment } from "../data/courseEnrollments";
import type { CustomRoastingRequest } from "../data/customRoasting";
import type { Order } from "../data/orders";
import type { CartProduct } from "../data/products";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type AdminPanelProps = {
  products: CartProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  customRoastingRequests: CustomRoastingRequest[];
  setCustomRoastingRequests: React.Dispatch<
    React.SetStateAction<CustomRoastingRequest[]>
  >;
  courseEnrollments: CourseEnrollment[];
  setCourseEnrollments: React.Dispatch<
    React.SetStateAction<CourseEnrollment[]>
  >;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const admin_page = css({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minHeight: "100vh",
  boxSizing: "border-box",

  padding: "24px",

  backgroundColor: "var(--bg-page)",

  color: "var(--text-main)",
});

const language_switcher = css({
  position: "absolute",
  top: "24px",
  right: "24px",
  display: "flex",

  padding: "4px",
  gap: "4px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  "& button": {
    padding: "8px 12px",

    backgroundColor: "transparent",
    border: "none",
    borderRadius: "100px",

    color: "var(--text-muted)",
    font: "inherit",
    fontSize: "12px",
    fontWeight: "700",

    cursor: "pointer",
  },

  "@media (max-width: 480px)": {
    top: "14px",
    right: "14px",
  },
});

const active_language = css({
  backgroundColor: "var(--clay) !important",
  color: "#f3ede6 !important",
});

const login_card = css({
  width: "100%",
  maxWidth: "420px",
  boxSizing: "border-box",

  padding: "40px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  "& h1": {
    margin: 0,
    marginBottom: "8px",

    fontSize: "30px",
    fontWeight: "800",
  },

  "& p": {
    margin: 0,
    marginBottom: "28px",

    color: "var(--text-muted)",
    fontSize: "14px",
    lineHeight: "150%",
  },

  "@media (max-width: 480px)": {
    padding: "28px 20px",
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

const field = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",

  "& label": {
    fontSize: "13px",
    fontWeight: "600",
  },

  "& input": {
    width: "100%",
    boxSizing: "border-box",

    padding: "14px 16px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "12px",

    color: "var(--text-main)",
    font: "inherit",

    outline: "none",
    transition: "border-color 0.15s ease",

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },
});

const error_message = css({
  margin: "0 !important",
  color: "var(--clay) !important",
  fontSize: "13px !important",
});

const login_button = css({
  width: "100%",

  padding: "14px 20px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontWeight: "700",

  cursor: "pointer",
  transition: "opacity 0.15s ease",

  "&:hover": {
    opacity: 0.9,
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminPanel({
  products,
  setProducts,
  orders,
  setOrders,
  courses,
  setCourses,
  customRoastingRequests,
  setCustomRoastingRequests,
  courseEnrollments,
  setCourseEnrollments,
}: AdminPanelProps) {
  const [language, setLanguageState] = useState<AdminLanguage>(readLanguage);
  const setLanguage: Dispatch<SetStateAction<AdminLanguage>> = (value) => {
    setLanguageState((current) => {
      const next = typeof value === "function" ? value(current) : value;
      applyLanguage(next);
      return next;
    });
  };
  const t = adminTranslations[language];

  // ----------------------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(Boolean(user));
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      return;
    }

    try {
      setLoginLoading(true);
      setError("");

      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      setError(t.login.error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.error("Admin sign-out failed:", error);
    }
  };

  const changeLanguage = (newLanguage: AdminLanguage) => {
    setLanguage(newLanguage);
    setError("");
  };

  // ----------------------------------------------------------------------
  // ADMIN DATA
  // ----------------------------------------------------------------------

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [courseEnrollmentsLoading, setCourseEnrollmentsLoading] =
    useState(true);
  const [customRoastingRequestsLoading, setCustomRoastingRequestsLoading] =
    useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        const data = await getOrders();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    const loadCourseEnrollments = async () => {
      try {
        const data = await getCourseEnrollments();

        if (!cancelled) {
          setCourseEnrollments(data);
        }
      } catch (error) {
        console.error("Failed to load course enrollments:", error);
      } finally {
        if (!cancelled) {
          setCourseEnrollmentsLoading(false);
        }
      }
    };

    const loadCustomRoastingRequests = async () => {
      try {
        const data = await getCustomRoastingRequests();

        if (!cancelled) {
          setCustomRoastingRequests(data);
        }
      } catch (error) {
        console.error("Failed to load custom roasting requests:", error);
      } finally {
        if (!cancelled) {
          setCustomRoastingRequestsLoading(false);
        }
      }
    };

    void loadOrders();
    void loadCourseEnrollments();
    void loadCustomRoastingRequests();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    setOrders,
    setCourseEnrollments,
    setCustomRoastingRequests,
  ]);

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------

  if (authLoading) {
    return (
      <main className={cx(admin_page, "font-onest")}>
        <div className={login_card}>
          <h1>HARZ Admin</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return (
      <AdminDashboard
        language={language}
        setLanguage={setLanguage}
        onLogout={handleLogout}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        ordersLoading={ordersLoading}
        courses={courses}
        setCourses={setCourses}
        customRoastingRequests={customRoastingRequests}
        setCustomRoastingRequests={setCustomRoastingRequests}
        customRoastingRequestsLoading={customRoastingRequestsLoading}
        courseEnrollments={courseEnrollments}
        setCourseEnrollments={setCourseEnrollments}
        courseEnrollmentsLoading={courseEnrollmentsLoading}
      />
    );
  }

  return (
    <main className={cx(admin_page, "font-onest")}>
      <div className={language_switcher}>
        <button
          type="button"
          className={language === "en" ? active_language : undefined}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={language === "uk" ? active_language : undefined}
          onClick={() => changeLanguage("uk")}
        >
          UK
        </button>
      </div>
      <div className={login_card}>
        <h1>{t.login.title}</h1>
        <p>{t.login.description}</p>
        <form className={form} onSubmit={handleSubmit}>
          <div className={field}>
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={field}>
            <label htmlFor="admin-password">{t.login.password}</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className={error_message}>{error}</p>}
          <button
            className={login_button}
            type="submit"
            disabled={loginLoading}
          >
            {loginLoading ? "..." : t.login.signIn}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminPanel;
