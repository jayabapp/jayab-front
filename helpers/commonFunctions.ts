import { p2e } from "./NumberConverter";

export const scrollToElementTop = (id: string | number, extra = -50) => {
  if (document.getElementById(`${id}`) && document.getElementById(`${id}`) !== null)
    window.scrollTo({
      top: (document.getElementById(`${id}`)?.getBoundingClientRect()?.top || 0) + extra,
      behavior: "smooth",
    });
};

export const getNumber = (value: number) => {
  const temp2 = p2e(value);
  const temp = temp2?.replace(/\D/g, "");
  return temp;
};

export const _scrollToTop = () => {
  window?.scrollTo({ top: 0, behavior: "smooth" });
};
