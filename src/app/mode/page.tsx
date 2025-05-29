import Link from 'next/link';

export default function Mode() {

  return (
    <div>
      <h1>Choisissez un mode de jeu</h1>
      <div className="flex justify-center items-center">
        <Link href="/mode/dayList" className="border-t-neutral-500">Day List</Link>
      </div>
    </div>
  );
}