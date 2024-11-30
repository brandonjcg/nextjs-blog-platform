import Link from "next/link";

interface NavbarProps {
  username: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { username, onLogout } = props;

  return (
    <header className="bg-white shadow-md py-4">
      <nav className="container mx-auto flex justify-end items-center space-x-6">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Home
        </Link>
        {!username ? (
          <>
            <Link
              href="/signup"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Signup
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">Welcome, {username}!</span>
            <Link
              href="/"
              className="text-sm font-medium text-red-600 hover:underline"
              onClick={onLogout} // Call the onLogout function when clicked
            >
              Logout
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
