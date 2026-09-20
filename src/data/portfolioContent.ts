/**
 * ============================================================================
 * EMKAY VISUALS - MASTER CONTENT CONFIGURATION FILE
 * ============================================================================
 */

export const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

export interface ProjectItem {
  id: string;
  title: string;
  category:
    | 'Sports Design'
    | 'Posters'
    | 'Flyers'
    | 'Visual Branding'
    | 'Movie Posters'
    | 'Music Covers'
    | 'Thumbnails'
    | 'Photo Manipulation'
    | 'Motion';
  image: string;
  description: string;
  client?: string;
  year: string;
  tools: string[];
  featured?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  videoUrl?: string;
  videoEmbedType?: 'youtube' | 'vimeo' | 'mp4';
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tag: string;
  deliverables: string[];
  colSpan?: string;
  previewImage?: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  duration: string;
  highlightBadge: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  comment: string;
  projectType: string;
  rating: number;
}

export interface InstagramProfile {
  handle: string;
  label: string;
  url: string;
}

export interface SocialLinks {
  email: string;
  emailMailto: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  instagramDesigns: InstagramProfile;
  instagramFx: InstagramProfile;
  behance?: string;
  dribbble?: string;
  youtube?: string;
  vimeo?: string;
}

export const PORTFOLIO_CONTENT = {
  // ==========================================
  // 1. BRAND & ARTIST IDENTITY
  // ==========================================
  brand: {
    name: 'Emkay Visuals',
    roleTitle: 'Graphic Designer & Motion Graphics Artist',
    experienceYears: 5,
    tagline: 'Futuristic visual architecture, cinematic key art, and high-octane motion graphics.',
    statusBadge: 'Available for Freelance & Contracts',
    location: 'Available Worldwide / Remote',
  },

  // ==========================================
  // 2. CONTACT & SOCIAL NETWORKS
  // ==========================================
  socials: {
    email: 'emkayvisuals@gmail.com',
    emailMailto: 'mailto:emkayvisuals@gmail.com',
    whatsapp: '09161889909',
    whatsappDisplay: '09161889909',
    whatsappUrl: 'https://wa.me/2349161889909',
    instagramDesigns: {
      handle: '@emkayvisuals',
      label: 'Graphic & Motion Designs',
      url: 'https://instagram.com/emkayvisuals',
    },
    instagramFx: {
      handle: '@emkayvisuals_fx',
      label: 'Digital Art & Photo Manipulations',
      url: 'https://instagram.com/emkayvisuals_fx',
    },
    behance: 'https://behance.net/emkayvisuals',
    dribbble: 'https://dribbble.com/emkayvisuals',
    youtube: 'https://youtube.com',
    vimeo: 'https://vimeo.com',
  } as SocialLinks,

  // ==========================================
  // 3. NAVIGATION ITEMS
  // ==========================================
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ],

  // ==========================================
  // 4. HERO SECTION
  // ==========================================
  hero: {
    badge: '5+ Years of Obsessive Visual Craft',
    headlineMain: 'Your Vision, Visualized',
    subtext:
      'Visual designer creating distinctive posters, digital art, and high impact visual identities for brands and creative projects.',
    primaryButtonText: 'View Work',
    primaryButtonLink: '#work',
    secondaryButtonText: 'Hire Me',
    secondaryButtonLink: '#contact',
    floatingTags: [
      { label: 'Posters', color: 'yellow' },
      { label: 'Visual Branding', color: 'violet' },
      { label: 'Motion Graphics', color: 'yellow' },
      { label: 'Movie Key Art', color: 'white' },
      { label: 'Photo Manipulation', color: 'violet' },
    ],
    marqueeTicker: [
      'Posters',
      'Visual Branding',
      'Motion Graphics',
      'Flyers',
      'Movie Posters',
      'Photo Manipulation',
      'Music Covers',
      'Thumbnail Design',
      'After Effects Expert',
      'Vector Systems',
    ],
  },

  // ==========================================
  // 5. STATS ROW
  // ==========================================
  stats: [
    {
      value: 5,
      suffix: '+',
      label: 'Years Experience',
      sublabel: 'Delivering cutting-edge visual craft since 2021',
    },
    {
      value: 350,
      suffix: '+',
      label: 'Projects Completed',
      sublabel: 'Album art, key art, brand systems & animations',
    },
    {
      value: 150,
      suffix: '+',
      label: 'Happy Clients',
      sublabel: 'Musicians, film directors, creators & founders',
    },
    {
      value: 97,
      suffix: '%',
      label: 'Client Satisfaction',
      sublabel: 'On-time delivery with uncompromising polish',
    },
  ],

  // ==========================================
  // 6. SERVICES (BENTO GRID)
  // ==========================================
  services: [
    {
      id: 'motion-graphics',
      title: 'Motion Graphics',
      tag: 'Flagship Craft',
      shortDesc: 'Dynamic title sequences, audio-reactive visualizers, kinetic typography, and looped stage visuals.',
      fullDesc:
        'Breathing motion into still design through high-tempo animation, spatial depth, camera tracking, and sound-synced kinetic rhythm.',
      iconName: 'Film',
      deliverables: ['Logo Reveals & Intros', 'Stage Visuals & Loops', 'Audio Visualizers', 'Social Reels & Teasers'],
      colSpan: 'col-span-12 lg:col-span-8',
      previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'movie-posters',
      title: 'Movie Posters',
      tag: 'Cinematic Key Art',
      shortDesc: 'Theatrical key art, indie sci-fi posters, moody character compositions, and festival promotional assets.',
      fullDesc:
        'Telling an entire cinematic story in a single arresting frame through dramatic lighting, bespoke typography, and textured atmosphere.',
      iconName: 'Clapperboard',
      deliverables: ['Theatrical One-Sheets', 'IMDb / Streaming Art', 'Festival Promo Kits', 'High-Res Print Masters'],
      colSpan: 'col-span-12 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'posters',
      title: 'Posters & Art Prints',
      tag: 'Surreal & Editorial',
      shortDesc: 'Graphic posters blending typography, brutalist geometry, dark tech themes, and surrealist textures.',
      fullDesc:
        'Museum-grade poster layouts built with precision grid structures, custom vector marks, and tactile paper finishes.',
      iconName: 'Image',
      deliverables: ['Exhibition Posters', 'Limited Merch Prints', 'Event Key Graphics', 'Ultra-DPI Vector Files'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'visual-branding',
      title: 'Visual Branding',
      tag: 'Cohesive Ecosystems',
      shortDesc: 'Futuristic logos, brand guideline bibles, custom type treatments, and multi-platform design languages.',
      fullDesc:
        'Transforming brands into unforgettable cultural identities through distinctive symbols, dark-mode palettes, and modern collateral.',
      iconName: 'Palette',
      deliverables: ['Logomark & Monogram', 'Color & Type Systems', 'Brand Guidelines Bible', 'Social Media Toolkits'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'music-covers',
      title: 'Music Covers',
      tag: 'Audio-Visual Synthesis',
      shortDesc: 'Hypnotic cover artwork for electronic, hip-hop, metal, ambient, and avant-garde singles, EPs, and albums.',
      fullDesc:
        'Translating musical emotion and sonic frequencies into tactile visual worlds calibrated for Spotify, Apple Music, and vinyl presses.',
      iconName: 'Disc3',
      deliverables: ['Streaming Cover Art (3000x3000px)', 'Spotify Canvas Animations', 'Gatefold Vinyl Layouts', 'Promotional Tour Assets'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'photo-manipulation',
      title: 'Photo Manipulation',
      tag: 'Surreal Compositing',
      shortDesc: 'Hyper-realistic composite art, futuristic cyborg enhancements, ethereal lighting, and sci-fi environments.',
      fullDesc:
        'Seamlessly blending multi-exposure photographs, intricate digital painting, atmospheric dust, volumetric light, and high-frequency retouching.',
      iconName: 'Wand2',
      deliverables: ['Concept Art Mattes', 'Subject Retouching & FX', 'Cyberpunk Composites', 'Multi-Layer PSD Source'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'flyers',
      title: 'Club & Event Flyers',
      tag: 'Nightlife & Experiences',
      shortDesc: 'High-impact promotional flyers for underground raves, tech conferences, gallery openings, and DJ tours.',
      fullDesc:
        'High-density, attention-commanding compositions optimized for both printed street flyposting and mobile Instagram feeds.',
      iconName: 'Layers',
      deliverables: ['Animated Motion Flyers', 'Print Ready CMYK PDFs', 'Story / 9:16 Aspect Formats', 'Square 1:1 Social Formats'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'thumbnail-design',
      title: 'Thumbnail Design',
      tag: 'High-CTR Visuals',
      shortDesc: 'Electrifying, click-optimized thumbnails for YouTube creators, podcasters, and masterclasses.',
      fullDesc:
        'Engineered for maximum thumbnail contrast, facial expression emphasis, and instant storytelling on crowded mobile displays.',
      iconName: 'Sparkles',
      deliverables: ['A/B Testing Variants', 'Custom Cutouts & Highlights', 'Typography Badges', 'Ultra-Crisp 1080p Exports'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
  ] as ServiceItem[],

  // ==========================================
  // 7. PORTFOLIO WORK ITEMS & CATEGORIES
  // ==========================================
  categories: [
    'All',
    'Sports Design',
    'Posters',
    'Flyers',
    'Visual Branding',
    'Movie Posters',
    'Music Covers',
    'Thumbnails',
    'Photo Manipulation',
  ] as const,

  projects: [
    {
      id: 'proj-sports-1',
      title: 'Apex Championship // Game Day Key Art',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      description:
        'High-octane game day match poster engineered with electric lightning visual effects, dynamic athlete cutouts, stadium atmosphere, and bold athletic typography.',
      client: 'Apex Championship League',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Camera Raw'],
      aspectRatio: 'portrait',
      featured: true,
    },
    {
      id: 'proj-sports-2',
      title: 'Courtside Dynasty // Signature Athlete Poster',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      description:
        'Cinematic pro basketball poster featuring volumetric stadium smoke, motion blur dynamics, high-contrast rim lighting, and distressed team typography.',
      client: 'Vanguard Hoops Pro',
      year: '2025',
      tools: ['Photoshop', 'Lightroom', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: true,
    },
    {
      id: 'proj-sports-3',
      title: 'Velocity Grand Prix // Motorsport Athlete Banner',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      description:
        'Ultra-fast racing driver promotional artwork with particle sparks, aerodynamic motion trails, sleek carbon fiber textures, and futuristic speed typography.',
      client: 'Monza Velocity Circuit',
      year: '2024',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'landscape',
      featured: false,
    },
    {
      id: 'proj-1',
      title: 'Cyberpunk Protocol // Neural Void',
      category: 'Movie Posters',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      description:
        'Official theatrical key art for an independent neo-noir sci-fi thriller set in 2088. Handcrafted composite art featuring volumetric lighting, particle disintegration, and distressed Japanese/English typography.',
      client: 'Aetheria Pictures',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom', 'Topaz Gigapixel'],
      aspectRatio: 'portrait',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Solaris Echo // Album Artwork',
      category: 'Music Covers',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description:
        'Hypnotic vinyl and digital cover design for an ambient synthwave album. Exploring celestial geometry, iridescent liquid chrome, and minimal tracklist typography.',
      client: 'Ghostly Ambient Collective',
      year: '2024',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'square',
      featured: true,
    },
    {
      id: 'proj-4',
      title: 'Nexus Matrix // Brutalist Exhibition Poster',
      category: 'Posters',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      description:
        'International design biennial promotional poster featuring Swiss architectural grids collided with glitch distortion and high-contrast dual-tone duotone palette.',
      client: 'Zurich Design Pavilion',
      year: '2024',
      tools: ['Illustrator', 'Photoshop'],
      aspectRatio: 'portrait',
      featured: false,
    },
    {
      id: 'proj-5',
      title: 'Synthetic Awakening // Bio-Mecha Manipulation',
      category: 'Photo Manipulation',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      description:
        'Multi-layer digital artwork melding human portraiture with intricate fiber-optic cyberware, neon vein illumination, and atmospheric volumetric smoke.',
      client: 'Vanguard Visuals Magazine',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'portrait',
      featured: true,
    },
    {
      id: 'proj-7',
      title: 'Orbital Ventures // Identity & Brand System',
      category: 'Visual Branding',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      description:
        'Comprehensive futuristic brand identity for an aerospace venture fund, spanning custom geometric monogram, dark-mode print stationery, and digital brand guidelines.',
      client: 'Orbital Capital',
      year: '2024',
      tools: ['Illustrator', 'Figma', 'Photoshop'],
      aspectRatio: 'square',
      featured: false,
    },
    {
      id: 'proj-8',
      title: 'Subterranean Pulse // Warehouse Rave Flyer',
      category: 'Flyers',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      description:
        'Industrial techno event flyer series engineered with brutalist thermal effects, neon green safety typography, and high-impact hierarchy for social feeds.',
      client: 'Warehouse 09 Berlin',
      year: '2025',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: false,
    },
    {
      id: 'proj-9',
      title: 'The $10,000,000 Quantum Heist // Thumbnail',
      category: 'Thumbnails',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      description:
        'Custom high-conversion YouTube thumbnail for a tech documentary channel (2.4M subscribers). Elevated dynamic lighting, clean subject cutouts, and 14.8% click-through rate.',
      client: 'Apex Documentaries',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'landscape',
      featured: false,
    },
    {
      id: 'proj-10',
      title: 'Astral Rebirth // Surreal Psychedelic Poster',
      category: 'Posters',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      description:
        'Limited edition 24x36 screenprint design combining Renaissance anatomical engravings with psychedelic sacred geometry and holographic foil stamp layers.',
      client: 'Metropolis Gallery',
      year: '2024',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: false,
    },
    {
      id: 'proj-11',
      title: 'Valkyrie Horizon // Cinematic Key Art',
      category: 'Movie Posters',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      description:
        'Hero promotional artwork for an action-adventure series featuring custom cloud mattes, fighter jet propulsion trails, and distressed metallic title typography.',
      client: 'Horizon Stream Original',
      year: '2024',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'portrait',
      featured: false,
    },
    {
      id: 'proj-12',
      title: 'Metallic Overdrive // Single Art',
      category: 'Music Covers',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      description:
        'Liquid chrome emblem suspended in a zero-gravity dark abyss with typography etched in Blanche White and Banana Yellow neon highlights.',
      client: 'Void Pulse Audio',
      year: '2025',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'square',
      featured: false,
    },
  ] as ProjectItem[],

  // ==========================================
  // 8. ABOUT ME SECTION
  // ==========================================
  about: {
    badge: 'Behind the Screen',
    heading: 'Engineering Visual Worlds with Uncompromising Precision',
    bioParagraphs: [
      "I'm Emkay, a graphic designer and digital artist specializing in sports design, photo manipulation, promotional visuals, and creative poster design.",
      "My work combines strong composition, cinematic imagery, bold typography, and detailed visual effects to create designs that feel dynamic, polished, and built to stand out.",
      "From sports posters and campaign visuals to digital artwork and social media content, I focus on turning ideas into visuals that communicate clearly and leave a lasting impression.",
    ],
    // Easy to swap: replace '/artist-avatar.svg' with your photo URL or image path when ready
    photoUrl: '/artist-avatar.svg',
    photoAlt: 'Emkay - Graphic Designer & Digital Artist',
    experienceBadge: '5+ Years in Industry',
    
    // Core Tools Stack (strictly no 3D software):
    softwareTools: [
      { name: 'Adobe After Effects', level: 'Mastery', type: 'Motion Graphics & FX' },
      { name: 'Adobe Photoshop', level: 'Mastery', type: 'Compositing & Retouch' },
      { name: 'Adobe Illustrator', level: 'Mastery', type: 'Vector & Typography' },
      { name: 'Adobe Premiere Pro', level: 'Advanced', type: 'Video Editing & Pacing' },
      { name: 'Adobe Lightroom', level: 'Advanced', type: 'Color Grading & Tone' },
      { name: 'Figma', level: 'Advanced', type: 'Brand Systems & Layout' },
    ],

    highlights: [
      { number: '01', title: 'Obsessive Detail', text: 'Pixel-perfect alignment, custom typography modifications, and pristine color grading.' },
      { number: '02', title: 'Cinema & Sound Synced', text: 'Visuals tuned to musical rhythm and storytelling arcs that evoke visceral emotion.' },
      { number: '03', title: 'High-Turnaround Velocity', text: 'Fast communication with zero fluff—transparent milestones and tight deadlines honored.' },
    ],
  },

  // ==========================================
  // 9. 4-STEP CREATIVE PROCESS
  // ==========================================
  process: [
    {
      stepNumber: '01',
      title: 'Discovery & Vision Brief',
      duration: 'Day 1 - 2',
      highlightBadge: 'Research & Strategy',
      description:
        'We dissect your project objectives, target audience, artistic references, color palettes, and technical specifications to lock in an airtight creative direction.',
    },
    {
      stepNumber: '02',
      title: 'Concept & Moodboards',
      duration: 'Day 2 - 4',
      highlightBadge: 'Rapid Prototyping',
      description:
        'I develop visual moodboards, composition roughs, wireframe layouts, and kinetic motion styleframes to explore diverse creative paths before final rendering.',
    },
    {
      stepNumber: '03',
      title: 'High-Fidelity Craft',
      duration: 'Day 4 - 8',
      highlightBadge: 'Deep Execution',
      description:
        'Full execution begins: complex photo manipulation, custom typography, advanced lighting passes, color grading, particle simulation, and frame-by-frame animation.',
    },
    {
      stepNumber: '04',
      title: 'Revision & Polished Delivery',
      duration: 'Day 8 - 10',
      highlightBadge: 'Final Handoff',
      description:
        'We fine-tune the assets through collaborative feedback rounds, delivering master production files (DPI print masters, 4K ProRes/MP4, layered PSDs, vector SVGs).',
    },
  ] as ProcessStep[],

  // ==========================================
  // 10. TESTIMONIALS
  // ==========================================
  testimonials: [
    {
      id: 't-1',
      name: 'Julian Vance',
      role: 'Creative Director',
      company: 'Aetheria Pictures',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment:
        'Emkay designed the official key art for our festival feature film. The poster halted people in their tracks at every screening and drove our streaming debut. The level of detail in the photo manipulation was breathtaking.',
      projectType: 'Movie Poster Key Art',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Marcus K.',
      role: 'Electronic Music Producer',
      company: 'Void Pulse Audio',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      comment:
        'Working with Emkay on my album rollout and stage visuals transformed my entire brand. The motion loops synced seamlessly with my live set. Absolute professionalism and visionary taste.',
      projectType: 'Album Art & Motion Graphics',
      rating: 5,
    },
    {
      id: 't-3',
      name: 'Elena Rostova',
      role: 'Head of Brand',
      company: 'Kinesis Gear Labs',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      comment:
        'From our kinetic logo reveal to our dark-mode identity guidelines, Emkay understood the futuristic cyberpunk aesthetic effortlessly. Delivered on schedule with immaculate communication.',
      projectType: 'Visual Branding & Motion Graphics',
      rating: 5,
    },
    {
      id: 't-4',
      name: 'Davey Croft',
      role: 'Content Creator (1.8M Subs)',
      company: 'Apex Documentaries',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      comment:
        'Our CTR shot up from 5.1% to nearly 14% after Emkay took over thumbnail art. The lighting mastery and typography hierarchy are completely unmatched in the creator space.',
      projectType: 'YouTube Thumbnail Design',
      rating: 5,
    },
  ] as TestimonialItem[],

  // ==========================================
  // 11. CONTACT SECTION
  // ==========================================
  contact: {
    badge: "Let's Build Something Iconic",
    heading: 'Ready to Bring Your Vision to Life?',
    subtext:
      'Have an upcoming music release, movie key art project, brand overhaul, or motion graphics brief? Send a project brief directly or reach out on WhatsApp or Instagram.',
    responseTime: 'Typical response time: under 4 hours',
    servicesOptions: [
      'Posters & Art Prints',
      'Club & Event Flyers',
      'Visual Branding & Identity',
      'Movie Posters & Key Art',
      'Photo Manipulation & Composite',
      'Music / Album Covers',
      'High-CTR Thumbnail Design',
      'Motion Graphics & Video Animation',
      'Complete Full-Package Campaign',
    ],
    budgetRanges: [
      '$500 - $1,000',
      '$1,000 - $2,500',
      '$2,500 - $5,000',
      '$5,000+',
    ],
  },

  // ==========================================
  // 12. FOOTER
  // ==========================================
  footer: {
    tagline: 'Designing tomorrow’s aesthetics today. High-impact visuals & kinetic motion graphics.',
    copyright: '© 2026 Emkay Visuals. All rights reserved.',
    rightsNote: 'Handcrafted with precision. All artworks protected under creative copyright.',
  },
};
