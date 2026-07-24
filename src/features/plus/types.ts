export interface PlusBenefit {
  id: string;
  title: string;
  description: string;
}

export interface PlusPageData {
  tagline: string;
  headline: string;
  description: string;
  benefits: PlusBenefit[];
}
