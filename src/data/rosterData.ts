export interface RosterMember {
  id: string;
  fullName: string;
  name?: string;
  role: string;
  calling: string;
  group: 'YoungFire' | 'Men On Fire' | 'Women Ignited' | 'All';
  churchMembership?: string;
  residence?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female';
  avatar?: string;
  birthday?: string; // MM-DD
  accountType?: 'member' | 'administrator';
  isAdmin?: boolean;
  ministryRole?: string;
  prayerRequests?: string;
  notes?: string;
}

/**
 * Strict Zero-Mock Data Policy:
 * Seed data contains ONLY the verified Lead Facilitators of Joshua House of Worship.
 * Zero placeholder/fictional members, mock birthdays, or placeholder emails.
 */
export const VERIFIED_LEAD_FACILITATORS: RosterMember[] = [
  {
    id: 'roster_lead_trent',
    fullName: 'Lead Facilitator Trent D. White',
    name: 'Lead Facilitator Trent D. White',
    role: 'Lead Facilitator',
    ministryRole: 'Lead Facilitator',
    calling: 'Sanctuary Leadership & Overseer',
    group: 'YoungFire',
    churchMembership: 'Joshua House of Worship',
    residence: 'San Antonio, TX',
    email: 'trentwhite0308@gmail.com',
    phone: '',
    gender: 'male',
    avatar: '/image_4.png',
    birthday: '03-08',
    accountType: 'administrator',
    isAdmin: true
  },
  {
    id: 'roster_lead_whitney',
    fullName: 'Lead Facilitator Whitney White',
    name: 'Lead Facilitator Whitney White',
    role: 'Lead Facilitator',
    ministryRole: 'Lead Facilitator',
    calling: 'Sanctuary Leadership & Overseer',
    group: 'YoungFire',
    churchMembership: 'Joshua House of Worship',
    residence: 'San Antonio, TX',
    email: 'whitneywhite@jhow.org',
    phone: '',
    gender: 'female',
    avatar: '/image_2.png',
    birthday: '06-15',
    accountType: 'administrator',
    isAdmin: true
  }
];

export const DEFAULT_LEAD_FACILITATORS = VERIFIED_LEAD_FACILITATORS;

/**
 * Normalize roster list by ensuring only real registered members and verified leads exist.
 * Strips out any stale mock identities (Caleb, Maya, etc.).
 */
export function normalizeRosterWithLeads(incoming: RosterMember[]): RosterMember[] {
  const filtered = (incoming || []).filter(m => 
    !['roster_caleb', 'roster_maya', 'roster_trent', 'roster_whitney', 'mock_1', 'mock_2', 'mock_3'].includes(m.id) &&
    !((m.fullName || m.name || '').toLowerCase().includes('caleb')) &&
    !((m.fullName || m.name || '').toLowerCase().includes('maya')) &&
    !((m.fullName || m.name || '').toLowerCase().includes('starter'))
  );

  let hasTrent = false;
  let hasWhitney = false;

  const normalized = filtered.map(m => {
    const isTrent = (m.fullName || m.name || '').toLowerCase().includes('trent') || (m.email || '').toLowerCase().includes('trent');
    const isWhitney = (m.fullName || m.name || '').toLowerCase().includes('whitney') || (m.email || '').toLowerCase().includes('whitney');
    if (isTrent) {
      hasTrent = true;
      return {
        ...m,
        id: 'roster_lead_trent',
        fullName: 'Lead Facilitator Trent D. White',
        name: 'Lead Facilitator Trent D. White',
        role: 'Lead Facilitator',
        ministryRole: 'Lead Facilitator',
        calling: 'Sanctuary Leadership & Overseer',
        accountType: 'administrator' as const,
        isAdmin: true,
        gender: 'male' as const,
        avatar: m.avatar || '/image_4.png'
      };
    }
    if (isWhitney) {
      hasWhitney = true;
      return {
        ...m,
        id: 'roster_lead_whitney',
        fullName: 'Lead Facilitator Whitney White',
        name: 'Lead Facilitator Whitney White',
        role: 'Lead Facilitator',
        ministryRole: 'Lead Facilitator',
        calling: 'Sanctuary Leadership & Overseer',
        accountType: 'administrator' as const,
        isAdmin: true,
        gender: 'female' as const,
        avatar: m.avatar || '/image_2.png'
      };
    }
    return m;
  });

  const finalLeads: RosterMember[] = [];
  if (!hasTrent) finalLeads.push(VERIFIED_LEAD_FACILITATORS[0]);
  if (!hasWhitney) finalLeads.push(VERIFIED_LEAD_FACILITATORS[1]);

  return [...finalLeads, ...normalized];
}
