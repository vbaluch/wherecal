import Link from "next/link";

export default function Header() {
  return (
    // TODO mark active
    <ul className="flex border-b">
      <li className="-mb-px mr-1">
        <Link href="/" passHref>
          <a className="bg-gray-800 hover:bg-gray-700 inline-block rounded-t py-2 px-4 text-white font-semibold">
            Me
          </a>
        </Link>
      </li>
      <li className="mr-1">
        <Link href="/friends" passHref>
          <a className="bg-gray-800 hover:bg-gray-700 inline-block rounded-t py-2 px-4 text-white font-semibold">
            Friends
          </a>
        </Link>
      </li>
      <li className="mr-1">
        <Link href="/more" passHref>
          <a className="bg-gray-800 hover:bg-gray-700 inline-block rounded-t py-2 px-4 text-white font-semibold">
            More
          </a>
        </Link>
      </li>
    </ul>
  );
}
