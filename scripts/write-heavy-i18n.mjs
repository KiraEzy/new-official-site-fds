/**
 * Generates documentManagement + webContentManagement locale payloads (English source keys).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const documentManagement = {
  heroBadge: 'FOCAL Document Management System',
  heroLine1: 'Your Institutional',
  heroLine2Accent: 'Knowledge, Secured.',
  heroP1:
    'FOCAL Document Management System delivers a strategic and efficient information platform to help organizations convert rapidly growing unstructured information generated from daily business processes into useful business content.',
  heroP2:
    'It has broad capabilities with superior security and governance to centralize business content for efficient management, applications to deliver information within and beyond organizations, and collaborative tools to support dispersed workforces.',
  heroCta: 'Request Solution Brief',
  floatingEncryptLabel: 'Encryption',
  floatingEncryptValue: 'AES-256 at rest',
  benefitsSectionTitle: 'Benefits',
  officialBenefits: [
    {
      keyword: 'End-to-end document lifecycle management',
      detail:
        'Increase security and control while minimizing the risks of unauthorized access or unapproved changes.'
    },
    {
      keyword: 'Streamlined information sharing',
      detail: 'Enhances collaboration and operational efficiency across teams and channels.'
    },
    {
      keyword: 'Cloud-based delivery',
      detail: 'Publish, share, and access vital information assets from virtually any location.'
    },
    {
      keyword: 'Multi-device access',
      detail: 'Consistent reach via desktop, smartphone, and tablet.'
    },
    {
      keyword: 'Ease of use',
      detail: 'Straightforward experience so everyday adoption stays practical.'
    },
    {
      keyword: 'Unified FOCAL platform',
      detail: 'Integrates with other FOCAL products for one coherent information backbone and effective collaboration.'
    }
  ],
  platformEyebrow: 'Platform overview',
  platformTitle: 'Essential capabilities from creation to archiving',
  platformP1:
    'FOCAL Document Management System comes with essential capabilities to help users manage and control end-to-end document lifecycle from creation to archiving.',
  platformP2:
    'It provides unified storage to turn unstructured content into valuable information assets for more efficient document retrieval and processing. FOCAL DMS offers a robust and scalable architecture to manage your information assets.',
  capabilitiesEyebrow: 'Capabilities',
  capabilitiesTitle: 'Feature highlights',
  capabilitiesLead:
    'Capability areas referenced on the FOCAL DMS product description—condensed for scanning; engage FDS for programme-specific fit.',
  productFeatures: [
    {
      title: 'Cloud Central storage',
      desc: 'Centralises documents and files from dispersed teams into one governed repository—so retention, permissions, and search stay consistent instead of scattered across drives and mailboxes.'
    },
    {
      title: '256-bit Encryption',
      desc: 'Protects information at rest on the server using AES 256-bit encryption.'
    },
    {
      title: 'Folder Tree',
      desc: 'Build folder hierarchies under governed roots with permission control aligned to how teams organise work.'
    },
    {
      title: 'Document Control',
      desc: 'Fine-grained privileges such as Read, Write, and Delete so only appropriate users reach sensitive documents.'
    },
    {
      title: 'Role Based Security',
      desc: 'Maps access to the roles people perform—keeping rights aligned with organisational goals, security policies, and regulatory expectations.'
    },
    {
      title: 'User Group Management',
      desc: 'Create groups and assign users for permission control based on roles and logical groupings across the organisation.'
    },
    {
      title: 'Version Control',
      desc: 'Tracks edits over time with revision history, rollback to prior revisions, and corrections when mistakes occur.'
    },
    {
      title: 'Check-in / Check-out',
      desc: 'Restricts edit rights to one user at a time to prevent conflicting saves—supporting simpler, safer versioning.'
    },
    {
      title: 'Search',
      desc: 'Find folders and documents by name, description, and document indexes.'
    },
    {
      title: 'Content / Keyword search',
      desc: 'Locate documents by words or phrases inside content for deeper discovery.'
    },
    {
      title: 'User-defined Document Index',
      desc: 'Define filing indexes by document type and reuse them for faster search and consistent filing.'
    },
    {
      title: 'Audit Log',
      desc: 'System-generated, tamper-evident records of actions such as logon, read, search, edit, and delete—for security, compliance, and discovery.'
    },
    {
      title: 'Sharing',
      desc: 'Share folders and documents with security guardrails and optional time limits.'
    },
    {
      title: 'Dashboard',
      desc: 'At-a-glance visibility into activity plus shortcuts to recently accessed documents and shared folders.'
    },
    {
      title: 'Notification',
      desc: 'Alerts users when folders or documents are shared with them.'
    },
    {
      title: 'Life cycle Maintenance',
      desc: 'Define lifecycle states (e.g. Draft, Review, Publish, Close) and the actions that move documents between states.'
    }
  ],
  intelBandLine1: 'Operational intelligence',
  intelBandAccent: '& governance signals',
  intelligenceHighlights: [
    'Full lifecycle coverage—from creation and collaboration through archiving and disposition discipline.',
    'Cloud-friendly operating model for publishing and sharing critical information assets.',
    'Thin-client, web-based delivery suited to distributed teams and mixed device estates.',
    'Lifecycle states with governed transitions (e.g. Draft → Review → Publish → Close).',
    'Tamper-evident audit logging aligned to security enforcement and compliance verification.',
    'Managed sharing with optional expiry—plus proactive notifications on inbound shares.',
    'Dashboard insight into recent activity, documents, and shared folders.',
    'Designed to interoperate with other FOCAL suite components as a unified collaboration backbone.'
  ],
  complianceTitle: 'Security, audit & compliance posture',
  complianceBody:
    'FOCAL DMS targets demanding environments: encryption and privileged access reduce exposure, while audit trails and lifecycle tooling support verification—not anecdotal reporting—when regulators or legal workflows ask for proof.',
  badgeAes: 'AES-256 Encryption',
  badgeAudit: 'Tamper-evident Audit Log',
  badgeLifecycle: 'Lifecycle State Control',
  specEyebrow: 'Specifications',
  specTitle: 'Representative technical baseline',
  specIntro:
    'Published stack guidance from the product materials—confirm current supported versions and sizing with your FDS engagement team before procurement or migration planning.',
  specLines: [
    'Platforms: Red Hat Enterprise Linux 6 or above; Windows Server 2008 or above.',
    'Application runtime: Java JDK/JRE 1.6 or above.',
    'Application server: JBoss 7 or above.',
    'Database: MySQL 5.5+; Microsoft SQL Server 2008+; Oracle Database 11g or above.',
    'Web browsers (published baseline): Apple Safari 7+; Google Chrome 38+; Microsoft Internet Explorer 8+; Mozilla Firefox 31+.'
  ],
  ctaTitle: 'Consolidate Your Digital Assets',
  ctaBody:
    'Bring policy, searchability, and collaboration together on the same FOCAL foundation Hong Kong organisations rely on for mission-critical programmes.',
  ctaButton: 'Contact Specialist'
};

const webContentManagement = {
  heroBadge: 'FOCAL Web Content Management',
  heroLine1: 'Master Your',
  heroLine2Accent: 'Digital Presence.',
  heroCtaPrimary: 'Request demonstration',
  exploreEyebrow: 'Explore',
  exploreTitle: 'How teams use FOCAL WCM',
  tabOverview: 'Overview',
  tabPublishingFlow: 'Publishing flow',
  overviewChannelTitle: 'Channel-ready web operations',
  overviewChannelLead:
    'FOCAL WCM unifies creating, managing, and publishing web content so the right people see the right message at the right time—with stronger editorial productivity.',
  overviewChannelUnified:
    'Deliver coherent experiences across channels; routine updates stay with business teams instead of IT backlogs.',
  officialBenefits: [
    'Publish or refresh pages with minimal effort.',
    'Steer look-and-feel and page content from one stack.',
    'Site-wide search for faster discovery.',
    'Schedule go-live by date, time, or recurring slots.',
    'Extensions grow capability without replacing the core.'
  ],
  capabilitiesEyebrow: 'Capabilities',
  modulesSidebarTitle: 'Modules & components',
  modulesSidebarSummary:
    'Editorial tooling plus ready-made modules—navigation, media, search, syndication—so teams publish coherent sites without serial IT dependency.',
  modulesSidebarBenefitsTitle: 'Benefits',
  modulesSidebarBenefits: [
    'Publish & schedule with minimal friction.',
    'Steer presentation and page content together.',
    'Site-wide search and room to extend.'
  ],
  modulesFooterNote:
    'Mirrors the public module list—confirm packaging with FDS for your programme.',
  workflowSteps: [
    {
      step: 'Author & assemble',
      desc: 'Contributors compose articles and plug in modular components (news flashes, banners, HTML blocks) aligned to their permissions.'
    },
    {
      step: 'Review & placement',
      desc: 'Editors validate tone, links, and placement before modules appear in navigation slots—keeping public messaging coherent.'
    },
    {
      step: 'Schedule & publish',
      desc: 'Use scheduling to align go-live moments with campaigns or maintenance windows instead of manual redeploy rituals.'
    },
    {
      step: 'Archive & retain',
      desc: 'Automated archival preserves historical pages by period while the outward-facing site emphasises fresh, authoritative content.'
    }
  ],
  productFeatures: [
    {
      title: 'Central Storage',
      desc: 'Keeps pages, modules, and media flowing through one governed staging posture—reducing drift between environments while editors iterate on site-wide presentation.'
    },
    {
      title: 'Web Content Archive',
      desc: 'Archives web content automatically on a pre-defined schedule—by month or year—so the live site stays current while historical pages remain available for internal and external obligations.'
    },
    {
      title: 'Banners and Feeds Management',
      desc: 'Configure banners and feeds for business needs: define display windows, caps on impressions or clicks before retirement, and varied promotional placements.'
    },
    {
      title: 'Custom HTML',
      desc: 'Author custom modules containing HTML-based content—text, imagery, and links—where bespoke layout is required alongside structured components.'
    },
    {
      title: 'Multiple Accounts',
      desc: 'Multiple editorial accounts so designated contributors change only the sections they own—reducing accidental cross-site edits.'
    },
    {
      title: 'Menu Manager',
      desc: 'Ready-to-use menu templates to define site navigation without rebuilding markup by hand each time.'
    },
    {
      title: 'Most read & latest news',
      desc: 'Surface the most-read articles alongside the newest additions so high-interest stories stay visible.'
    },
    {
      title: 'News flash',
      desc: 'Presents content items drawn from configured section/category lists for timely announcements.'
    },
    {
      title: 'Polls',
      desc: 'Front-end delivery for the polls component—visitor input captured where your templates expose it.'
    },
    {
      title: 'Random image',
      desc: 'Rotate imagery from a nominated folder to keep landing zones visually fresh within governed libraries.'
    },
    {
      title: 'Related items',
      desc: 'Uses metadata keywords to recommend sibling articles—deepening topical journeys without manual link curation for every page.'
    },
    {
      title: 'Search',
      desc: 'Lets visitors launch a basic search from their current location and jump straight into results.'
    },
    {
      title: 'Sections',
      desc: 'Lists article sections configured in the site structure so browsing stays aligned with your taxonomy.'
    },
    {
      title: 'Syndicate',
      desc: 'Shows feed types available for syndication—making outbound content programmes easier to discover.'
    },
    {
      title: 'Wrapper',
      desc: 'Embeds another page by URL inside a chosen module position—useful for bridging legacy tools or external microsites.'
    }
  ],
  channelHighlightTitleLine1: 'Built for editorial velocity',
  channelHighlightTitleAccent: '& governed delivery',
  channelHighlights: [
    'Single integrated backbone for immersive experiences across your digital surface area—not isolated microsites per initiative.',
    'Business-led publishing cycles decouple everyday updates from central IT backlog risk.',
    'Composable modules (polls, feeds, related reading, wrappers) extend functionality without abandoning governance templates.',
    'Scheduling plus archival pairs outward freshness with internal retention discipline.',
    'Central storage underpins repeatable layouts, predictable deployments, and fewer “snowflake” environments.'
  ],
  guardrailsTitle: 'Operational guardrails',
  guardrailsBody:
    'Multiple accounts, modular placements, scheduling, and archival routines combine so contributors move quickly without forfeiting visibility into what is live, what is staged, and what must be retained.',
  guardrailAccount: 'Scoped editorial accounts',
  guardrailSchedule: 'Timed publishing windows',
  guardrailRetention: 'Scheduled archival retention',
  ctaBandTitle: 'Ship confident web experiences',
  ctaBandLead:
    'Pair editorial autonomy with the modular depth Hong Kong enterprises expect from the broader FOCAL portfolio.',
  ctaBandButton: 'Contact specialist',
  heroVisualCaption: 'Immersive digital content'
};

function write(localeDir, dm, wcm) {
  fs.mkdirSync(localeDir, { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'documentManagement.json'), JSON.stringify(dm, null, 2), 'utf8');
  fs.writeFileSync(path.join(localeDir, 'webContentManagement.json'), JSON.stringify(wcm, null, 2), 'utf8');
}

const enDir = path.join(root, 'src/i18n/locales/en');
write(enDir, documentManagement, webContentManagement);

console.log('Wrote heavy locale files to', enDir);
