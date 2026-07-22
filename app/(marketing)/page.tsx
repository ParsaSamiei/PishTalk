import { HeroSection } from "@/components/sections/HeroSection";
import { NextEventSection } from "@/components/sections/NextEventSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyAttendSection } from "@/components/sections/WhyAttendSection";
import { EventTimelineSection } from "@/components/sections/EventTimelineSection";
import { PreviousEventsSection } from "@/components/sections/PreviousEventsSection";
import { GalleryPreviewSection } from "@/components/sections/GalleryPreviewSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { LatestBlogsSection } from "@/components/sections/LatestBlogsSection";
import { RulesPreviewSection } from "@/components/sections/RulesPreviewSection";
import { FaqPreviewSection } from "@/components/sections/FaqPreviewSection";
import { ContactSection } from "@/components/sections/ContactSection";

import { getNextEvent, getPastEvents } from "@/features/events/actions/getEvents";
import { getLatestGalleryImages } from "@/features/gallery/actions/getGallery";
import { getLatestResources } from "@/features/resources/actions/getResources";
import { getLatestBlogs } from "@/features/blogs/actions/getBlogs";
import { getFaqs } from "@/features/faq/actions/getFaqs";
import { getRules } from "@/lib/rules";
import { getSiteSettings } from "@/lib/site-settings";

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
  const [nextEvent, pastEvents, galleryImages, resources, blogs, faqs, rules, settings] =
    await Promise.all([
      getNextEvent(),
      getPastEvents(6),
      getLatestGalleryImages(8),
      getLatestResources(6),
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
      <EventTimelineSection event={nextEvent} />
      <PreviousEventsSection events={pastEvents} />
      <GalleryPreviewSection images={galleryImages} />
      <ResourcesSection resources={resources} />
      <LatestBlogsSection blogs={blogs} />
      <RulesPreviewSection rules={rules} />
      <FaqPreviewSection faqs={faqs} />
      <ContactSection
        contactEmail={settings.contactEmail}
        phone={settings.phone}
        address={settings.address}
        instagram={settings.instagram}
        telegram={settings.telegram}
      />
    </>
  );
}
