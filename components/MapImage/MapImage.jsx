import React, {useEffect} from 'react'
import {useMediaQuery} from '@chakra-ui/react'

export const MapImage = ({title}) => {

  let canvasRef = React.useRef(null)
  let ctx;
  let offsetX;
  let offsetY;
  let canvasWidth;
  let canvasHeight;
  let oldMouseX = 0;
  let oldMouseY = 0;
  let subImgX = 0;
  let subImgY = 0;
  let xDiff = 0;
  let yDiff = 0;
  let iHeight = 0;
  let iWidth = 0;
  let isDragging = false;
  let img;

  // This was recently added to support pinch zoom (mobile).
  let imgScale = 1
  let touchDist = 0
  let isScaling = false

  useEffect(() => {
    ctx = canvasRef.current.getContext("2d");
    let {canvas} = ctx

    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // This was originally below all of the functions:

    canvas.onmousedown = (e) => {
      handleMouseDown(e);
    };

    canvas.onmousemove = (e) => {
      handleMouseMove(e);
    };

    canvas.onmouseup = (e) => {
      handleMouseUp(e);
    };

    canvas.onmouseleave = (e) => {
      handleMouseLeave(e);
    };

    canvas.addEventListener('touchstart', handleMouseDown, false);
    canvas.addEventListener('touchmove', handleMouseMove, false);
    canvas.addEventListener('touchend', handleMouseUp, false);

    document.getElementById("iWidth").innerHTML = iWidth;
    document.getElementById("iHeight").innerHTML = iHeight;

    img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      iWidth = img.width;
      iHeight = img.height;
    };
    img.src = "/testwebmap.jpg";
  }, [])

  /**
   * Pinch zoom distance (between two points)
   * This was recently added to support pinch zoom (mobile).
   * @param e
   * @returns {number}
   */
  function distance(e) {
    let zw = e.touches[0].pageX - e.touches[1].pageX;
    let zh = e.touches[0].pageY - e.touches[1].pageY;
    return Math.sqrt(zw * zw + zh * zh);
  }

  function setCoordinates(e) {
    let canMouseX;
    let canMouseY;

    if ((e.clientX) && (e.clientY)) {
      canMouseX = parseInt(e.clientX - offsetX);
      canMouseY = parseInt(e.clientY - offsetY);
    } else if (e.targetTouches) {
      canMouseX = parseInt(e.targetTouches.item(0)?.clientX - offsetX);
      canMouseY = parseInt(e.targetTouches.item(0)?.clientY - offsetY);
      // This isn't doing anything (noticeable)
      // e.preventDefault();
    }

    return {
      canMouseX,
      canMouseY
    }
  }


  function handleMouseDown(e) {
    const {canMouseX, canMouseY} = setCoordinates(e);

    document.getElementById("mouseX").innerHTML = canMouseX;
    document.getElementById("mouseY").innerHTML = canMouseY;
    oldMouseX = canMouseX;
    oldMouseY = canMouseY;

    // This was recently added to support pinch zoom (mobile).
    if (e?.targetTouches) {
      e.preventDefault()
      if (e?.touches?.length > 1) {
        // detected a pinch
        touchDist = distance(e);
        isScaling = true;
      } else {
        // set the drag flag
        isDragging = true;
        isScaling = false;
      }
    }
  }

  function handleMouseUp(e) {
    setCoordinates(e);

    // clear the drag flag
    isDragging = false;
  }

  function handleMouseLeave(e) {
    setCoordinates(e);

    // user has left the canvas, so clear the drag flag
    isDragging = false;
  }

  function handleMouseMove(e) {
    const {canMouseX, canMouseY} = setCoordinates(e);
    document.getElementById("mouseX").innerHTML = canMouseX;
    document.getElementById("mouseY").innerHTML = canMouseY;

    // This was recently added to support pinch zoom (mobile).
    if (isScaling && touchDist) {
      imgScale = distance(e) / touchDist;
      if (imgScale < 1) {
        imgScale = 1;
      }
    }

    // if the drag flag is set, clear the canvas and draw the image
    if (isDragging) {
      xDiff = oldMouseX - canMouseX;
      yDiff = oldMouseY - canMouseY;
      oldMouseX = canMouseX;
      oldMouseY = canMouseY;
      subImgX += xDiff;
      subImgY += yDiff;
      xDiff = yDiff = 0;
      if (subImgX < 0) {
        subImgX = 0
      }
      if (subImgX > iWidth - canvasWidth) {
        subImgX = iWidth - canvasWidth
      }
      if (subImgY < 0) {
        subImgY = 0
      }
      if (subImgY > iHeight - canvasHeight) {
        subImgY = iHeight - canvasHeight
      }
      document.getElementById("subX").innerHTML = subImgX;
      document.getElementById("subY").innerHTML = subImgY;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, subImgX, subImgY, 800, 800, 0, 0, 800, 800);
    }
  }

  const ids = ["mouseX", "mouseY", "subX", "subY", "iWidth", "iHeight"]
  const [isDesktop] = useMediaQuery('(min-width: 500px)')

  return (
    <div>
      <h1>{title}:</h1>
      <canvas ref={canvasRef} id="canvas" width={`${isDesktop ? '800' : '700'}`} height="800"/>
      {
        ids.map((id, i) => <a id={id} key={`map-image-link-${i}`}/>)
      }
    </div>
  );
}
