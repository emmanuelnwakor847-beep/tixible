import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    tagline: z.string(),
    status: z.enum(['flagship-live', 'in-development', 'planned']),
    statusLabel: z.string(),
    icon: z.string().optional(),
    iconInitials: z.string().optional(),
    accentFrom: z.string(),
    accentTo: z.string(),
    summary: z.string(),
    audience: z.array(z.object({ title: z.string(), description: z.string() })),
    features: z.array(z.object({ title: z.string(), description: z.string() })),
    flagship: z.boolean().default(false),
    publishDate: z.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Emmanuel Chukwunweike Nwakor'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, blog };
