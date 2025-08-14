import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: React.ReactNode;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// Inline icons (no extra deps)
function IconAlphabet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="6" height="6" rx="1.5"/>
        <rect x="10.5" y="3" width="6" height="6" rx="1.5"/>
        <rect x="18" y="3" width="3" height="6" rx="1.5"/>
        <rect x="3" y="10.5" width="6" height="6" rx="1.5"/>
        <rect x="10.5" y="10.5" width="6" height="6" rx="1.5"/>
        <rect x="18" y="10.5" width="3" height="6" rx="1.5"/>
        <rect x="3" y="18" width="6" height="3" rx="1.5"/>
        <rect x="10.5" y="18" width="6" height="3" rx="1.5"/>
        <rect x="18" y="18" width="3" height="3" rx="1.5"/>
      </g>
    </svg>
  );
}
function IconEnergy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"/>
        <circle cx="12" cy="12" r="9" opacity="0.15" />
      </g>
    </svg>
  );
}
function IconMoves(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M12 4v16M4 12h16"/>
        <path d="M8 2l2 2-2 2M16 2l-2 2 2 2M8 22l2-2-2-2M16 22l-2-2 2-2"/>
      </g>
    </svg>
  );
}
function IconCLI(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M7 9l3 3-3 3M12 16h5"/>
      </g>
    </svg>
  );
}

const FeatureList: FeatureItem[] = [
  { title: 'Alphabet (Base-27)', href: '/api/alphabet', Icon: IconAlphabet,
    description: <>Glyphs <code>0,a..z</code>, digit mapping, validation, conversions.</> },
  { title: 'Energy Model', href: '/api/energy', Icon: IconEnergy,
    description: <>SE9 & K-units with <code>K = 10.125</code>, faces/exposure, totals.</> },
  { title: 'Moves & Permutations', href: '/examples/moves', Icon: IconMoves,
    description: <>Rubik’s notation → 27-index permutations and applications.</> },
  { title: 'CLI & Couplers', href: '/cli', Icon: IconCLI,
    description: <>Run <code>livnium</code> locally; explore <code>couplers</code>, projections, and more.</> },
];

function Feature({title, description, href, Icon}: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.cardCol)}>
      <Link className={styles.card} to={href}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Icon className={styles.icon}/>
        </div>
        <div className={styles.textWrap}>
          <Heading as="h3" className={styles.title}>{title}</Heading>
          <p className={styles.desc}>{description}</p>
        </div>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Build with Livnium Core</Heading>
        <p className={styles.sectionSub}>
          Spatial alphabet, energy, permutations, and a focused CLI — all documented and tested.
        </p>
        <div className={clsx('row', styles.grid)}>
          {FeatureList.map((item, idx) => (
            <Feature key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
