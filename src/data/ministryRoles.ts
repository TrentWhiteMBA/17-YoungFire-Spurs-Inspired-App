export interface MinistryRoleOption {
  id: string;
  label: string;
  category: 'Spiritual & Intercession' | 'Service & Operations' | 'Creative & Media' | 'Leadership';
  description: string;
  defaultCalling: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const MINISTRY_ROLES: MinistryRoleOption[] = [
  {
    id: 'prayer_warrior',
    label: 'Prayer Warrior',
    category: 'Spiritual & Intercession',
    description: 'Intercessory prayer watch, altar intercession & warfare coverage for the sanctuary.',
    defaultCalling: 'Intercessory Prayer Watch & Altar Ministry',
    iconName: 'Flame',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'disciple',
    label: 'Disciple',
    category: 'Spiritual & Intercession',
    description: 'Active young adult disciple committed to Scripture study, fellowship & spiritual growth.',
    defaultCalling: 'Word Discipleship & Small Group Growth',
    iconName: 'Shield',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'photographer',
    label: 'Photographer / Media Crew',
    category: 'Creative & Media',
    description: 'Sanctuary photography, Kingdom video production, flyer design & creative visuals.',
    defaultCalling: 'Visual Media, Photography & Creative Production',
    iconName: 'Camera',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'event_facilitator',
    label: 'Event Facilitator',
    category: 'Leadership',
    description: 'Coordinating sanctuary fellowship gatherings, sisterhood/brotherhood huddles & retreats.',
    defaultCalling: 'Fellowship Operations & Event Coordination',
    iconName: 'Calendar',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'worship_minister',
    label: 'Worship & Praise Minister',
    category: 'Creative & Media',
    description: 'Vocal praise, instrumental worship, liturgical arts & gospel praise anthems.',
    defaultCalling: 'Contemporary & Gospel Praise Ministry',
    iconName: 'Music',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
    borderColor: 'border-indigo-500/40'
  },
  {
    id: 'hospitality_greeter',
    label: 'Hospitality & Greeter',
    category: 'Service & Operations',
    description: 'Welcoming first-time disciples, hosting fellowship dinners & connect card follow-up.',
    defaultCalling: 'Sanctuary Hospitality & Welcome Life',
    iconName: 'Heart',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    borderColor: 'border-rose-500/40'
  },
  {
    id: 'outreach_ambassador',
    label: 'Outreach & Evangelism Ambassador',
    category: 'Leadership',
    description: 'San Antonio community missions, campus outreach, marketplace testimony & benevolence.',
    defaultCalling: 'Community Outreach, Missions & Evangelism',
    iconName: 'Users',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    borderColor: 'border-orange-500/40'
  },
  {
    id: 'member',
    label: 'Member',
    category: 'Service & Operations',
    description: 'Active young adult participant in YoungFire and Joshua House of Worship fellowship.',
    defaultCalling: 'YoungFire Community Fellowship & Unity',
    iconName: 'CheckCircle2',
    badgeBg: 'bg-slate-500/20',
    badgeText: 'text-slate-300',
    borderColor: 'border-slate-500/40'
  }
];

export const ADMIN_SECURITY_PASSCODE = 'FIRE2026';

export function getRoleById(id?: string): MinistryRoleOption {
  return MINISTRY_ROLES.find(r => r.id === id) || MINISTRY_ROLES[1]; // default Disciple
}

export function getRoleByLabel(label?: string): MinistryRoleOption {
  if (!label) return MINISTRY_ROLES[1];
  const lower = label.toLowerCase();
  if (lower.includes('prayer')) return MINISTRY_ROLES[0];
  if (lower.includes('photo') || lower.includes('media')) return MINISTRY_ROLES[2];
  if (lower.includes('facilitat') || lower.includes('event')) return MINISTRY_ROLES[3];
  if (lower.includes('worship') || lower.includes('music')) return MINISTRY_ROLES[4];
  if (lower.includes('hospitality') || lower.includes('greet')) return MINISTRY_ROLES[5];
  if (lower.includes('outreach') || lower.includes('evangel')) return MINISTRY_ROLES[6];
  if (lower.includes('member')) return MINISTRY_ROLES[7];
  return MINISTRY_ROLES[1]; // default Disciple
}
