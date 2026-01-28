export interface ChatParagraph {
  text: string;
  emphasis?: string[];
}

export interface ChatContent {
  paragraphs: ChatParagraph[];
  follow_up_question: string | null;
}

export interface ChatFilters {
  enabled: boolean;
  params: {
    query?: string;
    destination?: string;
    destinations?: string[];
    category?: string;
    subcategory?: string;
    prix_start?: string;
    prix_end?: string;
    date_start?: string;
    date_end?: string;
  };
  search_keywords?: string[]; // 5 semantically similar keywords for comprehensive search
}

export interface ChatBlogResult {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string | null;
}

export interface ChatBlogs {
  enabled: boolean;
  results: ChatBlogResult[];
}

export interface ChatPostResult {
  id: number;
  title: string;
  destinations: string[];
  description: string;
  price: string;
  photo: string | null;
  category: string | null;
  subcategory: string | null;
  agency: string | null;
}

export interface ChatPosts {
  enabled: boolean;
  results: ChatPostResult[];
}

export interface ChatSuggestion {
  label: string;
  value: string;
  icon?: string;
}

export interface ChatResponse {
  content: ChatContent;
  filters: ChatFilters;
  blogs: ChatBlogs;
  posts?: ChatPosts;
  suggestions: ChatSuggestion[];
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  data?: ChatResponse;
}

