import React, { useState, useEffect, useRef } from "react";

export default function LazyImage({
  src,
  webp,
  alt = "Image",
  className = "",
  width,
  height,
  sizes,
  priority = false,
  onLoad,
  objectFit = "cover",
  objectPosition = "center",
  placeholderColor = "bg-gray-200 dark:bg-gray-700",
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Set initial source (for priority images, webp if available)
  useEffect(() => {
    if (priority && webp) {
      setImageSrc(webp);
    } else if (priority && src) {
      setImageSrc(src);
    }
  }, [priority, webp, src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "50px" }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    // Try WebP first, then fallback to original
    if (webp && !imageSrc) {
      setImageSrc(webp);
    } else if (src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isInView, webp, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    // If WebP failed, try original format
    if (imageSrc === webp && src) {
      setImageSrc(src);
    }
  };

  const imgProps = {
    ref: imgRef,
    alt,
    className: `${className} transition-opacity duration-300 ${
      isLoaded ? "opacity-100" : "opacity-0"
    }`,
    style: {
      objectFit,
      objectPosition,
      width: "100%",
      height: "100%",
    },
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
  };

  if (width) imgProps.width = width;
  if (height) imgProps.height = height;
  if (sizes) imgProps.sizes = sizes;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${!isLoaded ? placeholderColor : ""}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : {}}
    >
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}

      {/* Actual image */}
      {imageSrc && <img src={imageSrc} {...imgProps} />}

      {/* No image provided fallback */}
      {!imageSrc && (
        <div className={`absolute inset-0 ${placeholderColor} flex items-center justify-center`}>
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}
    </div>
  );
}
