import { Locale } from './i18n';
import type { TestimonialsData } from '@/types/testimonials';

// Translation file type definitions
export interface Dictionary {
  site: {
    name: string;
    description: string;
    url: string;
    email: string;
    author: string;
    logo: string;
    copyright: string;
    tagline: string;
  };
  social: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
  nav: {
    home: string;
    features: string;
    pricing: string;
    blog: string;
    about: string;
    contact: string;
    cases: string;
    blocks: string;
  };
  header: {
    navigation: Array<{
      name: string;
      href: string;
    }>;
    cta: {
      text: string;
      href: string;
    };
  };
  footer: {
    sections: Array<{
      title: string;
      links: Array<{
        name: string;
        href: string;
      }>;
    }>;
  };
  common: {
    buttons: {
    documentation: string;
    documentationUrl: string;
    learnMore: string;
    getStarted: string;
    readMore: string;
    contactSales: string;
    startFreeTrial: string;
      viewDocumentation: string;
      scheduleDemo: string;
      getStartedFree: string;
      getStartedNow: string;
      getStartedToday: string;
      viewDemo: string;
      sendMessage: string;
    };
    navigation: {
      backToHome: string;
      backToCases: string;
    };
    states: {
      loading: string;
      sending: string;
      error: string;
    };
    pricing: {
    perMonth: string;
    unlimited: string;
    popular: string;
    };
    common: {
    yes: string;
    no: string;
    switchLanguage: string;
    toggleTheme: string;
    };
  };
  shared: {
    heroFeatures: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    formSubjects: string[];
    supportSubjects: string[];
    commonFaqs: Array<{
      question: string;
      answer: string;
    }>;
    companyStats: Array<{
      value: string;
      label: string;
    }>;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
    };
    bottomCta: {
      title: string;
      description: string;
      trustIndicators: string[];
    };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    socialProof: {
      trustedByDevelopers: string;
      readyComponents: string;
      shipInMinutes: string;
    };
  };
  root: {
    detectingLanguage: string;
  };
  contact: {
    pageTitle: string;
    pageSubtitle: string;
    getInTouch: string;
    description: string;
    quickLinks: {
      title: string;
      description: string;
      viewFeatures: string;
      viewPricing: string;
      browseComponents: string;
    };
    socialProof: {
      title: string;
      description: string;
    };
    bottomCta: {
      title: string;
      description: string;
      viewDocs: string;
    };
    info: {
      email: {
        title: string;
        description: string;
      };
      phone: {
        title: string;
        description: string;
      };
      address: {
        title: string;
        description: string;
      };
      hours: {
        title: string;
        description: string;
      };
    };
    form: {
      title: string;
      description: string;
      thankYouMessage: string;
      errorMessage: string;
    };
  };
  
  form: {
    labels: {
      fullName: string;
      emailAddress: string;
      company: string;
      subject: string;
      message: string;
    };
    placeholders: {
      fullName: string;
      email: string;
      company: string;
      selectSubject: string;
      message: string;
    };
    optional: string;
    required: string;
  };

  features: {
    title: string;
    description: string;
    andMoreText: string;
    componentsLinkText: string;
    page: {
      badge: string;
      title: string;
      subtitle: string;
      supportBadge: string;
      supportTitle: string;
      supportSubtitle: string;
      statsTitle: string;
      statsDescription: string;
      stats: Array<{
        value: string;
        suffix?: string;
        label: string;
      }>;
      ctaTitle: string;
      ctaDescription: string;
      featureCategories: Array<{
        category: string;
        description: string;
        features: Array<{
          icon: string;
          title: string;
          description: string;
          benefits: string[];
        }>;
      }>;
      supportFeatures: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    main: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  pricing: {
    badge: string;
    title: string;
    pageSubtitle: string;
    mostPopular: string;
    ctaTitle: string;
    ctaDescription: string;
    description: string;
    monthlyBilling: string;
    annualBilling: string;
    discount: string;
    plans: Array<{
      name: string;
      price: string;
      originalPrice: string;
      period: string;
      description: string;
      features: string[];
      limitations: string[];
      popular: boolean;
      buttonText: string;
      buttonVariant: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    comparison: {
      title: string;
      description: string;
      tableHeaders?: {
        features: string;
        starter: string;
        professional: string;
        enterprise: string;
      };
      planPricing?: {
        starter: string;
        professional: string;
        enterprise: string;
      };
      features: Array<{
        category: string;
        items: Array<{
          name: string;
          starter: string | boolean;
          professional: string | boolean;
          enterprise: string | boolean;
        }>;
      }>;
    };
  };
  about: {
    pageTitle: string;
    pageSubtitle: string;
    heroTitle: string;
    heroHighlight: string;
    storyTitle: string;
    storyContent: string[];
    valuesTitle: string;
    valuesSubtitle: string;
    values: Array<{
      title: string;
      description: string;
    }>;
    teamTitle: string;
    teamSubtitle: string;
    team: Array<{
      name: string;
      role: string;
      avatar: string;
      bio: string;
    }>;
  };
  cases: {
    pageTitle: string;
    heroTitle: string;
    heroHighlight: string;
    pageSubtitle: string;
    shareYourStory: string;
    shareSubtitle: string;
    submitYourCase: string;
    viewDetails: string;
    keyResult: string;
    ctaTitle: string;
    ctaSubtitle: string;
    discussYourProject: string;
    detail: {
      theChallenge: string;
      ourSolution: string;
      keyResults: string;
      technologiesUsed: string;
      cta: {
        title: string;
        description: string;
        getInTouch: string;
        viewMoreCases: string;
      };
    };
  };
  faq: {
    title: string;
    description: string;
    stillHaveQuestions: string;
    contactSupport: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  testimonials: TestimonialsData;
  stats: {
    businessMetrics: Array<{
      value: string;
      label: string;
      suffix?: string;
      prefix?: string;
      color?: string;
    }>;
    productStats: {
      title: string;
      stats: Array<{
        value: string;
        label: string;
        suffix?: string;
        prefix?: string;
        color?: string;
      }>;
    };
  };

  blog: {
    pageTitle: string;
    pageSubtitle: string;
    noPosts: {
      title: string;
      description: string;
      instructions: {
        line1: string;
        directory: string;
        line2: string;
        line3: string;
      };
    };
    article: {
      thanksMessage: string;
      readMoreArticles: string;
      readTime: string;
    };
  };
  metadata: {
    siteName: string;
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string;
    author: string;
    creator: string;
    twitterCreator: string;
  };
  highlights: {
    keywords: Array<{
      key: string;
      value: string;
    }>;
  };
}

export interface BlocksDictionary {
  blocks: {
    title: string;
    description: string;
    preview: string;
    code: string;
    copy: string;
    viewInSeparateWindow: string;
    documentation: string;
    codeExample: string;
    componentPreview: string;
    usageInstructions: string;
    usageDescription: string;
    noPreviewAvailable: string;
    categories: Array<{
      name: string;
      id: string;
      components: Array<{
        id: string;
        name: string;
        description: string;
        category: string;
        previewUrl?: string;
        preview: {
          title: string;
          description: string;
          code: string;
        };
      }>;
    }>;
  };
}

// Translation file path mapping
const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  zh: () => import('../../dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    return await dictionaries[locale]();
  } catch (error) {
    console.warn(`Failed to load dictionary for locale: ${locale}, fallback to en`);
    return await dictionaries.en();
  }
}; 

const blocksDictionaries = {
  en: () =>
    import("../../dictionaries/blocks-en.json").then((module) => module.default),
  zh: () =>
    import("../../dictionaries/blocks-zh.json").then((module) => module.default),
};
export const getBlocksDictionary = async (locale: Locale): Promise<BlocksDictionary> => {
  try {
    return await blocksDictionaries[locale]();
  } catch (error) {
    console.warn(`Failed to load blocks dictionary for locale: ${locale}, fallback to en`);
    return await blocksDictionaries.en();
  }
};