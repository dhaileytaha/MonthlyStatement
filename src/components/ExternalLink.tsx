import React from 'react';

interface ExternalLinkProps {
  children: React.ReactNode;
  href: string;
  style?: React.CSSProperties;
}

export const ExternalLink = ({ children, href, style }: ExternalLinkProps) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  );
};
