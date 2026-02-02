/* eslint-disable react/no-unescaped-entities */
import { titleFont } from "@/config/fonts";

interface Props {
  className?: string;
  fontSize?: string; // e.g., 'text-5xl' o '48px'
}

export const LogoBrand = ({ className, fontSize = "text-5xl" }: Props) => {
  return (
    <span
      className={`${titleFont.className} ${fontSize} ${className} antialiased font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-(--brand-primary) via-(--brand-secondary) to-(--brand-accent)`}
    >
      XHOP'DIT
    </span>
  );
};
