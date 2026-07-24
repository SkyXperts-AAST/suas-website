export type Sponsor = {
  name: string;
  /** Path under /public — leave undefined to render a text placeholder slot. */
  logoSrc?: string;
  /** External website. Use "#" until the real URL is confirmed. */
  href: string;
};

export const SPONSORS: Sponsor[] = [
  {
    name: "Makers",
    logoSrc: "/sponsor-makers.png",
    // TODO: add sponsor website URL
    href: "#",
  },
  {
    name: "PCBWay",
    logoSrc: "/sponsor-pcbway.webp",
    href: "https://www.pcbway.com",
  },
];

export const SPONSORSHIP_PROPOSAL_PDF = "/sponsorship-proposal.pdf";
