import React from "react";

const withContainer = (WrappedContainer, IsBackgroundColorChange) => {
  // eslint-disable-next-line react/display-name
  return (props) => { // Enhanced Component, props will be passed to orginal component when using Enhanced Component
    return (
      <div
        className="container"
        style={{ background: IsBackgroundColorChange === true ? "#f5f5f5" : "" }}
      >
        <WrappedContainer {...props}>
          {props.children}
        </WrappedContainer>
      </div>
    );
  };
};

export default withContainer;
