import { Form, useActionData,useCatch,useLoaderData,useTransition } from "@remix-run/react";
import { ActionFunction, LoaderFunction, json ,} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createPost, deletePost, getPost, updatePost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/session.server";


const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader : LoaderFunction = async ({request , params}) => {


    await requireAdminUser (request)
    invariant(params.slug , "slug is required")

    if(params.slug === "new")
    return json({})
    const post =await getPost(params.slug)

    if (!post)
    throw new Response("Not Found" , {status : 404})

    return json({post})
    
}

export const action : ActionFunction = async ({request , params}) => {
    await requireAdminUser (request)
    const formdata =await request.formData();
    const intent = formdata.get("intent")
    invariant(params.slug , "slug is required")
    if(intent ==="delete")
    {
      await deletePost(params.slug)
      return redirect("/posts/admin")
    }

    
    const title = formdata.get("title");
    const slug  = formdata.get("slug");

    const errors = {
         title :title ? null : "title is null",
         slug : slug ? null : "slug is null"
    }

   const haserors = Object.values(errors).some(a=>a)

   if(haserors)
   return json(errors)

   invariant(typeof title === "string", "title is not string")
   invariant(typeof slug === "string", "slug is not string")
if(params.slug === "new")
    await createPost({title , slug})
else
 await updatePost(params.slug ,{title , slug})
    return redirect("/posts/admin")
}

export default function NewPostRoute() {
  const data = useLoaderData();
    const errors =  useActionData()

   
    const transition = useTransition()
    const isCreating = transition.submission?.formData.get("intent") === "create"
    const isUpdating = transition.submission?.formData.get("intent") === "update"
    const isDeleting = transition.submission?.formData.get("intent") === "delete"
    const isNewpost = !data.post
  return (
    <Form method="post" key={data.post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:{" "}{errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.post?.title }
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.post?.slug }
          />
        </label>
      </p>
    
      <div className="text-right">
        {
          isNewpost? null : 
      <button
      type="submit"
      className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
      name="intent"
      value={"delete"}
      disabled = {isCreating}
    >
     
     {isDeleting? "Deleting" : "Delete Post"} 
    </button>
        }


        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          name="intent"
          value={isNewpost? "create" : "update"}
          disabled = {isCreating}
        >
         {isNewpost? ( isCreating? "Creating ..." : "Create Post") : null} 
         {isNewpost? null : ( isUpdating? "Updating" : "Update Post")} 
        </button>
      </div>
    </Form>
  );
}
 export function CatchBoundary(){
  const cought = useCatch()
  if(cought.status===404)
return <div>NO Slug</div>
throw new Error(`Unsuppoted status code ${cought.status}`)
 }


 export function ErrorBoundary(error)
 {

return <div>ERROR CC : {error.error.message}</div>


 }