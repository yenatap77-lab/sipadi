/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const RiceFieldBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#0a1a0f] text-slate-800 overflow-x-hidden">
      {/* Background persawahan padi asri Nusantara */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-screen filter brightness-95"
        style={{
          backgroundImage: `url('/src/assets/images/rice_field_panoramic_1792235985479.jpg')`
        }}
      />

      {/* Agrarian gradient overlay: Hijau tua khas pertanian & aksen keemasan padi */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#0d2616]/90 via-[#0a1a0f]/80 to-[#07130a]/95" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.12),transparent_70%)]" />

      {/* Main app content wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
};
