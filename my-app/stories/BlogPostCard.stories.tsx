// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";

import { BlogPostCard } from "@/components/blog/blog-post-card";

const meta: Meta<typeof BlogPostCard> = {
  title: "Blog/PostCard",
  component: BlogPostCard,
  args: {
    post: {
      id: "1",
      slug: "launch-creative",
      title: "How we ship production-ready landing pages in days",
      excerpt:
        "A behind-the-scenes walkthrough of our Next.js, Supabase, and shadcn/ui stack.",
      cover_image_url: "/images/post-placeholder.svg",
      created_at: new Date().toISOString(),
      content: "<p>Preview content for the story.</p>",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BlogPostCard>;

export const Default: Story = {};
export const Compact: Story = {
  args: {
    variant: "compact",
  },
};
