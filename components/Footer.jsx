export default function Footer() {
  return (
    <footer className="mt-auto px-8 py-6 bg-gradient-to-r from-green-600 to-green-400 text-center">
      <p className="text-white font-medium">
        &copy; {new Date().getFullYear()} Prodigy Store — All rights reserved.
      </p>
    </footer>
  );
}