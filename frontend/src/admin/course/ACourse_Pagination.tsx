import { css, cx } from "@emotion/css";

import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const pagination = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",

  marginTop: "8px",
  gap: "6px",
});

const page_button = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  minWidth: "42px",
  height: "42px",

  padding: "0 12px",

  backgroundColor: "transparent",
  border: "1px solid transparent",
  borderRadius: "100px",

  color: "var(--text-main)",

  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",

  cursor: "pointer",

  transition: "background-color 0.15s ease, border-color 0.15s ease",

  "&:hover:not(:disabled)": {
    backgroundColor: "var(--chip-bg)",
  },

  "&:disabled": {
    opacity: 0.35,
    cursor: "not-allowed",
  },
});

const navigation_button = css({
  border: "1px solid var(--sand-line)",
});

const active_button = css({
  backgroundColor: "var(--clay) !important",
  borderColor: "var(--clay) !important",

  color: "#f3ede6 !important",
});

const dots = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  width: "32px",

  color: "var(--text-muted)",

  fontWeight: "700",
});

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function ACourse_Pagination({
  language,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const t = adminTranslations[language].courses.pagination;

  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <div className={pagination}>
      <button
        type="button"
        className={cx(page_button, navigation_button)}
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-label={t.previous}
      >
        ←
      </button>

      {items.map((item, index) =>
        item === "..." ? (
          <span key={`dots-${index}`} className={dots}>
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cx(page_button, currentPage === item && active_button)}
            onClick={() => onPageChange(item)}
            aria-current={currentPage === item ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={cx(page_button, navigation_button)}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-label={t.next}
      >
        →
      </button>
    </div>
  );
}

export default ACourse_Pagination;
