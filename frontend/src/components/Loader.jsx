const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="text-xl font-bold">
          CarbonXchange
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-8">
          <a href="/" className="text-gray-700 hover:text-black">
            Home
          </a>

          <a href="/projects" className="text-gray-700 hover:text-black">
            Projects
          </a>

          <a href="/marketplace" className="text-gray-700 hover:text-black">
            Marketplace
          </a>

          <a href="/about" className="text-gray-700 hover:text-black">
            About
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg border px-4 py-2">
            Login
          </button>

          <button className="rounded-lg bg-black px-4 py-2 text-white">
            Connect Wallet
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
