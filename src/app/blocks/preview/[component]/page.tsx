import { notFound } from "next/navigation";
import { ComponentPreviewClient } from "./component-preview-client";

interface PreviewPageProps {
  params: Promise<{
    component: string;
  }>;
}

// All available components list - keep in sync with componentMap in component-preview-client.tsx
const AVAILABLE_COMPONENTS = [
  'button',
  'card', 
  'badge',
  'feature-card',
  'feature-card-detailed',
  'support-card',
  'case-showcase-grid',
  'component-showcase',
  'header',
  'footer',
  'hero',
  'features',
  'pricing',
  'testimonials',
  'faq',
  'case-study-card',
  'blog-card',
  'content-section',
  'cta-section',
  'stats-section',
  'contact-form'
] as const;

export default async function ComponentPreview({ params }: PreviewPageProps) {
  const { component } = await params;
  // const { component } = params;
  
  // Check if component exists in available components list
  if (!AVAILABLE_COMPONENTS.includes(component as any)) {
    notFound();
  }
  
  return <ComponentPreviewClient component={component} />;
}

// Generate static parameters - automatically get all components from available components list
export async function generateStaticParams() {
  return AVAILABLE_COMPONENTS.map((component) => ({
    component,
  }));
} 