// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";

import { Hero } from "@/components/hero";

const meta: Meta<typeof Hero> = {
  title: "Marketing/Hero",
  component: Hero,
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  render: () => <Hero />,
};
