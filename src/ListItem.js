import React from 'react';

export default function ListItem({ address, username, post }) {
  return (
    <li className="py-5">
      <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
        <h3 className="text-sm font-semibold text-gray-800">
          <a href="#" className="hover:underline focus:outline-none">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            {username}
          </a>
        </h3>
        <h3 className="text-sm font-semibold text-gray-800">
          <a href="#" className="hover:underline focus:outline-none">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            {address}
          </a>
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post}</p>
      </div>
    </li>
  );
}
