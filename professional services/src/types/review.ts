export interface FirmReview {
  id: string;
  firmId: string;
  firmName: string;
  authorName: string;
  authorBusiness: string;
  authorCountry: string;
  rating: number; // 1 to 5
  serviceEngaged: string;
  title: string;
  comment: string;
  createdAt: string;
  verifiedClient: boolean;
  helpfulCount: number;
}

export interface FirmReviewAggregate {
  firmId: string;
  rating: number; // e.g. 4.9
  reviewCount: number; // e.g. 385
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: FirmReview[];
}
