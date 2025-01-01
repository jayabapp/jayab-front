import React from "react";

const CreateMarker = ({ url }: { url: string }) => {
  const el = document.createElement("div");
  const width = 60;
  const height = 34;
  el.className = "marker";

  el.style.backgroundImage = `url(${url})`;
  el.style.backgroundRepeat = `no-repeat`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = "100%";

  return el;
};

export default CreateMarker;
