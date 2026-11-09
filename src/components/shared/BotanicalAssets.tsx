'use client';

import React from 'react';

// StudyFlow 4-pointed sparkle/star logo
export function StudyFlowLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="1.5" fill="#F7F6F2" opacity="0.6" />
    </svg>
  );
}

// Cute cat sleeping/resting on stacked books with sparkle stars
export function CatOnBooksIllustration({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Sparkles */}
        <path d="M25 35L26 31L30 30L26 29L25 25L24 29L20 30L24 31L25 35Z" fill="#E8B86D" />
        <path d="M118 28L119 25L122 24L119 23L118 20L117 23L114 24L117 25L118 28Z" fill="#E8B86D" />
        <path d="M125 50L125.5 48L127 47.5L125.5 47L125 45L124.5 47L123 47.5L124.5 48L125 50Z" fill="#E8B86D" />

        {/* Floating Heart */}
        <path
          d="M112 14 C110 10, 105 10, 105 15 C105 19, 112 23, 112 23 C112 23, 119 19, 119 15 C119 10, 114 10, 112 14 Z"
          fill="#E5989B"
          opacity="0.85"
        />

        {/* Cat Body */}
        <g id="cat">
          {/* Back/Body */}
          <ellipse cx="68" cy="62" rx="34" ry="22" fill="#FFFFFF" stroke="#333333" strokeWidth="2.5" />
          {/* Back paw */}
          <ellipse cx="40" cy="74" rx="8" ry="5" fill="#FFFFFF" stroke="#333333" strokeWidth="2" />
          
          {/* Cat Head */}
          <ellipse cx="78" cy="52" rx="22" ry="18" fill="#FFFFFF" stroke="#333333" strokeWidth="2.5" />
          {/* Left Ear */}
          <path d="M64 40 L60 26 L73 35 Z" fill="#FFFFFF" stroke="#333333" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M64 38 L62 30 L69 35 Z" fill="#F8C0C8" />
          {/* Right Ear */}
          <path d="M83 36 L92 27 L92 41 Z" fill="#FFFFFF" stroke="#333333" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M85 36 L90 31 L90 40 Z" fill="#F8C0C8" />
          {/* Sleeping Eyes (curved lines) */}
          <path d="M68 53 Q72 57 76 53" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M82 53 Q86 57 90 53" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Nose & Mouth */}
          <path d="M78 57 L80 57 L79 59 Z" fill="#F8C0C8" />
          <path d="M76 60 Q79 63 82 60" stroke="#333333" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Whiskers */}
          <path d="M62 55 L52 54" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M62 58 L54 60" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M96 55 L106 54" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M96 58 L104 60" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="67" cy="58" r="3" fill="#F8C0C8" opacity="0.6" />
          <circle cx="91" cy="58" r="3" fill="#F8C0C8" opacity="0.6" />
          {/* Paws folded in front */}
          <ellipse cx="78" cy="71" rx="6" ry="4" fill="#FFFFFF" stroke="#333333" strokeWidth="2" />
          <ellipse cx="89" cy="71" rx="6" ry="4" fill="#FFFFFF" stroke="#333333" strokeWidth="2" />
        </g>

        {/* Stack of 3 Books */}
        <g id="books">
          {/* Top Book (Sage Green) */}
          <rect x="30" y="78" width="80" height="11" rx="2" fill="#DCE7DC" stroke="#333333" strokeWidth="2" />
          <line x1="36" y1="84" x2="104" y2="84" stroke="#8DAA96" strokeWidth="1.5" />
          <path d="M30 78 L26 83 L30 89" stroke="#333333" strokeWidth="2" fill="#FAF8F5" />

          {/* Middle Book (Warm Beige) */}
          <rect x="25" y="89" width="90" height="12" rx="2" fill="#EDE6DC" stroke="#333333" strokeWidth="2" />
          <line x1="32" y1="95" x2="110" y2="95" stroke="#C8BCA8" strokeWidth="1.5" />
          <path d="M25 89 L20 95 L25 101" stroke="#333333" strokeWidth="2" fill="#FAF8F5" />

          {/* Bottom Book (Deep Forest Green) */}
          <rect x="20" y="101" width="100" height="13" rx="2" fill="#315D47" stroke="#333333" strokeWidth="2" />
          <line x1="28" y1="108" x2="114" y2="108" stroke="#8DAA96" strokeWidth="1.5" />
          <path d="M20 101 L15 107 L20 114" stroke="#333333" strokeWidth="2" fill="#FAF8F5" />
        </g>
      </svg>
    </div>
  );
}

// Plant pot with lush leaves resting on books (used in Project Detail & Calendar cards)
export function PlantOnBooksIllustration({ className = 'w-44 h-36' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft background aura */}
        <circle cx="140" cy="70" r="50" fill="#E8EFE9" opacity="0.6" />

        {/* Plant Leaves */}
        <g id="leaves">
          {/* Main Stems */}
          <path d="M135 75 Q120 45 95 35" stroke="#315D47" strokeWidth="2.5" fill="none" />
          <path d="M140 75 Q145 35 155 20" stroke="#315D47" strokeWidth="2.5" fill="none" />
          <path d="M145 75 Q170 45 185 40" stroke="#315D47" strokeWidth="2.5" fill="none" />
          <path d="M135 80 Q110 70 85 75" stroke="#315D47" strokeWidth="2" fill="none" />

          {/* Leaf 1 */}
          <path d="M95 35 C80 30 75 45 95 48 C105 40 100 35 95 35 Z" fill="#4B7B5E" />
          {/* Leaf 2 */}
          <path d="M110 40 C105 25 125 20 125 35 C120 40 115 42 110 40 Z" fill="#6A977B" />
          {/* Leaf 3 (Top) */}
          <path d="M155 20 C150 5 170 8 168 22 C162 25 158 22 155 20 Z" fill="#3D684E" />
          {/* Leaf 4 */}
          <path d="M140 38 C145 28 160 30 156 42 C150 44 142 42 140 38 Z" fill="#8DAA96" />
          {/* Leaf 5 */}
          <path d="M185 40 C198 38 200 55 185 54 C178 50 180 42 185 40 Z" fill="#4B7B5E" />
          {/* Leaf 6 */}
          <path d="M165 52 C180 55 175 70 162 65 C158 60 160 55 165 52 Z" fill="#6A977B" />
          {/* Leaf 7 (hanging left) */}
          <path d="M85 75 C72 70 70 88 88 85 C92 80 88 75 85 75 Z" fill="#588568" />
        </g>

        {/* White Ceramic Pot */}
        <g id="pot">
          <ellipse cx="140" cy="76" rx="20" ry="4" fill="#EAE6DF" stroke="#D1CCC2" strokeWidth="1" />
          <path d="M122 77 L126 112 Q140 116 154 112 L158 77 Z" fill="#FFFFFF" stroke="#E2DED5" strokeWidth="1.5" />
          <ellipse cx="140" cy="77" rx="18" ry="3.5" fill="#3E342B" />
        </g>

        {/* Books under the pot */}
        <g id="books_base">
          {/* Book 1 */}
          <rect x="50" y="112" width="120" height="15" rx="3" fill="#F4EFE6" stroke="#C8BCA8" strokeWidth="1.5" />
          <line x1="58" y1="120" x2="162" y2="120" stroke="#DDD2C1" strokeWidth="1.5" />
          <path d="M50 112 L44 119 L50 127" stroke="#C8BCA8" strokeWidth="1.5" fill="#FAF8F5" />

          {/* Book 2 */}
          <rect x="35" y="127" width="145" height="18" rx="3" fill="#202923" stroke="#161E19" strokeWidth="1.5" />
          <line x1="45" y1="136" x2="170" y2="136" stroke="#8DAA96" strokeWidth="1.5" opacity="0.7" />
          <path d="M35 127 L28 136 L35 145" stroke="#161E19" strokeWidth="1.5" fill="#E8E2D5" />
        </g>
      </svg>
    </div>
  );
}

// Elegant Botanical Vine / Branch for sidebar and cards
export function BotanicalBranch({ className = 'w-16 h-28' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 135 C35 100, 45 60, 40 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      {/* Leaf pairs */}
      <path d="M38 100 C20 95, 15 110, 32 112 Z" fill="currentColor" opacity="0.35" />
      <path d="M42 90 C60 85, 65 100, 48 102 Z" fill="currentColor" opacity="0.35" />
      <path d="M41 65 C22 60, 20 75, 36 76 Z" fill="currentColor" opacity="0.4" />
      <path d="M42 55 C62 50, 65 65, 47 66 Z" fill="currentColor" opacity="0.4" />
      <path d="M41 30 C25 25, 26 40, 38 40 Z" fill="currentColor" opacity="0.45" />
      <path d="M41 22 C56 18, 58 32, 44 32 Z" fill="currentColor" opacity="0.45" />
      <path d="M40 10 C36 2, 44 2, 40 10 Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
