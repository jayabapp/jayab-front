import { useCallback, useRef } from "react";

const CAPTCHA_CHARACTERS = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9".split(",");

export const useRecaptchaGenerator: (
  captchaLength?: number,
  linesCount?: number,
  dotCount?: number,
  canvasId?: string
) => { regenerate: () => void; validateCaptcha: (a: string) => boolean } = (
  captchaLength = 5,
  linesCount = 5,
  dotCount = 30,
  canvasId = "recaptcha"
) => {
  const captchaArray = useRef<string[]>([]);

  const charactersLength = CAPTCHA_CHARACTERS.length;
  const canvasWidth = 40 * captchaLength;
  const canvasHeight = 50;
  const regenerate = useCallback(() => {
    const canvas = <HTMLCanvasElement>document?.getElementById(canvasId);
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    captchaArray.current = [];
    for (let i = 0; i < captchaLength; i++) {
      let sIndex = Math.floor(Math.random() * charactersLength);
      let sDeg = (Math.random() * 30 * Math.PI) / 180;
      let cTxt = CAPTCHA_CHARACTERS[sIndex];
      captchaArray.current.push(cTxt?.toLowerCase());
      let x = 20 + i * (canvasWidth / captchaLength);
      let y = canvasHeight / 2 + Math.random() * 8;
      context.font = "bold 25px 微软雅黑";
      context.translate(x, y);
      context.rotate(sDeg);
      context.fillStyle = randomColor();
      context.fillText(cTxt, 0, 0);
      context.rotate(-sDeg);
      context.translate(-x, -y);
    }
    for (let i = 0; i < linesCount; i++) {
      context.strokeStyle = randomColor();
      context.beginPath();
      context.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      context.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      context.stroke();
    }
    for (let i = 0; i < dotCount; i++) {
      context.strokeStyle = randomColor();
      context.beginPath();
      let x = Math.random() * canvasWidth;
      let y = Math.random() * canvasHeight;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
  }, [canvasHeight, canvasId, canvasWidth, captchaLength, charactersLength, dotCount, linesCount]);
  const validateCaptcha = useCallback((text: string) => {
    return text?.toLowerCase() == captchaArray?.current?.toString()?.replace(/\,/g, "");
  }, []);
  return { regenerate, validateCaptcha };
};

// using 160 for generating darker colors
function randomColor() {
  let r = Math.floor(Math.random() * 160);
  let g = Math.floor(Math.random() * 160);
  let b = Math.floor(Math.random() * 160);
  return "rgb(" + r + "," + g + "," + b + ")";
}
