export default function Footer() {
  return (
    <footer className="mt-auto px-8 py-6 bg-gray-100 text-center border-t">
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} Local Store — All rights reserved.
      </p>
    </footer>
  );
}