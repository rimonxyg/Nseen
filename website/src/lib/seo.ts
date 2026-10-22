export interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export function setSeo({
  title = "Nseen — Never Miss a Deleted Message Again",
  description = "Nseen captures notifications the millisecond they arrive on your phone. Even if the sender deletes them for everyone, you still read them. 100% on-device. Zero cloud leakage.",
  canonical = "https://nseen.app",
}: SeoProps = {}) {
  if (typeof document === 'undefined') return;

  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonical);
}
