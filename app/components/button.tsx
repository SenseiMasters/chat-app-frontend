"use client";

import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

type IStandardButton = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const StandardButton: React.FC<IStandardButton> = ({
  children,
  className = "bg-gray-100 px-3 py-2 border-gray-200 border rounded-xl",
  ...props
}) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
