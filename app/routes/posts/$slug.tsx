import type { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {json} from "@remix-run/node"
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

type LoaderData = {
    title : String
}
export const loader : LoaderFunction = async  ({params}) => {
    const {slug} = params
   invariant(slug, "slug is empty")
    const post =await getPost(slug)
    invariant(post, "post is empty")
    return json<LoaderData>({title : post.title})
}



export default function PostsRoute(){
    const {title} = useLoaderData() as LoaderData;

return (
    <main>
        <h1>{title}</h1>
    </main>
)

}