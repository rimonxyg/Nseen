export interface CopyData {
  hero: {
    eyebrow: string;
    title: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    trustText: string;
  };
  bento: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tiles: Array<{
      id: string;
      title: string;
      tag: string;
      summary: string;
      details: string;
    }>;
  };
  download: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    checksumTitle: string;
    copyHash: string;
    hashCopied: string;
    nonAndroidTitle: string;
    nonAndroidDesc: string;
    downloadAnyway: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    price: string;
    currency: string;
    period: string;
    subtitle: string;
    features: string[];
    howToPay: string;
    bengaliToggle: string;
    bengaliInstructions: {
      heading: string;
      subheading: string;
      steps: Array<{
        step: number;
        title: string;
        desc: string;
      }>;
      safety: string;
    };
  };
  labs: {
    eyebrow: string;
    title: string;
    subtitle: string;
    timeline: Array<{
      phase: string;
      status: string;
      title: string;
      desc: string;
    }>;
    hardwareTeaser: {
      title: string;
      desc: string;
      cta: string;
      disclaimer: string;
    };
  };
}

export const copy: Record<'en' | 'bn', CopyData> = {
  en: {
    hero: {
      eyebrow: "NSEEN LABS • ANDROID PRO EDITION",
      title: "Never miss a deleted message again.",
      subtext: "Nseen captures notifications the microsecond they arrive on your phone. Even if the sender deletes them for everyone, you still read them. 100% on-device. Zero cloud leakage.",
      primaryCta: "Download Nseen Pro (v1.2.1)",
      secondaryCta: "Installation Guide",
      trustText: "150 BDT Lifetime • One Phone Binding • 100% On-Device Privacy",
    },
    bento: {
      eyebrow: "ENGINEERING EXCELLENCE",
      title: "Built with zero-trust privacy.",
      subtitle: "Six core innovations that make Nseen the most reliable notification vault on Android.",
      tiles: [
        {
          id: "notification-trap",
          title: "Real-Time Notification Interception",
          tag: "Low Latency",
          summary: "Intercepts incoming notifications via Android NotificationListenerService before messaging clients execute remote wipe commands.",
          details: "Runs locally as a persistent background daemon. Captures full rich-text bundles, sender metadata, and timestamps within 2 milliseconds of receipt."
        },
        {
          id: "on-device-privacy",
          title: "100% On-Device Storage",
          tag: "Zero Cloud",
          summary: "Encrypted SQLite Room Database stored strictly on your local flash memory. No chats ever leave your handset.",
          details: "Network permissions are strictly sandboxed and utilized only for Google Identity validation and initial 150 BDT license verification."
        },
        {
          id: "multilingual-engine",
          title: "Smart Deletion Detection",
          tag: "7 Languages",
          summary: "Recognizes system deletion notices across Bengali, English, Arabic, Spanish, French, German, and Turkish.",
          details: "Matches deletion phrases like 'এই বার্তাটি মুছে ফেলা হয়েছে' and retroactively marks the active message bubble with a vivid red DELETED badge."
        },
        {
          id: "hardware-binding",
          title: "Hardware-Fused DRM Binding",
          tag: "Anti-Fraud",
          summary: "1 License = 1 Physical Phone. Fused with Widevine MediaDrm Unique ID to survive app uninstalls and reboots.",
          details: "If you uninstall and reinstall on the same phone, your lifetime license restores instantly upon Google Sign-In with zero extra cost."
        },
        {
          id: "unified-inbox",
          title: "Multi-App Support",
          tag: "All Platforms",
          summary: "Unified chronological timeline for WhatsApp, WhatsApp Business, Telegram, Facebook Messenger, and Instagram.",
          details: "Individual filter chips let you isolate messages by application or toggle the 'Deleted Only' stream with a single tap."
        },
        {
          id: "lifetime-mfs",
          title: "150 BDT Lifetime License",
          tag: "Fair Pricing",
          summary: "Pay once, use forever. Native checkout support for bKash, Nagad, Rocket, and Bank Cards.",
          details: "No monthly or yearly recurring subscriptions. Includes an offline grace period of up to 14 days without requiring internet connectivity."
        }
      ]
    },
    download: {
      eyebrow: "GET STARTED",
      title: "Direct Sideload. No Play Store Bloat.",
      subtitle: "Download the verified production release directly to your Android device.",
      cta: "Download APK",
      checksumTitle: "Cryptographic Checksum (SHA-256)",
      copyHash: "Copy SHA-256",
      hashCopied: "Checksum copied to clipboard!",
      nonAndroidTitle: "Visiting from a non-Android device?",
      nonAndroidDesc: "Scan this QR code with your Android phone's camera to download directly, or send the APK link to your device.",
      downloadAnyway: "Download APK anyway"
    },
    pricing: {
      eyebrow: "HONEST MONETIZATION",
      title: "150 ৳ One-Time Lifetime License",
      price: "150",
      currency: "BDT",
      period: "one-time payment",
      subtitle: "Pay once. Use forever on your phone. No recurring subscriptions, no ads, no trackers.",
      features: [
        "Permanent message recovery for WhatsApp, Telegram, Messenger & Instagram",
        "100% on-device private Room database",
        "Hardware DRM device lock that survives uninstalls",
        "14-day offline grace period",
        "Instant Bengali & English payment verification (bKash, Nagad, Rocket, Card)"
      ],
      howToPay: "See Payment Guide",
      bengaliToggle: "বাংলায় দেখুন",
      bengaliInstructions: {
        heading: "১৫০ ৳ এককালীন আজীবন সাবস্ক্রিপশন",
        subheading: "একবার কিনুন, আজীবন ব্যবহার করুন। কোনো মাসিক বা বাৎসরিক ফি নেই। ১টি অ্যাকাউন্ট = ১টি নিজস্ব ফোন।",
        steps: [
          {
            step: 1,
            title: "পেমেন্ট নম্বর কপি করুন",
            desc: "অ্যাপের ভেতর দেওয়া bKash বা Nagad নম্বরটি এক ট্যাপে কপি করে নিন।"
          },
          {
            step: 2,
            title: "Send Money সম্পন্ন করুন",
            desc: "আপনার bKash বা Nagad অ্যাপ থেকে ঠিক ১৫০ টাকা সেন্ড মানি করুন।"
          },
          {
            step: 3,
            title: "TrxID ও মোবাইল নম্বর দিন",
            desc: "মেসেজে আসা ৮-১০ অক্ষরের ট্রানজেকশন আইডি (TrxID) অ্যাপে লিখে সাবমিট করুন।"
          },
          {
            step: 4,
            title: "আজীবন এক্সেস আনলক",
            desc: "তাৎক্ষণিক ভেরিফিকেশন শেষে অ্যাপটি সারাজীবনের জন্য আনলক হয়ে যাবে।"
          }
        ],
        safety: "আমরা কখনো আপনার পিন (PIN) বা ওটিপি (OTP) চাই না। পেমেন্ট তথ্য আপনার ফোনেই সুরক্ষিত থাকে।"
      }
    },
    labs: {
      eyebrow: "FUTURE LABS & ECOSYSTEM",
      title: "The Roadmap to Hybrid Privacy.",
      subtitle: "Nseen is just the beginning. We are engineering software and dedicated hardware modules to safeguard digital sovereignty.",
      timeline: [
        {
          phase: "Stage 01",
          status: "Live Now",
          title: "Nseen Android Pro",
          desc: "Offline-first notification trap, deletion recovery, and device-locked monetization."
        },
        {
          phase: "Stage 02",
          status: "In Development",
          title: "Cross-Platform Privacy Vaults",
          desc: "Encrypted desktop utilities and cross-platform companion tools with zero cloud reliance."
        },
        {
          phase: "Stage 03",
          status: "Research & Labs",
          title: "Hybrid Hardware Privacy Key",
          desc: "Physical NFC/USB security keys and dedicated offline hardware modules fused with our software."
        }
      ],
      hardwareTeaser: {
        title: "Dedicated Hardware Security Modules",
        desc: "We believe true privacy cannot rely solely on operating systems you do not control. Our upcoming hardware initiatives combine physical tamper-resistant microcontrollers with local encryption.",
        cta: "Contact Labs & Early Access",
        disclaimer: "Forward-looking technical concepts under active research; specifications subject to refinement."
      }
    }
  },
  bn: {
    hero: {
      eyebrow: "এনসিন ল্যাবস • অ্যান্ড্রয়েড প্রো এডিশন",
      title: "মুছে ফেলা বার্তা আর কখনোই মিস করবেন না।",
      subtext: "মেসেজ আসার সাথে সাথেই এনসিন তা ফোনে সংরক্ষণ করে। প্রেরক 'Delete for Everyone' করলেও আপনি পড়তে পারবেন। সম্পূর্ণ নিজের ডিভাইসে সংরক্ষিত। কোনো ক্লাউড লিকেজ নেই।",
      primaryCta: "এনসিন প্রো ডাউনলোড (v1.2.1)",
      secondaryCta: "ইন্সটলেশন গাইড",
      trustText: "১৫০ ৳ আজীবন • ১টি ফোন বাইন্ডিং • ১০০% অফলাইন প্রাইভেসি",
    },
    bento: {
      eyebrow: "আধুনিক সিকিউরিটি আর্কিটেকচার",
      title: "জিরো-ট্রাস্ট প্রাইভেসি দিয়ে তৈরি।",
      subtitle: "ছয়টি শক্তিশালী প্রযুক্তি যা এনসিনকে সবচেয়ে নিরাপদ নোটিফিকেশন ভল্ট বানিয়েছে।",
      tiles: [
        {
          id: "notification-trap",
          title: "রিয়েল-টাইম নোটিফিকেশন ইন্টারসেপশন",
          tag: "দ্রুততম ক্যাচিং",
          summary: "মেসেঞ্জার বা হোয়াটসঅ্যাপ বার্তা মোছার কমান্ড পাঠানোর আগেই নোটিফিকেশন ক্যাশ করে নেয়।",
          details: "ব্যাকগ্রাউন্ডে স্বয়ংক্রিয়ভাবে চলে। মেসেজ রিসিভ হওয়ার ২ মিলিসেকেন্ডের মধ্যে টেক্সট ও সময় রেকর্ড করে।"
        },
        {
          id: "on-device-privacy",
          title: "১০০% নিজস্ব ডিভাইসে সেভ",
          tag: "জিরো ক্লাউড",
          summary: "সকল চ্যাট শুধুমাত্র আপনার ফোনের লোকাল মেমোরিতে এনক্রিপ্ট হয়ে সংরক্ষিত থাকে।",
          details: "নেটওয়ার্ক পারমিশন শুধুমাত্র লাইসেন্স ভেরিফাই ও গুগল সাইন-ইন এর জন্য ব্যবহৃত হয়। কোনো চ্যাট সার্ভারে যায় না।"
        },
        {
          id: "multilingual-engine",
          title: "মুছে ফেলা বার্তা শনাক্তকরণ",
          tag: "৭টি ভাষা",
          summary: "বাংলা ও ইংরেজিসহ ৭টি ভাষায় মেসেজ ডিলিট হওয়ার নোটিশ রিয়েল-টাইমে ডিটেক্ট করে।",
          details: "'এই বার্তাটি মুছে ফেলা হয়েছে' পেলে সাথে সাথে পূর্বের আসল মেসেজে লাল DELETED ব্যাজ যুক্ত করে দেয়।"
        },
        {
          id: "hardware-binding",
          title: "হার্ডওয়্যার ডিভাইস বাইন্ডিং",
          tag: "নিরাপদ লাইসেন্স",
          summary: "১টি লাইসেন্স = ১টি নিজস্ব ফোন। ফোনের হার্ডওয়্যার ডিআরএম আইডির সাথে সুরক্ষিতভাবে যুক্ত।",
          details: "অ্যাপ আনইন্সটল করে পুনরায় ইনস্টল করলেও আপনার কেনা লাইসেন্স স্বয়ংক্রিয়ভাবে পুনরুদ্ধার হয়ে যাবে।"
        },
        {
          id: "unified-inbox",
          title: "সকল সোশ্যাল অ্যাপ একত্রে",
          tag: "সব প্ল্যাটফর্ম",
          summary: "হোয়াটসঅ্যাপ, মেসেঞ্জার, ইনস্টাগ্রাম ও টেলিগ্রামের সব মেসেজ একটি সাজানো টাইমলাইনে।",
          details: "অ্যাপ ফিল্টার দিয়ে আলাদাভাবে যেকোনো প্ল্যাটফর্মের বা শুধুমাত্র মুছে ফেলা মেসেজ দেখা সম্ভব।"
        },
        {
          id: "lifetime-mfs",
          title: "১৫০ ৳ এককালীন আজীবন সুবিধা",
          tag: "ন্যায্য মূল্য",
          summary: "একবার পেমেন্ট করুন, সারাজীবন চালান। বিকাশ, নগদ, রকেট ও কার্ডে সহজ পেমেন্ট।",
          details: "কোনো মাসিক বিল নেই। ইন্টারনেট ছাড়াও টানা ১৪ দিন অফলাইনে অনায়াসে ব্যবহার করা যায়।"
        }
      ]
    },
    download: {
      eyebrow: "ডাউনলোড",
      title: "সরাসরি ওয়েবসাইট থেকে ডাউনলোড করুন।",
      subtitle: "কোনো থার্ড-পার্টি অ্যাপ স্টোরের ঝামেলা ছাড়াই অফিসিয়াল নিরাপদ বিল্ড ইন্সটল করুন।",
      cta: "ডাউনলোড এপিকে (APK)",
      checksumTitle: "নিরাপত্তা চেকসাম (SHA-256)",
      copyHash: "হ্যাশ কপি করুন",
      hashCopied: "চেকসাম কপি করা হয়েছে!",
      nonAndroidTitle: "কম্পিউটার বা আইফোন থেকে ভিজিট করছেন?",
      nonAndroidDesc: "আপনার অ্যান্ড্রয়েড ফোনের ক্যামেরা দিয়ে এই কিউআর (QR) কোডটি স্ক্যান করে সরাসরি ডাউনলোড করুন।",
      downloadAnyway: "যেকোনো উপায়ে ডাউনলোড করুন"
    },
    pricing: {
      eyebrow: "স্বচ্ছ মূল্য",
      title: "১৫০ ৳ এককালীন আজীবন সাবস্ক্রিপশন",
      price: "১৫০",
      currency: "BDT",
      period: "এককালীন পেমেন্ট",
      subtitle: "একবার কিনুন, আজীবন নিজের ফোনে ব্যবহার করুন। কোনো মাসিক বা বাৎসরিক ফি নেই।",
      features: [
        "হোয়াটসঅ্যাপ, মেসেঞ্জার, টেলিগ্রাম ও ইনস্টাগ্রামের মুছে ফেলা মেসেজ দেখার সুবিধা",
        "১০০% অফলাইন প্রাইভেট রুম ডাটাবেজ",
        "হার্ডওয়্যার বাইন্ডিং (আনইন্সটল করলেও লাইসেন্স থাকবে)",
        "১৪ দিনের নিরবচ্ছিন্ন অফলাইন গ্রেস পিরিয়ড",
        "বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে তাৎক্ষণিক ভেরিফিকেশন"
      ],
      howToPay: "পেমেন্ট গাইড দেখুন",
      bengaliToggle: "View in English",
      bengaliInstructions: {
        heading: "১৫০ ৳ এককালীন আজীবন সাবস্ক্রিপশন",
        subheading: "একবার কিনুন, আজীবন ব্যবহার করুন। কোনো মাসিক বা বাৎসরিক ফি নেই। ১টি অ্যাকাউন্ট = ১টি নিজস্ব ফোন।",
        steps: [
          {
            step: 1,
            title: "পেমেন্ট নম্বর কপি করুন",
            desc: "অ্যাপের ভেতর দেওয়া bKash বা Nagad নম্বরটি এক ট্যাপে কপি করে নিন।"
          },
          {
            step: 2,
            title: "Send Money সম্পন্ন করুন",
            desc: "আপনার bKash বা Nagad অ্যাপ থেকে ঠিক ১৫০ টাকা সেন্ড মানি করুন।"
          },
          {
            step: 3,
            title: "TrxID ও মোবাইল নম্বর দিন",
            desc: "মেসেজে আসা ৮-১০ অক্ষরের ট্রানজেকশন আইডি (TrxID) অ্যাপে লিখে সাবমিট করুন।"
          },
          {
            step: 4,
            title: "আজীবন এক্সেস আনলক",
            desc: "তাৎক্ষণিক ভেরিফিকেশন শেষে অ্যাপটি সারাজীবনের জন্য আনলক হয়ে যাবে।"
          }
        ],
        safety: "আমরা কখনো আপনার পিন (PIN) বা ওটিপি (OTP) চাই না। পেমেন্ট তথ্য আপনার ফোনেই সুরক্ষিত থাকে।"
      }
    },
    labs: {
      eyebrow: "ফিউচার ল্যাবস ও ইকোসিস্টেম",
      title: "হাইব্রিড প্রাইভেসি ডিভাইসের ভবিষ্যৎ।",
      subtitle: "এনসিন কেবল শুরু। আমরা সফটওয়্যার এবং ডেডিকেটেড হার্ডওয়্যার মডিউল উদ্ভাবন করছি ডিজিটাল সার্বভৌমত্ব রক্ষায়।",
      timeline: [
        {
          phase: "ধাপ ০১",
          status: "লাইভ আছে",
          title: "এনসিন অ্যান্ড্রয়েড প্রো",
          desc: "অফলাইন নোটিফিকেশন ইন্টারসেপশন, ডিলিট মেসেজ রিকভারি ও হার্ডওয়্যার ডিভাইস লক।"
        },
        {
          phase: "ধাপ ০২",
          status: "উন্নয়নাধীন",
          title: "ক্রস-প্ল্যাটফর্ম প্রাইভেসি ভল্টস",
          desc: "ক্লাউডহীন এনক্রিপ্টেড ডেস্কটপ ইউটিলিটি ও মাল্টি-প্ল্যাটফর্ম কম্প্যানিয়ন টুলস।"
        },
        {
          phase: "ধাপ ০৩",
          status: "গবেষণা পর্যায়ে",
          title: "হাইব্রিড হার্ডওয়্যার সিকিউরিটি কী",
          desc: "ফিজিক্যাল এনএফসি/ইউএসবি সিকিউরিটি মডিউল যা অফলাইন এনক্রিপশনে সাহায্য করবে।"
        }
      ],
      hardwareTeaser: {
        title: "ডেডিকেটেড হার্ডওয়্যার সিকিউরিটি মডিউলস",
        desc: "প্রকৃত গোপনীয়তা কেবল অপারেটিং সিস্টেমের ওপর ছেড়ে দেওয়া যায় না। আমাদের গবেষণা দল ফিজিক্যাল টেম্পার-রেজিস্ট্যান্ট মাইক্রোকন্ট্রোলারের সাথে লোকাল সফটওয়্যার সংযুক্ত করছে।",
        cta: "ল্যাবসে যোগাযোগ করুন",
        disclaimer: "প্রস্তাবিত টেকনিক্যাল কনসেপ্ট গবেষণা পর্যায়ে রয়েছে; বাস্তবায়ন সাপেক্ষে পরিবর্তিত হতে পারে।"
      }
    }
  }
};
