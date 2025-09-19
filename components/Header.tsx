import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black w-full flex justify-center p-4">
      <Image
        src="/logo-header.jpeg"
        alt="Masterpiece Empire Header"
        width={1200}
        height={150}
        unoptimized
      />
    </header>
  );
}
