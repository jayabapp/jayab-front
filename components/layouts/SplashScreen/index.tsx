import splashStyles from "./splashStyles";
import SplashLogo from "./SplashLogo";

const SplashScreen = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: splashStyles }} />
      <div id="app-splash" role="presentation" aria-hidden="true">
        <SplashLogo className="splash-logo" />
      </div>
    </>
  );
};

export default SplashScreen;
