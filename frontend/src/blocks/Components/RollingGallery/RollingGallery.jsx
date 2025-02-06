import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
} from "framer-motion";

const IMGS = [
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/3a5a601e-9f06-4453-8258-afc6c1a6d4df/Copy+of+IMG_1478.JPG?format=1000w",
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/2d8f0240-46c9-4322-a1ef-109c279dfafb/Copy+of+Copy+of+Tailgate+posters.jpg?format=1000w",
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/6a96f0e7-c951-4cc6-b5b6-fe428f3a168f/Copy+of+DSC_8414.JPG?format=1000w",
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/de25f6ba-7082-4f1f-bf9b-1aa3648b69b3/Copy+of+6859FE1B-578F-435E-8D8D-65430E11816D.JPG?format=1000w",
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/caa9a845-b784-42df-94d1-2a18d2830097/40B20EE5-379F-4654-B1D2-204EA7744FA0.JPG?format=1000w",
  "https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/41c1e2bf-1290-4450-af5f-5ce5c62f1d37/0B87BB2E-C7D5-4855-9064-A10A4C806DCA.JPG?format=1000w",
];

const RollingGallery = ({
  autoplay = false,
  pauseOnHover = false,
  images = [],
}) => {
  images = images.length > 0 ? images : IMGS;

  const [isScreenSizeSm, setIsScreenSizeSm] = useState(
    window.innerWidth <= 10000
  );
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 10000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3D geometry
  const cylinderWidth = isScreenSizeSm ? 1700 : 2500;
  const faceCount = images.length;
  const faceWidth = (cylinderWidth / faceCount) * 1.5;
  const radius = cylinderWidth / (1.85 * Math.PI);

  // Framer Motion
  const dragFactor = 0.008;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  // Convert rotation -> 3D transform
  const transform = useTransform(
    rotation,
    (val) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
  }, [autoplay]);

  const handleUpdate = (latest) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);

    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };
  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="flex justify-center items-center h-[320px] w-screen"> 
      <div className="relative h-full w-[57%] overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full w-[48px]"
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          }}
        />
        <div
          className="absolute top-0 right-0 h-full w-[48px] z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          }}
        />

        <div className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
          <motion.div
            drag="x"
            dragElastic={0}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={controls}
            onUpdate={handleUpdate}
            style={{
              transform: transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: "preserve-3d",
            }}
            className="flex min-h-[300px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
          >
            {images.map((url, i) => (
              <div
                key={i}
                className="group absolute flex h-fit items-center justify-center p-[8%] [backface-visibility:hidden] md:p-[6%]"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${(360 / faceCount) * i
                    }deg) translateZ(${radius}px)`,
                }}
              >
                <img
                  src={url}
                  alt="gallery"
                  className="pointer-events-none h-[150px] w-[400px] rounded-[20px] border-[3px] border-white object-cover
                            transition-transform duration-300 ease-out group-hover:scale-105
                            sm:h-[210px] sm:w-[320px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RollingGallery;