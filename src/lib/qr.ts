import jsQR from "jsqr";
import { OTPDataType } from "src/types";

export async function setupScanner(videoElement: HTMLVideoElement) {
  videoElement.srcObject = await createStream();
  videoElement.setAttribute("playsinline", "true");
  videoElement.play();
}

function createStream() {
  return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
}

export function teardownScanner(videoElement: HTMLVideoElement) {
  const stream = videoElement.srcObject as MediaStream;
  const tracks = stream?.getTracks();
  tracks?.forEach(track => track.stop());
  videoElement.srcObject = null;
}

export function* frameProcessor(
  videoElement: HTMLVideoElement,
  onDetected: (data: OTPDataType) => void
) {
  while (true) {
    const imageData = processVideoFrame(videoElement);
    if (imageData) {
      const otp = detectOTPData(imageData);
      if (otp) onDetected(otp);
    }
    yield;
  }
}

function processVideoFrame(videoElement: HTMLVideoElement) {
  if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) return;

  const canvas = document.createElement("canvas");
  canvas.height = videoElement.videoHeight;
  canvas.width = videoElement.videoWidth;
  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) return;

  canvasContext.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
}

function detectOTPData(imageData: ImageData): OTPDataType | null {
  const qrData = jsQR(imageData.data, imageData.width, imageData.height);
  if (!qrData || !qrData.data) return null;

  console.log("QR code detected:", qrData.data);
  return extractOTPData(qrData.data);
}

function extractOTPData(data: string): OTPDataType | null {
  // example: otpauth://scheme/label?secret=secret&issuer=issuer
  const uri = new URL(data);
  if (uri.protocol !== "otpauth:") return null;

  const scheme = uri.host as OTPDataType["scheme"];
  const label = decodeURIComponent(uri.pathname.slice(1));
  const secret = uri.searchParams.get("secret") || "";
  const issuer = uri.searchParams.get("issuer") || null;

  if (!scheme || !label || !secret) return null;
  if (!scheme.match(/^(totp|hotp)$/)) return null;

  return {
    scheme: scheme as OTPDataType["scheme"],
    label,
    secret,
    issuer
  };
}