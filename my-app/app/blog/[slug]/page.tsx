import { getPostBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
    </div>
  );
}
