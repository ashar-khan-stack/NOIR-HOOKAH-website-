import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'restaurant' | 'product';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'NOIR HOOKAH — Elevate the Night | Luxury Hookah & Sheesha Lounge',
  description = 'Experience the ultimate luxury hookah and sheesha lounge with hand-blown bohemian crystal hookahs, artisanal teas, craft beverages, and VIP seating.',
  canonicalUrl = 'https://noirhookah.com',
  ogImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  type = 'website',
}) => {
  useEffect(() => {
    // Page Title
    document.title = title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // OpenGraph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      ogImg = document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      document.head.appendChild(ogImg);
    }
    ogImg.setAttribute('content', ogImage);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // JSON-LD Structured Data for Lounge & Bar
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BarOrPub',
      name: 'NOIR HOOKAH',
      image: ogImage,
      description: description,
      servesCuisine: ['Hookah', 'Beverages', 'Middle Eastern Snacks', 'Gourmet Bites'],
      priceRange: '$$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '104 Boulevard Luxury Way, Executive Block',
        addressLocality: 'Gulberg III, Lahore',
        addressCountry: 'PK',
      },
      telephone: '+92 300 8822112',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '17:00',
          closes: '03:00',
        },
      ],
      acceptsReservations: 'True',
    };

    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [title, description, canonicalUrl, ogImage, type]);

  return null;
};
