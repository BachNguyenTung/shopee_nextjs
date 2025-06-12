import React from "react";
import {cn} from "@shoppe_nextjs/utils/utils";

const withContainer = (WrappedContainer, IsBackgroundColorChange) => {
  // eslint-disable-next-line react/display-name
  return (props) => { // Enhanced Component, props will be passed to orginal component when using Enhanced Component
    return (
      <div
        className={cn(
          "container",
          IsBackgroundColorChange ? "bg-[#f5f5f5]" : ""
        )}
      >
        <WrappedContainer {...props}>
          {props.children}
        </WrappedContainer>
      </div>
    );
  };
};

export default withContainer;
