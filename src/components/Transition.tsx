"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Transition = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};
export default Transition;
