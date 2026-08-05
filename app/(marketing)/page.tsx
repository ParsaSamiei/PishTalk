import { HeroSection } from "@/components/sections/HeroSection";
import { NextEventSection } from "@/components/sections/NextEventSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyAttendSection } from "@/components/sections/WhyAttendSection";
import { EventTimelineSection } from "@/components/sections/EventTimelineSection";
// import { PreviousEventsSection } from "@/components/sections/PreviousEventsSection";
import { GalleryPreviewSection } from "@/components/sections/GalleryPreviewSection";
// import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { LatestBlogsSection } from "@/components/sections/LatestBlogsSection";
import { RulesPreviewSection } from "@/components/sections/RulesPreviewSection";
import { FaqPreviewSection } from "@/components/sections/FaqPreviewSection";
import { ContactSection } from "@/components/sections/ContactSection";

import {
  getNextEvent,
  // getPastEvents,
} from "@/features/events/actions/getEvents";
import { getLatestGalleryImages } from "@/features/gallery/actions/getGallery";
// import { getLatestResources } from "@/features/resources/actions/getResources";
import { getLatestBlogs } from "@/features/blogs/actions/getBlogs";
import { getFaqs } from "@/features/faq/actions/getFaqs";
import { getRules } from "@/lib/rules";
import { getSiteSettings } from "@/lib/site-settings";

// Without this, Next.js prerenders this page once at `next build` time and
// serves that snapshot forever. In the Docker build, `npm run build` runs
// before `prisma db push`/seeding, so the DB is empty/unreachable at build
// time — every getX() below hits its try/catch and returns null/[], and
// that empty HTML gets baked into .next/standalone permanently. Forcing
// dynamic rendering makes every request hit the DB fresh instead.
export const dynamic = "force-dynamic";

/**
 * Homepage. Section order follows docs/03_Information_Architecture.md
 * exactly: Hero → Next Event → About → Why Attend → Event Timeline →
 * Previous Events → Gallery Preview → Resources → Latest Blogs →
 * Rules Preview → FAQ Preview → Contact.
 *
 * All data is fetched in parallel; every section handles an empty
 * dataset gracefully rather than assuming content exists.
 */
export default async function HomePage() {
  const [
    nextEvent,
    // pastEvents,
    galleryImages,
    // resources,
    blogs,
    faqs,
    rules,
    settings,
  ] = await Promise.all([
    getNextEvent(),
    // getPastEvents(6),
    getLatestGalleryImages(8),
    // getLatestResources(6),
    getLatestBlogs(3),
    getFaqs(5),
    getRules(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSection nextEvent={nextEvent} />
      <NextEventSection event={nextEvent} />
      <AboutSection />
      <WhyAttendSection />
      <LatestBlogsSection blogs={blogs} />
      <EventTimelineSection event={nextEvent} />
      {/* <PreviousEventsSection events={pastEvents} /> */}
      <GalleryPreviewSection images={galleryImages} />
      {/* <ResourcesSection resources={resources} /> */}
      <RulesPreviewSection rules={rules} />
      <FaqPreviewSection faqs={faqs} />
      <ContactSection
        contactEmail={settings.contactEmail}
        phone={settings.phone}
        phone2={settings.phone2}
        address={settings.address}
        addressEn={settings.addressEn}
        instagram={settings.instagram}
        telegram={settings.telegram}
      />
    </>
  );
}
