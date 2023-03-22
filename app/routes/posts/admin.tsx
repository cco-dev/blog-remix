import { LoaderFunction, json } from "@remix-run/node";
import { AwaitProps, Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPostsListings } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

export const loader : LoaderFunction = async (request) => {
   await requireAdminUser(request.request);
  return json<LoaderData>({ posts: await getPostsListings() });

  
};

type LoaderData = {
    posts : Awaited<ReturnType< typeof getPostsListings>>
}

export default function PostAdmin() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
        Blog Admin
      </h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.slug}
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}
