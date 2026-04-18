import { AnimatePresence, motion } from "framer-motion";

let initialized = false;

const SplashScreen = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[5000] bg-primary-500 flex flex-col gap-10 items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Radial glow behind logo */}
          <img className="md:hidden w-screen h-screen absolute inset-0 z-0" src="/assets/images/splash/Splash.png" />
          <img
            className="hidden md:block w-screen h-screen absolute inset-0 z-0"
            src="/assets/images/splash/SplashDesktop.png"
          />
          <div className="w-screen h-screen absolute inset-0 bg-primary-700 " />
          <motion.div
            className="absolute rounded-full bg-white/25 blur-3xl"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 300, height: 300, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", repeat: 10, repeatType: "reverse" }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
            }}
          >
            <img
              src="/assets/icons/logo/logo.svg"
              alt="logo"
              className=" grayscale brightness-[400]  size-[10rem] relative z-10"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
