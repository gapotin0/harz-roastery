import { useMemo, useState } from "react";
import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import C7_shop_card from "./C7_shop_card";

import type { CartProduct } from "../data/products";
import { rise, useSoftMotion } from "./motion";
import { translations } from "./translations";

import arrow_scroll from "../assets/c7_arrow_scroll.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C7Props = {
  language: "en" | "uk";
  products: CartProduct[];
  addToCart: (product: CartProduct) => void;
};

type CategoryFilter = "all" | "single-origin" | "espresso" | "rare" | "decaf";

type SortOption = "" | "popularity" | "price-low" | "price-high" | "roast";

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c7_place = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "120px 80px",
  gap: "40px",

  color: "var(--text-main)",

  "@media (max-width: 1024px)": {
    padding: "100px 40px",
  },

  "@media (max-width: 768px)": {
    padding: "80px 24px",
    gap: "32px",
  },

  "@media (max-width: 480px)": {
    padding: "64px 16px",
    gap: "28px",
  },
});

const c7_title = css({
  margin: 0,
  paddingBottom: "12px",

  textTransform: "uppercase",
  color: "var(--clay)",
  fontSize: "12px",
  fontWeight: "700",

  "@media (max-width: 480px)": {
    fontSize: "11px",
  },
});

const c7_second_title = css({
  margin: 0,
  paddingBottom: "24px",

  fontSize: "36px",
  fontWeight: "700",
  lineHeight: "120%",

  "@media (max-width: 768px)": {
    fontSize: "32px",
  },

  "@media (max-width: 480px)": {
    paddingBottom: "16px",
    fontSize: "28px",
  },
});

const c7_sort_pannel = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "16px 0",
  gap: "24px",

  "@media (max-width: 900px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },

  "@media (max-width: 480px)": {
    padding: "8px 0",
    gap: "16px",
  },
});

const c7_sort_pannel_btm = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",

  gap: "8px",

  "& button": {
    padding: "8px 16px",

    backgroundColor: "var(--bg-card)",
    borderRadius: "24px",
    border: "1px solid var(--sand-line)",

    color: "var(--text-main)",
    font: "inherit",
    fontWeight: "600",
    textAlign: "left",
    whiteSpace: "nowrap",

    cursor: "pointer",
    transition:
      "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
  },

  "@media (max-width: 480px)": {
    gap: "6px",

    "& button": {
      padding: "7px 12px",
      fontSize: "12px",
    },
  },
});

const active_filter = css({
  backgroundColor: "var(--clay) !important",
  borderColor: "var(--clay) !important",
  color: "#f3ede6 !important",
});

const c7_sort_pannel_sort = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  gap: "8px",

  "& p": {
    margin: 0,

    fontSize: "14px",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
  },

  "& select": {
    appearance: "none",
    padding: "8px 34px 8px 14px",

    backgroundColor: "var(--bg-card)",
    backgroundImage: "var(--select-chevron)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "12px 8px",
    borderRadius: "100px",
    border: "1px solid var(--sand-line)",

    fontFamily: "inherit",
    fontWeight: "600",
    color: "var(--text-main)",

    outline: "none",
    cursor: "pointer",

    "&::-ms-expand": {
      display: "none",
    },
  },

  "@media (max-width: 900px)": {
    justifyContent: "flex-end",
  },

  "@media (max-width: 480px)": {
    justifyContent: "space-between",
    width: "100%",

    "& p": {
      fontSize: "12px",
    },

    "& select": {
      maxWidth: "190px",
      width: "100%",
      fontSize: "12px",
    },
  },
});

const c7_market_place = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "24px",

  "@media (max-width: 1024px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  "@media (max-width: 640px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  "@media (max-width: 400px)": {
    gap: "8px",
  },
});

const empty_state = css({
  padding: "40px 20px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  textAlign: "center",
  color: "var(--text-muted)",

  "& p": {
    margin: 0,
  },
});

const c7_pagination = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  marginTop: "16px",
  padding: "40px 0px 120px 0px",
  gap: "14px",

  "& button": {
    background: "transparent",
    border: "none",

    color: "var(--text-main)",
    font: "inherit",
    fontSize: "16px",
    fontWeight: "600",

    cursor: "pointer",
  },

  "@media (max-width: 480px)": {
    gap: "10px",
  },
});

const c7_pagination_arrow = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "48px",
  height: "48px",

  padding: 0,

  backgroundColor: "var(--chip-bg) !important",
  border: "1px solid var(--sand-line) !important",
  borderRadius: "50%",

  "&:disabled": {
    opacity: 0.35,
    cursor: "not-allowed",
  },

  "@media (max-width: 480px)": {
    width: "42px",
    height: "42px",
  },
});

const pagination_arrow_icon = css({
  display: "block",
  width: "18px",
  height: "18px",
});

const c7_pagination_number = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "48px",
  height: "48px",

  borderRadius: "50%",

  "@media (max-width: 480px)": {
    width: "42px",
    height: "42px",
  },
});

const c7_pagination_active = css({
  backgroundColor: "var(--clay) !important",
  color: "#f3ede6 !important",
});

const arrow_left = css({
  transform: "rotate(180deg)",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C7_shop({ language, products, addToCart }: C7Props) {
  const t = translations[language];
  const { reduce, reveal } = useSoftMotion();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("");

  const productsPerPage = 6;

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "roast": {
        const roastOrder: Record<string, number> = {
          "Light Roast": 1,
          "Medium Roast": 2,
          "Dark Roast": 3,
        };

        result.sort(
          (a, b) => (roastOrder[a.roast] ?? 99) - (roastOrder[b.roast] ?? 99),
        );

        break;
      }

      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity);
        break;

      default:
        break;
    }

    return result;
  }, [products, activeCategory, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedProducts.length / productsPerPage),
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div id="shop" className={cx("font-onest", c7_place)}>
      <motion.div variants={rise} {...reveal}>
        <h2 className={c7_title}>{t.c7.title}</h2>
        <h3 className={c7_second_title}>{t.c7.second_title}</h3>
      </motion.div>
      <div className={c7_sort_pannel}>
        <div className={c7_sort_pannel_btm}>
          <motion.button
            type="button"
            className={activeCategory === "all" ? active_filter : undefined}
            onClick={() => handleCategoryChange("all")}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {t.c7.filter_all}
          </motion.button>
          <motion.button
            type="button"
            className={
              activeCategory === "single-origin" ? active_filter : undefined
            }
            onClick={() => handleCategoryChange("single-origin")}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {t.c7.filter_single_origin}
          </motion.button>
          <motion.button
            type="button"
            className={
              activeCategory === "espresso" ? active_filter : undefined
            }
            onClick={() => handleCategoryChange("espresso")}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {t.c7.filter_espresso}
          </motion.button>
          <motion.button
            type="button"
            className={activeCategory === "rare" ? active_filter : undefined}
            onClick={() => handleCategoryChange("rare")}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {t.c7.filter_rare}
          </motion.button>
          <motion.button
            type="button"
            className={activeCategory === "decaf" ? active_filter : undefined}
            onClick={() => handleCategoryChange("decaf")}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {t.c7.filter_decaf}
          </motion.button>
        </div>
        <div className={c7_sort_pannel_sort}>
          <p>{t.c7.sort_by}</p>
          <select
            name="sort"
            id="sort-select"
            value={sortOption}
            onChange={(event) =>
              handleSortChange(event.target.value as SortOption)
            }
          >
            <option value="">{t.c7.sort_by}</option>
            <option value="popularity">{t.c7.sort_popularity}</option>
            <option value="price-low">{t.c7.sort_price_low}</option>
            <option value="price-high">{t.c7.sort_price_high}</option>
            <option value="roast">{t.c7.sort_roast}</option>
          </select>
        </div>
      </div>
      {currentProducts.length > 0 ? (
        <div
          className={c7_market_place}
          key={`${activeCategory}-${sortOption}-${currentPage}`}
        >
          {currentProducts.map((product, index) => (
            <C7_shop_card
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              language={language}
              delay={index * 0.06}
            />
          ))}
        </div>
      ) : (
        <div className={empty_state}>
          <p>{t.c7.no_products}</p>
        </div>
      )}
      {filteredAndSortedProducts.length > 0 && totalPages > 1 && (
        <div className={c7_pagination}>
          <button
            type="button"
            className={c7_pagination_arrow}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label={t.c7.previous_page}
          >
            <img
              className={cx(pagination_arrow_icon, arrow_left, "icon")}
              src={arrow_scroll}
              alt=""
            />
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={cx(
                  c7_pagination_number,
                  currentPage === page && c7_pagination_active,
                )}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            className={c7_pagination_arrow}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label={t.c7.next_page}
          >
            <img
              className={cx(pagination_arrow_icon, "icon")}
              src={arrow_scroll}
              alt=""
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default C7_shop;
