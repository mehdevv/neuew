export interface AgencyUser {
  id: number;
  nom: string;
  prenom: string;
  pseudo: string;
  denomination: string;
  email: string;
  reg_com: string;
  wilaya: string;
  commune: string;
  abonnement: string;
  etat: string;
  tlfn: string;
  adresse: string;
  domaine: string;
  duree_abn: string;
  paiement: string;
  profile_img: string;
  reg_com_file: string;
  url_fb: string | null;
  url_ytb: string | null;
  url_insta: string | null;
  url_web: string | null;
  created_at: string;
  updated_at: string;
  abn_expires_at: string;
}

export interface AgencySubcategory {
  name: string;
  announcements: Announcement[];
}

export interface Comment {
  id: number;
  interaction_id: number;
  content: string;
  edited: number; // 0 or 1
  created_at: string;
  updated_at: string;
  laravel_through_key?: number;
}

export interface Interaction {
  id: number;
  announcement_id: number;
  voyageur_id: number;
  liked: number; // 0 or 1
  bookmarked: number; // 0 or 1
  rating: number | null; // nullable, between 1-5
  created_at: string;
  updated_at: string;
  voyageur: {
    id: number;
    name: string;
    profile_photo_path: string | null;
    comments?: Comment[]; // Comments are nested in voyageur
  };
}

export interface AnnouncementInteractionsResponse {
  message: string;
  data: {
    current_page: number;
    data: Interaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface Like {
  id: number;
  announcement_id: number;
  voyageur_id: number;
  liked: number;
  bookmarked: number;
  rating: number | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  storeuser_id: string | number;
  categorie_id: number;
  subcategorie_id: number;
  tags: string[]; // Array of tag strings
  titre: string;
  destination: string[]; // Array of destination strings
  date_dep: string[]; // Array of departure date strings
  pays_dep?: string | null;
  date_arv: string[]; // Array of arrival date strings
  pays_arv?: string | null;
  wilaya_dep: string;
  lieu_dep: string;
  description: string;
  prix: string;
  photos: string[]; // Array of photo paths
  hebergement_id: number;
  etat: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  comments_count?: number;
  subcategory: Subcategory;
  category: Category;
  hebergement: Hebergement;
  store: AgencyUser;
  interactions?: Interaction[];
  likes?: Like[];
}

export interface Subcategory {
  id: number;
  name: string;
  categorie_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Hebergement {
  id: number;
  name: string;
  residence?: string;
  lieu?: string;
  chambre?: string;
  created_at?: string;
  updated_at?: string;
}
