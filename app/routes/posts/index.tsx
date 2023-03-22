import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPostsListings } from "~/models/post.server";
import { useOptionalUser } from "~/utils";

type LoaderData = {
    posts : Awaited<ReturnType<typeof getPostsListings>>
}

export const loader: LoaderFunction =async () => {
   const posts = await getPostsListings();
    return json<LoaderData>({posts});

};

export default function PostsRoute(){


const {posts} =useLoaderData<LoaderData>()
const user = useOptionalUser();

const isAdmin = user?.email ===ENV.ADMIN_EMAIL;


return (
        <main>
            <h1>POSTS</h1>
            <ul>
            {isAdmin ? <Link to="admin" className="text-red-600 underline">
  Admin
</Link> : null}
            
                {posts.map((post)=>(
                    <li key={post.slug}>
                        <Link to={post.slug} className="text-blue-600 underline" prefetch="intent">
                            {post.title}
                        </Link>

                    </li>
                ))}

            </ul>
        </main>
    )
}