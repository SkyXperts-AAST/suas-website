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
    href: "https://makerselectronics.com/?srsltid=AfmBOoqR7kv64ba_YOVypyLAAHuTBr_A8cD0e9dlSMks51Lm-p8DWoKk",
  },
  {
    name: "PCBWay",
    logoSrc: "/sponsor-pcbway.webp",
    href: "https://www.pcbway.com",
  },
];

export const SPONSORSHIP_PROPOSAL_PDF = "/sponsorship-proposal.pdf";
