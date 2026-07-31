/**
 * Every string on the page lives here.
 *
 * PLACEHOLDER CONTENT — "Lumen" is a stand-in product. Swapping in the real
 * product should mean editing this file and nothing else; the sections read
 * from it and never hard-code copy.
 */

export const site = {
  name: "Lumen",
  tagline: "Product analytics your whole team can actually read",
  description:
    "Lumen turns raw product events into answers, so you stop guessing which changes moved the numbers.",
  url: "https://example.com",
} as const;

export const nav = {
  links: [
    { label: "Features", href: "#features" },
    { label: "Customers", href: "#customers" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Start free", href: "#pricing" },
  secondary: { label: "Sign in", href: "#" },
} as const;

export const hero = {
  announcement: {
    label: "Lumen 3.0 — session replay is live",
    href: "#features",
  },
  headline: "Ship the change. Know what it did.",
  subhead:
    "Lumen connects every release to the metrics that matter, so your team argues about strategy instead of about whose dashboard is right.",
  primaryCta: { label: "Start free", href: "#pricing" },
  secondaryCta: { label: "Book a demo", href: "#" },
  reassurance: "Free for 14 days · No credit card · 5-minute setup",
  metrics: [
    { value: "2.4B", label: "events / day" },
    { value: "180ms", label: "median query" },
    { value: "99.98%", label: "uptime" },
  ],
} as const;

export const features = {
  eyebrow: "Why Lumen",
  headline: "Everything you need to answer 'did that work?'",
  subhead:
    "Three things most analytics tools make you stitch together yourself. Lumen ships them wired up.",
  items: [
    {
      icon: "activity" as const,
      title: "Live funnels",
      body: "Watch conversion move as you deploy. Funnels recompute in-stream, so a regression shows up in seconds — not in tomorrow's batch job.",
    },
    {
      icon: "gitBranch" as const,
      title: "Release diffing",
      body: "Every metric is annotated with the deploy that preceded it. Pick two releases and Lumen tells you exactly which cohorts diverged.",
    },
    {
      icon: "users" as const,
      title: "Shared definitions",
      body: "One metric catalogue for the whole company. When someone changes what 'active user' means, everyone's charts update together.",
    },
  ],
} as const;

export const socialProof = {
  eyebrow: "Trusted by teams shipping daily",
  logos: [
    "Northwind",
    "Aperture",
    "Contoso",
    "Initech",
    "Globex",
    "Umbra",
    "Soylent",
    "Vandelay",
  ],
  testimonials: [
    {
      quote:
        "We cut our weekly metrics review from ninety minutes to about fifteen. Not because Lumen is faster — because nobody shows up with a different number any more.",
      name: "Priya Raman",
      role: "VP Product, Northwind",
      initials: "PR",
    },
    {
      quote:
        "The release diff caught a checkout regression four hours after deploy. Previous stack would have surfaced it in the Monday report.",
      name: "Daniel Okafor",
      role: "Staff Engineer, Aperture",
      initials: "DO",
    },
    {
      quote:
        "Onboarding was genuinely five minutes. I had our activation funnel on a wall screen before the kickoff call ended.",
      name: "Mei Lin",
      role: "Head of Growth, Contoso",
      initials: "ML",
    },
  ],
} as const;

export const pricing = {
  eyebrow: "Pricing",
  headline: "Priced per event, not per seat",
  subhead:
    "Invite the whole company. You are billed for what you track, so nobody has to ration logins.",
  tiers: [
    {
      name: "Starter",
      price: "$0",
      cadence: "forever",
      description: "For side projects and early prototypes.",
      cta: { label: "Start free", href: "#" },
      featured: false,
      features: [
        "1M events / month",
        "Unlimited seats",
        "30-day retention",
        "Core funnels & retention",
        "Community support",
      ],
    },
    {
      name: "Growth",
      price: "$79",
      cadence: "/ month",
      description: "For teams shipping to real customers every week.",
      cta: { label: "Start 14-day trial", href: "#" },
      featured: true,
      badge: "Most popular",
      features: [
        "25M events / month",
        "Unlimited seats",
        "12-month retention",
        "Release diffing & annotations",
        "Session replay",
        "Slack + PagerDuty alerts",
      ],
    },
    {
      name: "Scale",
      price: "Custom",
      cadence: "",
      description: "For companies with compliance requirements and a data team.",
      cta: { label: "Talk to sales", href: "#" },
      featured: false,
      features: [
        "Unlimited events",
        "Unlimited retention",
        "SSO / SAML & audit logs",
        "Warehouse sync (BigQuery, Snowflake)",
        "99.99% uptime SLA",
        "Dedicated solutions engineer",
      ],
    },
  ],
} as const;

export const faq = {
  eyebrow: "FAQ",
  headline: "Questions people ask before signing up",
  items: [
    {
      q: "How long does setup actually take?",
      a: "Installing the SDK and seeing your first live event is typically under five minutes. Mapping your existing metric definitions across takes longer — most teams finish that in the first week, and we will do it with you on Growth and Scale.",
    },
    {
      q: "Can we migrate off our current tool without losing history?",
      a: "Yes. Lumen backfills from CSV, S3, or your warehouse, and we keep the original event timestamps so historical funnels stay accurate. There is no gap in your charts on the cutover date.",
    },
    {
      q: "What counts as an event?",
      a: "Any tracked user action you send us — a page view, a click, a server-side purchase. Identify calls, property updates, and internal Lumen queries are not billed.",
    },
    {
      q: "Where is our data stored?",
      a: "In the region you pick at signup: US, EU, or AU. Data never leaves that region, including backups. Scale customers can bring their own encryption keys.",
    },
    {
      q: "Do you have a student or non-profit plan?",
      a: "We do. Registered non-profits and accredited academic institutions get Growth at no cost — email us from your institutional address and we will switch it on.",
    },
    {
      q: "What happens if we go over our event limit?",
      a: "Nothing breaks. We keep ingesting and flag the overage in-app, then bill the difference at your plan's rate at the end of the cycle. We never silently drop events.",
    },
  ],
} as const;

export const footer = {
  blurb: "Product analytics that the whole team reads the same way.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
        { label: "DPA", href: "#" },
      ],
    },
  ],
  social: [
    { label: "GitHub", href: "#", icon: "github" as const },
    { label: "X", href: "#", icon: "x" as const },
    { label: "LinkedIn", href: "#", icon: "linkedin" as const },
  ],
} as const;
