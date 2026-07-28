import BuildLogLayoutClient from "@/components/build-log/BuildLogLayoutClient";

export default function BuildLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BuildLogLayoutClient>{children}</BuildLogLayoutClient>;
}
