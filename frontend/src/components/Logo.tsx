import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Truest Assist Logo"
        width={300}
        height={64}
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
