import React from 'react';
import { SvgXml } from 'react-native-svg';

const svgXml = `
<svg viewBox="0 0 240 215" xmlns="http://www.w3.org/2000/svg">

  <!-- Arc bleu principal — C symétrique ouvert à droite -->
  <path
    d="M 196 28 A 88 88 0 1 0 196 172"
    fill="none" stroke="#1A3A8C" stroke-width="14" stroke-linecap="round"
  />

  <!-- Swoosh bas jaune (intérieur du cercle, bas) -->
  <path
    d="M 54 158 Q 108 190 172 158"
    fill="none" stroke="#F5C200" stroke-width="7" stroke-linecap="round"
  />

  <!-- Courbe jaune (intérieur, haut droite) -->
  <path
    d="M 168 32 Q 196 55 196 82"
    fill="none" stroke="#F5C200" stroke-width="6" stroke-linecap="round"
  />

  <!-- DOKO blanc -->
  <text x="120" y="97"
    text-anchor="middle"
    font-size="40" font-weight="900"
    fill="#FFFFFF"
    font-family="Arial, sans-serif"
    letter-spacing="2">DOKO</text>

  <!-- LIVRAISON jaune -->
  <text x="120" y="124"
    text-anchor="middle"
    font-size="16" font-weight="700"
    fill="#F5C200"
    font-family="Arial, sans-serif"
    letter-spacing="3">LIVRAISON</text>

  <!-- Fourgon 1 -->
  <g transform="translate(22,162) scale(0.5)">
    <rect x="0" y="2" width="78" height="36" rx="5" fill="#F5C200"/>
    <path d="M78 12 L100 12 L112 26 L112 38 L78 38 Z" fill="#F5C200"/>
    <circle cx="18" cy="42" r="8" fill="#1A3A8C"/>
    <circle cx="60" cy="42" r="8" fill="#1A3A8C"/>
    <circle cx="97" cy="42" r="8" fill="#1A3A8C"/>
  </g>

  <!-- Fourgon 2 (grand) -->
  <g transform="translate(84,160) scale(0.56)">
    <rect x="0" y="0" width="88" height="40" rx="5" fill="#F5C200"/>
    <path d="M88 12 L116 12 L128 28 L128 40 L88 40 Z" fill="#F5C200"/>
    <circle cx="20" cy="46" r="9" fill="#1A3A8C"/>
    <circle cx="68" cy="46" r="9" fill="#1A3A8C"/>
    <circle cx="108" cy="46" r="9" fill="#1A3A8C"/>
  </g>

  <!-- Plateau 3 -->
  <g transform="translate(152,163) scale(0.5)">
    <rect x="0" y="10" width="55" height="28" rx="4" fill="#F5C200"/>
    <rect x="55" y="0" width="40" height="38" rx="4" fill="#F5C200"/>
    <circle cx="15" cy="42" r="8" fill="#1A3A8C"/>
    <circle cx="72" cy="42" r="8" fill="#1A3A8C"/>
  </g>

</svg>
`;

interface Props {
  width?: number;
  height?: number;
}

export default function DokoLogo({ width = 240, height = 215 }: Props) {
  return <SvgXml xml={svgXml} width={width} height={height} />;
}
