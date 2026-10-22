export interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'privacy' | 'payment' | 'troubleshooting';
}

export const faqs: FaqItem[] = [
  {
    question: "How does Nseen capture messages deleted for everyone?",
    answer: "Nseen uses the official Android NotificationListenerService to intercept and store notifications the exact millisecond they hit your device. When the sender subsequently issues a 'Delete for Everyone' command, WhatsApp or Messenger attempts to clear the notification, but Nseen's local database has already secured the original text and timestamp.",
    category: "general"
  },
  {
    question: "Do my private chats or messages ever get uploaded to any server?",
    answer: "Never. Nseen is strictly offline-first. Your messages, contacts, and notification history are stored exclusively inside an encrypted local SQLite database on your handset's physical flash storage. The app only accesses the internet to verify your Google identity and lifetime license.",
    category: "privacy"
  },
  {
    question: "How does the 150 BDT lifetime license work?",
    answer: "You pay once (150 BDT) via bKash, Nagad, Rocket, or Bank Card. The license is cryptographically bound to your physical device using your phone's Widevine MediaDrm hardware ID. You never have to pay a monthly or annual fee. If you reinstall Nseen on the same device, your license restores automatically.",
    category: "payment"
  },
  {
    question: "What happens if I change my phone in the future?",
    answer: "Each license is valid for one physical device to prevent account sharing. However, if you upgrade or replace your phone, you can contact our support team with your original Transaction ID (TrxID) and Google email, and we will happily unbind your old device and transfer the license to your new phone.",
    category: "payment"
  },
  {
    question: "Why does my phone say 'Restricted setting' when I try to turn on Notification Access?",
    answer: "Starting in Android 13, Google introduced 'Restricted Settings' for all apps installed outside the Play Store. To enable it: Go to Phone Settings > Apps > Nseen > tap the 3 vertical dots (⋮) in the top right corner > tap 'Allow restricted settings'. Then return to Nseen and toggle Notification Access ON.",
    category: "troubleshooting"
  },
  {
    question: "Why did Samsung Auto Blocker stop my installation?",
    answer: "Samsung introduced Auto Blocker in OneUI 6/7 (Galaxy S24/S25 series) which automatically blocks all APK downloads by default. You can simply go to Settings > Security and privacy > Auto Blocker and temporarily turn it OFF to install Nseen.",
    category: "troubleshooting"
  }
];
