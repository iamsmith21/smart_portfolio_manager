"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, {
    stiffness: 500,
    damping: 100,
  });
  const mouseYSpring = useSpring(y, {
    stiffness: 500,
    damping: 100,
  });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={`group/pin ${containerClassName}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        className="relative left-1/2 top-1/2 ml-[0.09375rem] mt-4"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
        >
          <motion.div
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            <div
              style={{
                transform: "translateZ(0px)",
              }}
              className="shadow-lg"
            >
              {children}
            </div>
          </motion.div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-96 h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <a
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            className="relative z-50 flex items-center space-x-2 rounded-full bg-zinc-950 dark:bg-zinc-800 px-4 py-0.5 ring-1 ring-white/10"
          >
            <span className="relative z-50 text-white text-xs font-bold inline-block py-0.5">
              {title || "View Project"}
            </span>

            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/pin:opacity-100" />
          </a>
        </div>

        <div
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 flex items-center justify-center"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            opacity: [0, 1, 0.5, 0],
            scale: 1,
            z: 0,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 2,
          }}
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
        ></motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            opacity: [0, 1, 0.5, 0],
            scale: 1,
            z: 0,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 4,
          }}
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
        ></motion.div>
      </div>
    </motion.div>
  );
};

