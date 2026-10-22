export interface SiteConfig {
  name: string;
  tagline: string;
  supportEmail: string;
  siteUrl: string;
  labsContactUrl: string;
  minAndroid: string;
  refundPolicyText: string;
  mfs: {
    bkash?: string;
    nagad?: string;
    rocket?: string;
  };
  bank?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
    branch?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Nseen",
  tagline: "Never miss a deleted message again.",
  supportEmail: "support@nseen.app",
  siteUrl: "https://nseen.app",
  labsContactUrl: "mailto:labs@nseen.app?subject=Hardware%20%26%20Ecosystem%20Inquiry",
  minAndroid: "Android 8.0 (Oreo) to Android 15+",
  refundPolicyText: "100% money-back guarantee within 48 hours if Nseen does not work on your supported Android device after following our installation guide.",
  mfs: {
    bkash: "01576520816",
    nagad: "01576520816",
    rocket: "01576520816",
  },
  bank: {
    bankName: "Available in App",
    accountName: "Nseen Technologies",
    accountNumber: "Payment details provided inside the app",
  },
};

