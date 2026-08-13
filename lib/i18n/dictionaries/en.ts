import type { Dictionary } from "./types";

/**
 * English dictionary.
 *
 * Typed as `Dictionary` (derived from `fa.ts`), so a missing or misspelled
 * key is a compile error rather than a silent fallback at runtime.
 */
export const en: Dictionary = {
  nav: {
    home: "Home",
    events: "Events",
    blog: "Blog",
    resources: "Resources",
    gallery: "Gallery",
    rules: "Rules",
    support: "Support",
    faq: "FAQ",
    about: "About",
    contact: "Contact",
    registerCta: "Register for an event",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  common: {
    viewAll: "View all",
    viewMore: "Learn more",
    view: "View",
    download: "Download",
    details: "View details",
    register: "Register",
    backHome: "Back to home",
    tryAgain: "Try again",
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    share: "Share",
    linkCopied: "Link copied",
    optional: "optional",
    loading: "Loading…",
    minutesRead: "min read",
    breadcrumbLabel: "Breadcrumb",
    paginationLabel: "Pagination",
  },

  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },

  language: {
    label: "Language",
    switchTo: "Switch to Persian",
    current: "Current language: English",
  },

  hero: {
    club: "Pishnam Robotics Club",
    titleLead: "A community for engineers in",
    titleHighlight: "Robotics",
    titleTail: " and AI",
    subtitle:
      "Every month we gather to learn, talk and network — alongside engineers and enthusiasts walking a similar path.",
    nextEventPrefix: "Next event",
    aboutCta: "About Pishtalk",
    scrollLabel: "Scroll to next section",
    registeredCountSuffix: "people have registered for Pishtalk events so far",
  },

  about: {
    eyebrow: "About Pishtalk",
    title: "Where ideas turn into conversation",
    description:
      "Pishtalk is a monthly event hosted by the Pishnam Robotics Club — a space for engineers, students and enthusiasts in robotics and AI to learn, share their experience and get to know one another.",
    body: "Every Pishtalk event features an expert talk, an open discussion and time to network with the community. Our focus is on the quality of the content and genuine connection between attendees, rather than simply running a large event.",
    pageTitle: "About us",
    pageHeading: "About Pishtalk",
    pageLead: "A community for engineers in robotics, AI and technology.",
    pageMetaDescription: "About Pishtalk and the Pishnam Robotics Club.",
    paragraph1:
      "Pishtalk is a monthly event hosted by the Pishnam Robotics Club. Our goal is to create a space where engineers, students and people interested in robotics and AI can share what they know, learn from each other's experience and build real professional relationships.",
    paragraph2:
      "Every Pishtalk event includes an expert talk, an open discussion and time for networking. We care about the quality of the content and about keeping the community small, so every attendee gets a real chance to take part in the conversation.",
    paragraph3:
      "Pishtalk is part of the educational and community work of the Pishnam Robotics Club, which teaches robotics, runs competitions and develops university teams.",
    pishnamCta: "Visit the Pishnam website",
    joinPrompt: "Want to join the next event?",
    seeEvents: "Browse events",
  },

  whyAttend: {
    eyebrow: "Why Pishtalk?",
    title: "Why you should join Pishtalk",
    items: {
      learning: {
        title: "Shared learning",
        description:
          "Share your knowledge and hands-on experience with other engineers.",
      },
      networking: {
        title: "Networking",
        description:
          "Meet engineers, students and researchers working in your field.",
      },
      tech: {
        title: "Latest technology",
        description: "Keep up with the newest advances in robotics and AI.",
      },
      talks: {
        title: "Expert talks",
        description:
          "Learn from the experience of specialist speakers at every event.",
      },
      community: {
        title: "An active community",
        description:
          "Become part of a growing community of engineers and technology enthusiasts.",
      },
      growth: {
        title: "Professional growth",
        description:
          "Widen your opportunities for collaboration and career growth in robotics.",
      },
    },
  },

  timeline: {
    eyebrow: "Event schedule",
    title: "How an evening at Pishtalk unfolds",
    description:
      "From arrival to networking, here's how you'll experience a Pishtalk event.",
    emptyTitle: "The next event's schedule hasn't been announced yet",
    emptyDescription:
      "The full schedule will appear here as soon as it's confirmed.",
  },

  nextEvent: {
    eyebrow: "Next event",
    title: "Join us at the upcoming event",
    emptyTitle: "The next event will be announced soon",
    emptyDescription:
      "Follow the events page to hear about the date of the next event.",
    seePast: "Browse past events",
    countdownLabel: "Time remaining until the next event",
  },

  countdown: {
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
  },

  events: {
    pageTitle: "Events",
    metaDescription: "Every Pishtalk event, upcoming and past, on one page.",
    lead: "Don't miss the upcoming event, and browse the archive of past Pishtalk events.",
    upcoming: "Upcoming",
    past: "Past",
    filterUpcoming: "Upcoming",
    filterPast: "Past",
    searchPlaceholder: "Search events…",
    searchLabel: "Search events",
    searchSubmit: "Search",
    notFoundSearch: "No events matched your search",
    emptyPast: "No past events yet",
    emptyUpcoming: "No upcoming events scheduled",
    searchHint: "Try a different term or change the filter.",
    announceHint:
      "Pishtalk events are announced here as soon as they're confirmed.",
    notFound: "Event not found",
    registerClosed: "Registration for this event is closed",
    registerOpen: "Register for this event",
    pastNotice:
      "This event has already taken place. Follow the events page for the next one.",
    aboutEvent: "About this event",
    speaker: "Speaker",
    schedule: "Schedule",
    eventResources: "Resources from this event",
    eventGallery: "Gallery from this event",
    viewFullGallery: "View the full gallery",
    to: "to",
    archiveEyebrow: "Archive",
    archiveTitle: "Past Pishtalk events",
    archiveEmptyTitle: "No events have been held yet",
    archiveEmptyDescription:
      "The first Pishtalk event is coming soon and will be archived here.",
  },

  blog: {
    pageTitle: "Blog",
    metaDescription:
      "Writing and notes from the Pishtalk community on robotics, AI and technology.",
    lead: "Notes and experiences from the Pishtalk community on robotics, AI and technology.",
    emptyTitle: "Nothing published yet",
    emptyDescription: "The first Pishtalk blog posts are coming soon.",
    latestEyebrow: "Blog",
    latestTitle: "Latest posts",
    viewAllPosts: "View all posts",
    notFound: "Post not found",
    author: "By the Pishtalk team",
    homeEmptyDescription:
      "The first Pishtalk blog posts will appear here soon.",
  },

  resources: {
    pageTitle: "Resources",
    metaDescription: "Slides, papers and links from Pishtalk events.",
    lead: "Slides, papers and links left behind by Pishtalk events.",
    emptyTitle: "No resources published yet",
    emptyDescription:
      "Resources from events will be available here once published.",
    general: "General resources",
    sectionEyebrow: "Learning resources",
    sectionTitle: "Keep on learning",
    viewAllResources: "View all resources",
    homeEmptyDescription:
      "Slides, papers and links from events will be available here once published.",
    types: {
      PDF: "PDF",
      PRESENTATION: "Slides",
      GITHUB: "GitHub",
      VIDEO: "Video",
      RESEARCH_PAPER: "Research paper",
      EXTERNAL_LINK: "External link",
    },
  },

  gallery: {
    pageTitle: "Gallery",
    metaDescription: "Photos from Pishtalk events.",
    lead: "Look back on moments from past Pishtalk events.",
    emptyTitle: "The gallery is still empty",
    emptyDescription:
      "Once the first event has been held, its photos will appear here.",
    homeEmptyDescription:
      "Once the first event has been held, its photos will appear in this section.",
    sectionTitle: "Moments from Pishtalk events",
    viewFull: "View the full gallery",
    images: "photos",
    videos: "videos",
    videosHeading: "Videos",
    notFound: "Gallery not found",
    noImages: "No photos have been added for this event",
    imageAlt: "A photo from a Pishtalk event",
    lightboxLabel: "Gallery image viewer",
    prevImage: "Previous image",
    nextImage: "Next image",
    galleryOf: "Gallery:",
    mediaOf: "Photos and videos from",
  },

  faq: {
    pageTitle: "FAQ",
    metaDescription: "Answers to common questions about Pishtalk.",
    lead: "Answers to the questions we're asked most about Pishtalk.",
    emptyTitle: "No questions yet",
    emptyDescription:
      "The questions attendees ask most will be answered here soon.",
    previewEyebrow: "FAQ",
    previewTitle: "Common questions",
    viewAllQuestions: "View all questions",
  },

  rules: {
    pageTitle: "Rules",
    metaDescription: "The rules for attending Pishtalk events.",
    lead: "To keep Pishtalk a safe and worthwhile space for everyone, please follow these rules.",
    emptyTitle: "The Rules is coming soon",
    emptyDescription:
      "The rules for attending Pishtalk events will appear here soon.",
    previewTitle: "Attending Pishtalk: the ground rules",
    viewFull: "Read the full Rules",
  },

  support: {
    pageTitle: "Support Pishtalk",
    metaDescription: "Support Pishtalk and meet the supporters behind it.",
    lead: "Pishtalk is supported by people and organizations who care about the growth of the Persian-speaking robotics and AI community. All financial support we receive goes directly back into the community and the operation of Pishtalk — including hosting, maintaining the platform, and organizing and running community events. Pishtalk is not operated as a for-profit website, and no support is taken as personal profit.",
    contactCta:
      "If you'd like to support Pishtalk and help us keep building this community, please get in touch through the Contact page.",
    supportersTitle: "Pishtalk's supporters",
    emptyTitle: "No supporters listed yet",
    emptyDescription: "Pishtalk's supporters will be introduced here soon.",
    paymentTitle: "Financial support",
    paymentLead:
      "Transfer any amount to the card number below, then send us a photo of your receipt using the form so we can record your support.",
    cardNumber: "Card number",
    cardHolder: "Account holder",
    sheba: "SHEBA (IBAN)",
    copy: "Copy",
    copied: "Copied",
    toman: "Toman",
    formTitle: "Send your receipt",
    fullNameLabel: "Full name",
    phoneLabel: "Mobile number",
    amountLabel: "Amount transferred (Toman)",
    receiptLabel: "Receipt image",
    receiptHint: "JPG, PNG or WebP — up to 6 MB",
    chooseFile: "Choose receipt image",
    changeFile: "Change receipt image",
    removeFile: "Remove receipt image",
    noFileSelected: "No file selected",
    submit: "Send receipt",
    submitting: "Sending...",
    successTitle: "We've received your receipt",
    successBody:
      "Your support will be recorded once we've reviewed it. Thank you for backing Pishtalk.",
    submitAnother: "Send another receipt",
  },

  contact: {
    pageTitle: "Contact",
    metaDescription:
      "Get in touch with the Pishtalk team about collaborating, speaking or anything else.",
    eyebrow: "Contact us",
    title: "Have a question?",
    description:
      "Leave us a message about collaborating, speaking or anything else.",
    successTitle: "Your message has been sent",
    successBody: "We'll be in touch soon. Thank you!",
    sendAnother: "Send another message",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    phoneHint: "Add it if you'd rather we called you back.",
    message: "Message",
    submit: "Send message",
  },

  registration: {
    firstName: "First name",
    lastName: "Last name",
    phone: "Mobile number",
    email: "Email (optional)",
    university: "University (optional)",
    company: "Company (optional)",
    profession: "Profession (optional)",
    notes: "About you & why you want to attend",
    notesHint:
      "Please write at least a few sentences covering:\n" +
      "• Your current job, field of study, or area of work (e.g. CS undergrad, web developer, robotics hobbyist...)\n" +
      "• Why you want to attend this event — what specifically are you hoping to get out of it?\n" +
      "• A bit about yourself — your background or relevant experience, so we know who you are.\n" +
      'This is used only to review and approve registrations — please avoid one- or two-word answers like "interested".',
    certificateName: "Name for certificate of attendance (Latin script)",
    certificateNameHint:
      "Your name looks like it's written in Persian. Enter your name in Latin script so it can be printed on your certificate of attendance.",
    eligibility:
      "I confirm that I am at least 18 years old and have a degree in, or am currently studying, robotics, engineering, computer science, or a related field.",
    submit: "Register for this event",
    successTitle: "Registration complete",
    successHeading: "You're registered",
    successBody:
      "Your resume will be reviewed. If approved, you'll receive an SMS with a confirmation and the event details.",
    viewMyRegistrations: "View my Registrations",
    lookupTitle: "My Registrations",
    lookupDescription:
      "Enter the mobile number and last name you used when registering to see which events you've signed up for and your attendance status.",
    lookupSubmit: "Search",
    lookupEmptyTitle: "No Registrations found",
    lookupEmptyDescription:
      "We couldn't find any Registrations for that mobile number and last name. Double-check what you entered.",
    statusRegistered: "Registered",
    statusPending: "Pending review",
    statusApproved: "Approved",
    statusRejected: "Not approved",
    statusAttended: "Attended",
    statusCancelled: "Cancelled",
    approvalPageTitle: "Registration confirmed",
    approvalHeading: "Your registration is confirmed",
    approvalBody: "We're glad you'll be joining us. Event details are below.",
    approvalNotFoundTitle: "Invalid link",
    approvalNotFoundBody: "This registration link isn't valid or has expired.",
    approvalNotApprovedTitle: "Not approved yet",
    approvalNotApprovedBody:
      "Your registration hasn't been reviewed yet, or wasn't approved. Contact us if you have questions.",
    approvalDate: "Date",
    approvalTime: "Time",
    approvalLocation: "Location",
    approvalAttendeeName: "Attendee",
  },

  validation: {
    nameMin: "Name must be at least 2 characters",
    lastNameMin: "Last name must be at least 2 characters",
    emailInvalid: "Enter a valid email address",
    phoneInvalid: "Enter a valid phone number",
    mobileInvalid: "Mobile number must start with 09 and be 11 digits",
    messageMin: "Message must be at least 10 characters",
    notesMin:
      "Please write at least 30 characters about yourself and why you want to attend",
    notesMax: "This field must not exceed 500 characters",
    certificateNameRequired:
      "Enter your name in Latin script for your certificate of attendance",
    certificateNameInvalid: "This field must use Latin letters only",
    eligibilityRequired:
      "You must confirm you meet the attendance requirements to register",
    amountMin: "Amount must be at least 1,000 Toman",
    amountMax: "The amount you entered isn't valid",
    receiptRequired: "Choose an image of your payment receipt",
    receiptFormat: "Only JPG, PNG or WebP images are allowed",
  },

  errors: {
    generic: "Something went wrong. Please try again.",
    rateLimited: "Too many requests. Please try again shortly.",
    invalidInput: "The information you entered isn't valid.",
    contactFailed: "The message couldn't be sent. Please try again.",
    eventUnavailable: "This event isn't open for registration.",
    eventFull: "This event is at full capacity.",
    duplicatePhone: "This mobile number is already registered for this event.",
    registrationFailed: "Registration failed. Please try again.",
    pageTitle: "Something went wrong",
    pageBody: "We couldn't load this page. Please try again.",
    globalBody: "An error occurred on the site. Please try again.",
    uploadFailed: "The upload failed.",
    uploadTooLarge:
      "This image is too large to upload. Please choose a smaller file.",
    receiptFailed: "The receipt couldn't be sent. Please try again.",
    receiptDisabled: "Receipt submission isn't available right now.",
  },

  notFound: {
    metaTitle: "Page not found",
    metaDescription:
      "This page couldn't be found. The link may be wrong, or the page may have moved.",
    heading: "We couldn't find this page",
    body: "The link may be wrong, or this page may have moved or been deleted. Don't worry — you can find your way from here.",
    reportLink: "Report a broken link",
    mascot: "I don't know this place!",
  },

  footer: {
    tagline: "A community of robotics, AI and technology engineers",
    sponsors: "Partners and sponsors",
    quickLinks: "Quick links",
    quickLinksLabel: "Quick links",
    contactUs: "Get in touch",
    pishnamSite: "Pishnam website",
    rights: "All rights reserved.",
    instagram: "Pishtalk on Instagram",
    telegram: "Pishtalk on Telegram",
  },

  maintenance: {
    heading: "is being updated",
    body: "We're making some changes to the site. Please check back a little later.",
  },

  upload: {
    prompt: "Drag and drop an image, or click to choose one (max 10 MB)",
    uploading: "Uploading…",
    remove: "Remove image",
  },

  logo: {
    label: "Pishtalk — home",
    first: "Pish",
    second: "talk",
  },
};
