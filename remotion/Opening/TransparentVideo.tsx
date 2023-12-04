import React from "react";
import { OffthreadVideo } from "remotion";

// TODO: Fix this
const IS_SAFARI = false;

export const TransparentVideo: React.FC<{
  safari: string;
  other: string;
}> = ({ safari, other }) => {
  if (IS_SAFARI) {
    return <OffthreadVideo transparent src={safari} />;
  }

  return <OffthreadVideo transparent src={other} />;
};
