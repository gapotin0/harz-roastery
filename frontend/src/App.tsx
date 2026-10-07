import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Component1 from "./components/C1_company";
import C2_who_we_are from "./components/C2_who_we_are";
import C3_roast_profiles from "./components/C3_roast_profiles";
import C4_who_this_is_for from "./components/C4_who_this_is_for";
import C5_academy from "./components/C5_academy";
import C6_custom_roasting from "./components/C6_custom_roasting";
import C7_shop from "./components/C7_shop";
import Footer from "./components/Footer";
import LegalPage from "./components/LegalPage";
import AdminPanel from "./admin/AdminPanel";
import { applyLanguage, readLanguage, type SiteLanguage } from "./preferences";

import { getCourses } from "./services/courseApi";
import { getProducts } from "./services/productApi";

import type { CourseEnrollment } from "./data/courseEnrollments";
import type { Course } from "./data/courses";
import type { CustomRoastingRequest } from "./data/customRoasting";
import type { Order, OrderItem } from "./data/orders";
import type { CartProduct } from "./data/products";

// ----------------------------------------------------------------------
// MAIN SITE
// ----------------------------------------------------------------------

type MainSiteProps = {
  products: CartProduct[];
  courses: Course[];
  refreshProducts: () => Promise<void>;
};

function MainSite({ products, courses, refreshProducts }: MainSiteProps) {
  const [language, setLanguageState] = useState<SiteLanguage>(readLanguage);
  const setLanguage: Dispatch<SetStateAction<SiteLanguage>> = (value) => {
    setLanguageState((current) => {
      const next = typeof value === "function" ? value(current) : value;
      applyLanguage(next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (product: CartProduct) => {
    if (!product.inStock || product.stock <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: product.stock,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          roast: product.roast,
          weight: product.weight,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }

        if (item.quantity === 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  return (
    <>
      <Header
        language={language}
        setLanguage={setLanguage}
        cartItems={cartItems}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        refreshProducts={refreshProducts}
      />
      <Component1 language={language} />
      <C2_who_we_are language={language} />
      <C3_roast_profiles language={language} />
      <C4_who_this_is_for language={language} />
      <C5_academy language={language} courses={courses} />
      <C6_custom_roasting language={language} />
      <C7_shop language={language} products={products} addToCart={addToCart} />
      <Footer language={language} />
    </>
  );
}

// ----------------------------------------------------------------------
// APP
// ----------------------------------------------------------------------

function App() {
  // ----------------------------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------------------------

  const [products, setProducts] = useState<CartProduct[]>([]);

  const refreshProducts = useCallback(async () => {
    try {
      const firestoreProducts = await getProducts();

      setProducts(firestoreProducts);
    } catch (error) {
      console.error("Failed to load products from backend:", error);
    }
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  // ----------------------------------------------------------------------
  // COURSES
  // ----------------------------------------------------------------------

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      try {
        const firestoreCourses = await getCourses();

        if (!cancelled) {
          setCourses(firestoreCourses);
        }
      } catch (error) {
        console.error("Failed to load courses from backend:", error);

        if (!cancelled) {
          setCourses([]);
        }
      }
    };

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  // Orders, course enrollments and custom roasting requests are loaded by
  // their admin pages. The state lives here so the dashboard counters keep
  // their values while switching between admin pages.

  // ----------------------------------------------------------------------
  // COURSE ENROLLMENTS
  // ----------------------------------------------------------------------

  const [courseEnrollments, setCourseEnrollments] = useState<
    CourseEnrollment[]
  >([]);

  // ----------------------------------------------------------------------
  // ORDERS
  // ----------------------------------------------------------------------

  const [orders, setOrders] = useState<Order[]>([]);

  // ----------------------------------------------------------------------
  // CUSTOM ROASTING REQUESTS
  // ----------------------------------------------------------------------

  const [customRoastingRequests, setCustomRoastingRequests] = useState<
    CustomRoastingRequest[]
  >([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainSite
              products={products}
              courses={courses}
              refreshProducts={refreshProducts}
            />
          }
        />
        <Route path="/privacy" element={<LegalPage page="privacy" />} />
        <Route path="/terms" element={<LegalPage page="terms" />} />
        <Route
          path="/admin"
          element={
            <AdminPanel
              products={products}
              setProducts={setProducts}
              orders={orders}
              setOrders={setOrders}
              courses={courses}
              setCourses={setCourses}
              customRoastingRequests={customRoastingRequests}
              setCustomRoastingRequests={setCustomRoastingRequests}
              courseEnrollments={courseEnrollments}
              setCourseEnrollments={setCourseEnrollments}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
