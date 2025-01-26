"use client";

import { useState, useMemo, useEffect, useRef } from "react";

const UseIsInViewport = (id: string) => {
  const [observer, setObserver] = useState<IntersectionObserver>();

  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    setObserver(new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)));
  }, []);
  // const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)), []);

  useEffect(() => {
    const el = document.getElementById(id);
    if (observer && el && el != null) observer.observe(el);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [observer, id]);

  return isIntersecting;
};

export default UseIsInViewport;
