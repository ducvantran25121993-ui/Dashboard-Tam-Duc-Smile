export interface TransparencyAdItem {
  id: string;
  advertiserName: string;
  legalEntity: string;
  domain: string;
  isVerified: boolean;
  format: 'video' | 'text' | 'image';
  platform: 'Google Search' | 'YouTube' | 'Google Display Network' | 'Performance Max';
  firstSeen: string;
  lastSeen: string;
  firstSeenTimestamp?: number;
  daysAgo?: number;
  isNewDetected?: boolean;
  impressionsEstimate?: string;
  adDimensions?: string;
  category: 'implant' | 'ortho' | 'porcelain' | 'general';
  
  // Media / Visual Ad Configuration
  visual?: {
    theme: 'navy_gold' | 'harvard_gold' | 'clinic_blue' | 'invisalign_cyan' | 'flag_us' | 'white_clean' | 'dark_luxury';
    brandLogoText?: string;
    subBadgeText?: string;
    topBadgeText?: string;
    headlineMain: string;
    subHeadline?: string;
    highlightPill?: string;
    photoType?: 'harvard_group' | 'doctor_guide' | 'aligner_girl' | 'viet_kieu_smile' | 'big4_trust' | 'surgery_room' | 'senior_couple' | 'porcelain_smile' | 'implant_lunch_hour' | 'viet_kieu_smile_2' | 'vung_tau_clinic' | 'implant_senior_male';
    duration?: string;
    imageUrl?: string;
    videoScript?: string;
  };

  // Search Text Ad Configuration
  searchAd?: {
    displayDomain: string;
    path: string;
    headline: string;
    description: string;
    sitelinks: string[];
    callouts: string[];
  };

  // AI Spy & Counter Strategy
  intel: {
    campaignGoal: string;
    psychologicalHook: string;
    targetAudience: string;
    estimatedDailySpend: string;
    competitorWeakness: string;
    counterAdTemplate: {
      headline: string;
      description: string;
      sitelinks: string[];
      biddingAdvice: string;
      uniqueSellingPoint: string;
    };
  };
}

export interface TransparencyDomainProfile {
  domain: string;
  brandName: string;
  legalEntity: string;
  approxActiveAds: number;
  isVerified: boolean;
  description: string;
  primaryServices: string[];
  ads: TransparencyAdItem[];
}
