
  const captureScreenshot = async () => {
    if (!iframeRef.current || !rect) return null;
    setIsCapturing(true);
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const { left, top, scale } = calculateIframePosition();
      // Calculate the actual coordinates within the iframe content
      const contentX = (rect.x - left) / scale;
      const contentY = (rect.y - top) / scale;
      const contentWidth = rect.width / scale;
      const contentHeight = rect.height / scale;
      // Create a canvas for the selected area
      const canvas = document.createElement("canvas");
      canvas.width = contentWidth;
      canvas.height = contentHeight;
      const context = canvas.getContext("2d");
      // Create a temporary div to hold the cloned content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "0";
      tempDiv.style.top = "0";
      tempDiv.style.width = iframeDoc.documentElement.scrollWidth + "px";
      tempDiv.style.height = iframeDoc.documentElement.scrollHeight + "px";
      tempDiv.style.overflow = "hidden";
      // Clone the iframe content
      const clone = iframeDoc.documentElement.cloneNode(true);
      tempDiv.appendChild(clone);
      // Use html2canvas on the specific region
      const captureOptions = {
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        x: contentX,
        y: contentY,
        width: contentWidth,
        height: contentHeight,
        scrollX: -contentX,
        scrollY: -contentY,
      };
      const screenshotCanvas = await html2canvas(
        iframeDoc.body,
        captureOptions
      );
      // Draw the captured content to our final canvas
      context.drawImage(
        screenshotCanvas,
        0,
        0,
        contentWidth,
        contentHeight,
        0,
        0,
        contentWidth,
        contentHeight
      );
      const screenshotUrl = canvas.toDataURL();
      setScreenshot(screenshotUrl);
      setIsCapturing(false);
      return screenshotUrl;
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      setIsCapturing(false);
      return null;
    }
  };