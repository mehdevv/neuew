import { create } from "zustand";

interface BlogState {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
}));

export interface Blog {
  archivedAt: number;
  archivedInDashboard: boolean;
  attachedStylesheets: string[];
  authorName: string;
  blogAuthorId: string;
  categoryId: number;
  contentGroupId: string;
  contentTypeCategory: number;
  created: string;
  createdById: string;
  currentState: string;
  currentlyPublished: boolean;
  domain: string;
  enableGoogleAmpOutputOverride: boolean;
  featuredImage?: string;
  featuredImageAltText?: string;
  htmlTitle: string;
  id: string;
  language: string;
  layoutSections: Record<string, unknown>;
  linkRelCanonicalUrl: string;
  metaDescription?: string;
  name: string; // title
  postBody: string;
  postSummary?: string;
  publicAccessRules: unknown[];
  publicAccessRulesEnabled: boolean;
  publishDate: string;
  publishImmediately: boolean;
  rssBody: string;
  rssSummary: string;
  slug: string;
  state: string;
  tagIds: string[];
  translations: Record<string, unknown>;
  updated: string;
  updatedById: string;
  url: string;
  useFeaturedImage: boolean;
  widgetContainers: Record<string, unknown>;
  widgets: Record<string, unknown>;
}
