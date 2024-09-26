import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white font-bold">Games</div>
        <div>
          <Link href="/" className="text-gray-300 hover:text-white px-4">Overview</Link>
          <Link href="/game" className="text-gray-300 hover:text-white px-4">Games</Link>
          <Link href="/best_game" className="text-gray-300 hover:text-white px-4">Best Games</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
