import { useRef, useEffect, useState } from 'react';

const FadeContent = ({
  children,
  blur = false,
  duration = 1000,
  easing = 'ease-out',
  threshold = 0.1,
  initialOpacity = 0,
  className = ''
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} transition-opacity ${blur ? "transition-[opacity,filter]" : ""} ${inView ? "opacity-100" : `opacity-[${initialOpacity}]`
        } ${blur ? (inView ? "blur-0" : "blur-[10px]") : ""}`}
      style={{
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeContent;
