"use client";

import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../../../lib/api";
import Button from "@/components/ui/Button";
import { AuthContext } from "@/context/AuthContext";

const inputClass =
  "w-full rounded-md px-4 py-3 text-sm placeholder-gray-500 outline-none border border-orange-600 focus:border-orange-600";
const labelClass = "mb-2 block text-sm text-gray-600";


// ================= CAMERA COMPONENT SAME (NO CHANGE) =================
function CameraCapture({
  shouldStartCamera,
  facingMode,
  capturedImage,
  onCapture,
  onRetake,
  label,
  description,
  mirror = false,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!shouldStartCamera || capturedImage) return;

    let cancelled = false;
    setStatus("starting");

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }

        if (!cancelled) setStatus("live");
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error("Camera access denied or not available");
      }
    };

    start();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setStatus("idle");
    };
  }, [shouldStartCamera, capturedImage, facingMode, retry]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || status !== "live") return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (mirror) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    if (mirror) ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const dataUrl = canvas.toDataURL("image/jpeg");

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      video.srcObject = null;
      setStatus("idle");

      onCapture(file, dataUrl);
    }, "image/jpeg");
  };

  if (capturedImage) {
    return (
      <div className="space-y-2">
        <label className={labelClass}>{label}</label>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="relative inline-block rounded-lg overflow-hidden border max-w-[320px]">
          <img src={capturedImage} className="max-h-72" />
          <button
            type="button"
            onClick={onRetake}
            className="absolute bottom-2 right-2 bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      <p className="text-xs text-gray-500">{description}</p>

      <div className="relative bg-black aspect-video max-w-[320px] rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${mirror ? "scale-x-[-1]" : ""}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {status === "live" && (
          <div className="absolute bottom-4 w-full flex justify-center">
            <button
              type="button"
              onClick={capture}
              className="w-16 h-16 rounded-full bg-white"
            />
          </div>
        )}

        {status === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            Starting camera...
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-red-400">
            Camera error
            <button onClick={() => setRetry(r=>r+1)}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}


// ================= MAIN PAGE =================
export default function Verification() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //  protect page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated,router]);

  // set user email when loaded
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setName(user.name || "");
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const selfieReady = !selfiePreview;
  const aadhaarFrontReady = selfiePreview && !aadhaarFrontPreview;
  const aadhaarBackReady =
    selfiePreview && aadhaarFrontPreview && !aadhaarBackPreview;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selfieFile || !aadhaarFrontFile || !aadhaarBackFile) {
      toast.error("Capture all images");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("current_pic", selfieFile);
    formData.append("adhar[]", aadhaarFrontFile);
    formData.append("adhar[]", aadhaarBackFile);

    try {
      setLoading(true);
      const res = await api.post("/Wb/update_profile", formData);
        console.log(res.data)
      if (res.data?.status === 0) {
        toast.success("Verification submitted");

        //  update user context with new data
        const updatedUser = { ...user, is_approved: 1 };
        login(updatedUser, localStorage.getItem("token"));
        console.log(user , res.data)
        router.replace("/dashboard");
      } else {
        toast.error(res.data?.message || "Failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl mb-6">Identity Verification</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className={labelClass}>Full Name</label>
            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input value={email} readOnly className={inputClass}/>
          </div>

          <CameraCapture
            shouldStartCamera={selfieReady}
            facingMode="user"
            capturedImage={selfiePreview}
            onCapture={(f,p)=>{setSelfieFile(f);setSelfiePreview(p)}}
            onRetake={()=>{setSelfieFile(null);setSelfiePreview(null)}}
            label="Selfie"
            description="Take selfie"
            mirror
          />

          <CameraCapture
            shouldStartCamera={aadhaarFrontReady}
            facingMode="environment"
            capturedImage={aadhaarFrontPreview}
            onCapture={(f,p)=>{setAadhaarFrontFile(f);setAadhaarFrontPreview(p)}}
            onRetake={()=>{setAadhaarFrontFile(null);setAadhaarFrontPreview(null)}}
            label="Aadhaar Front"
            description="Capture front"
          />

          <CameraCapture
            shouldStartCamera={aadhaarBackReady}
            facingMode="environment"
            capturedImage={aadhaarBackPreview}
            onCapture={(f,p)=>{setAadhaarBackFile(f);setAadhaarBackPreview(p)}}
            onRetake={()=>{setAadhaarBackFile(null);setAadhaarBackPreview(null)}}
            label="Aadhaar Back"
            description="Capture back"
          />

          <Button type="submit" loading={loading}>
            Submit Verification
          </Button>

          <Link href="/dashboard" className="block text-center text-gray-400">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}