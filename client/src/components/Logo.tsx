import { Link } from 'react-router-dom';

interface LogoProps {
  color?: string;
  onClick?: () => void;
}

export default function Logo({ color, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      style={{
        color: color || 'inherit',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 700,
      }}
    >
      <img width={40} height={40} src='/icon.svg' alt='' />
          <span style={{ fontSize: '1.1rem' }}>Portfolio</span>
    </Link>
  );
}
