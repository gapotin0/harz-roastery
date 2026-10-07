import { useReducedMotion, motion, type Variants } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export const softEase = [0.22, 1, 0.36, 1] as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: softEase },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const liftCard: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: softEase },
  }),
  hover: {
    y: -6,
    transition: { duration: 0.28, ease: softEase },
  },
};

export const hoverImage: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.45, ease: softEase },
  },
};

export function useSoftMotion() {
  const reduce = Boolean(useReducedMotion());

  return {
    reduce,
    reveal: reduce
      ? { initial: false as const }
      : {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, amount: 0.2 },
        },
  };
}

type MotionDialogProps = {
  overlayClass: string;
  panelClass: string;
  onClose: () => void;
  children: ReactNode;
  closeOn?: "click" | "mousedown";
};

export function MotionDialog({
  overlayClass,
  panelClass,
  onClose,
  children,
  closeOn = "mousedown",
}: MotionDialogProps) {
  const reduce = Boolean(useReducedMotion());

  const dismiss = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className={overlayClass}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.22 }}
      onMouseDown={closeOn === "mousedown" ? dismiss : undefined}
      onClick={closeOn === "click" ? dismiss : undefined}
    >
      <motion.div
        className={panelClass}
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.36, ease: softEase }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
