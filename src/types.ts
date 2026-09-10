export interface EvidenceImage {
  filename: string;
  src?: string;
  alt: string;
  label?: string;
}

export interface EvidenceBlock {
  id: string;
  title: string;
  description: string;
  images: EvidenceImage[];
}

export interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: number; // timestamp in ms
  roleBadge?: string;
  likes?: number;
  likedBy?: string[];
}

