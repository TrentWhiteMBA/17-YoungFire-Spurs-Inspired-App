export interface LessonAttachment {
  name: string;
  size: string;
  url?: string;
  dataUrl?: string;
  type?: string;
}

export interface DiscipleshipLesson {
  id: string;
  title: string;
  lessonTitle: string;
  seriesTitle?: string;
  teachingDate: string; // Locked creation/teaching date (YYYY-MM-DD)
  dateOrSeason?: string;
  facilitator?: string;
  teachers?: string;
  primaryPassage: string;
  scripturePassage?: string;
  bookId?: string;
  chapter?: number;
  theme?: string;
  summary: string;
  description?: string;
  notesContent?: string;
  studyNotes?: string;
  youtubeId?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  questions?: string[];
  challenge?: string;
  attachments?: LessonAttachment[];
  attachmentUrls?: string[];
  canEdit?: boolean;
}

export const INITIAL_AUTHENTIC_LESSONS: DiscipleshipLesson[] = [
  {
    id: 'lesson_1_armor_of_god',
    title: 'The Imperial Armor: Standing Unbroken in Spiritual Warfare',
    lessonTitle: 'The Imperial Armor: Standing Unbroken in Spiritual Warfare',
    seriesTitle: 'Imperial Foundations',
    teachingDate: '2026-01-12',
    dateOrSeason: 'Winter 2026 • Session 1',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White & Lead Facilitator Whitney White',
    primaryPassage: 'Ephesians 6:10-18',
    scripturePassage: 'Ephesians 6:10-18',
    bookId: 'EPH',
    chapter: 6,
    theme: 'Spiritual Warfare & Divine Readiness',
    summary: 'An expository breakdown of God\'s armor. Believers do not fight for victory, but from victory. Standing firm against spiritual darkness requires putting on every element: the belt of truth, breastplate of righteousness, shoes of peace, shield of faith, helmet of salvation, and sword of the Spirit.',
    description: 'An expository breakdown of God\'s armor. Believers do not fight for victory, but from victory. Standing firm against spiritual darkness requires putting on every element: the belt of truth, breastplate of righteousness, shoes of peace, shield of faith, helmet of salvation, and sword of the Spirit.',
    notesContent: `I. The Call to Imperial Strength (Ephesians 6:10)
- Greek: "endunamoo" (to be continually infused with explosive, divine strength).
- We do not stand in self-will or personality charisma, but in the power of His might.

II. The Tactical Reality of the Enemy (vv. 11-12)
- "Wiles" (methodia) implies strategic traps, deceptive philosophies, and tailored vulnerabilities.
- Our struggle is not against flesh and blood—never make your brother or sister the enemy.

III. The Armor of Light (vv. 14-17)
- Belt of Truth (Aletheia): Integrity, objective scriptural doctrine girding the inward motives.
- Breastplate of Righteousness: Christ's imputed perfection protecting our vital hearts.
- Gospel Shoes of Peace: Mobile stability in the storm, ready to advance with good news.
- Shield of Faith: Quenching the fiery darts of condemnation and cynicism.
- Helmet of Salvation: Divine guardianship of our thought life and mental renewal.
- Sword of the Spirit: The Rhema word of God spoken in authoritative conviction.

IV. Constant Vigilance (v. 18)
- Praying always with all prayer and supplication in the Spirit.`,
    studyNotes: `I. The Call to Imperial Strength (Ephesians 6:10)
- Greek: "endunamoo" (to be continually infused with explosive, divine strength).
- We do not stand in self-will or personality charisma, but in the power of His might.

II. The Tactical Reality of the Enemy (vv. 11-12)
- "Wiles" (methodia) implies strategic traps, deceptive philosophies, and tailored vulnerabilities.
- Our struggle is not against flesh and blood—never make your brother or sister the enemy.

III. The Armor of Light (vv. 14-17)
- Belt of Truth (Aletheia): Integrity, objective scriptural doctrine girding the inward motives.
- Breastplate of Righteousness: Christ's imputed perfection protecting our vital hearts.
- Gospel Shoes of Peace: Mobile stability in the storm, ready to advance with good news.
- Shield of Faith: Quenching the fiery darts of condemnation and cynicism.
- Helmet of Salvation: Divine guardianship of our thought life and mental renewal.
- Sword of the Spirit: The Rhema word of God spoken in authoritative conviction.

IV. Constant Vigilance (v. 18)
- Praying always with all prayer and supplication in the Spirit.`,
    youtubeId: '9jK-NcRmVcw',
    videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
    questions: [
      'Which piece of God\'s armor do you find yourself neglecting during high-stress weeks?',
      'How does knowing your battle is spiritual change how you respond to interpersonal conflict at work or church?',
      'What specific scripture can you memorize this week to wield as the Sword of the Spirit?'
    ],
    challenge: 'Identify one recurring mental lie the enemy speaks to you, write out the counter-scripture, and speak it aloud each morning.',
    attachments: [
      { name: 'Spiritual_Armor_Expository_Chart.pdf', size: '1.2 MB' },
      { name: 'Greek_Word_Study_Endunamoo.pdf', size: '420 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_2_crucified_identity',
    title: 'Crucified with Christ: The Cruciform Identity',
    lessonTitle: 'Crucified with Christ: The Cruciform Identity',
    seriesTitle: 'Imperial Foundations',
    teachingDate: '2026-01-26',
    dateOrSeason: 'Winter 2026 • Session 2',
    facilitator: 'Lead Facilitator Whitney White',
    teachers: 'Lead Facilitator Whitney White & Lead Facilitator Trent D. White',
    primaryPassage: 'Galatians 2:20',
    scripturePassage: 'Galatians 2:20',
    bookId: 'GAL',
    chapter: 2,
    theme: 'Crucified Life & Resurrection Power',
    summary: 'The Christian life is not self-improvement; it is an exchange of lives. My old self has been co-crucified with Christ, and the life I now live is fueled entirely by the indwelling Son of God who loved me and gave Himself for me.',
    description: 'The Christian life is not self-improvement; it is an exchange of lives. My old self has been co-crucified with Christ, and the life I now live is fueled entirely by the indwelling Son of God who loved me and gave Himself for me.',
    notesContent: `I. The Exchange of Personhood (Galatians 2:20a)
- "I have been crucified with Christ; it is no longer I who live, but Christ lives in me."
- Perfect tense in Greek: An accomplished historical event with perpetual, abiding consequences.
- The ego loses its throne; Christ occupies the epicenter of decision-making.

II. Faith in the Crucible of Daily Life (v. 20b)
- The life in the flesh is lived by faith in the Son of God.
- He loved me personally (individualized agape) and delivered Himself on my behalf.

III. Renouncing Self-Righteousness (v. 21)
- We do not nullify the grace of God through legalism or ascetic pride.
- Discipleship is learning to abide in the Vine, drawing daily sap from Christ's righteousness.`,
    studyNotes: `I. The Exchange of Personhood (Galatians 2:20a)
- "I have been crucified with Christ; it is no longer I who live, but Christ lives in me."
- Perfect tense in Greek: An accomplished historical event with perpetual, abiding consequences.
- The ego loses its throne; Christ occupies the epicenter of decision-making.

II. Faith in the Crucible of Daily Life (v. 20b)
- The life in the flesh is lived by faith in the Son of God.
- He loved me personally (individualized agape) and delivered Himself on my behalf.

III. Renouncing Self-Righteousness (v. 21)
- We do not nullify the grace of God through legalism or ascetic pride.
- Discipleship is learning to abide in the Vine, drawing daily sap from Christ's righteousness.`,
    youtubeId: 'W1qzZk_gKqI',
    videoUrl: 'https://www.youtube.com/watch?v=W1qzZk_gKqI',
    questions: [
      'In what practical areas do you still try to live the Christian life in your own human willpower?',
      'How does viewing yourself as already "co-crucified" change your reaction to being offended or unappreciated?',
      'What does it look like in real time to let Christ live through your hands and words today?'
    ],
    challenge: 'Whenever frustration or anger rises today, pause and pray: "Lord Jesus, live Your patience through me right now."',
    attachments: [
      { name: 'Galatians_Discipleship_Study.pdf', size: '890 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_3_living_altar',
    title: 'The Living Altar: Total Surrender in a Secular Age',
    lessonTitle: 'The Living Altar: Total Surrender in a Secular Age',
    seriesTitle: 'Imperial Foundations',
    teachingDate: '2026-02-09',
    dateOrSeason: 'Winter 2026 • Session 3',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White',
    primaryPassage: 'Romans 12:1-2',
    scripturePassage: 'Romans 12:1-2',
    bookId: 'ROM',
    chapter: 12,
    theme: 'Sanctification & Renewed Mind',
    summary: 'A call to present our bodies as living sacrifices, holy and pleasing to God. We refuse the mold of this world\'s trends and embrace total transformation through the daily renovation of our minds by the Holy Spirit.',
    description: 'A call to present our bodies as living sacrifices, holy and pleasing to God. We refuse the mold of this world\'s trends and embrace total transformation through the daily renovation of our minds by the Holy Spirit.',
    notesContent: `I. The Mercies of God as the Foundation (Romans 12:1)
- Paul builds upon chapters 1-11: Justification, election, adoption, and security.
- Dedication is the logical response ("logike latreia" = reasonable, rational priestly worship).

II. The Living Sacrifice
- Old Testament sacrifices were slain; New Covenant sacrifices are alive and sustained.
- Offering the physical body: eyes, ears, tongue, feet, and hands devoted to Kingdom honor.

III. Resisting Conformation (v. 2a)
- "Do not be conformed" (suschematizo): Don't allow this age to squeeze you into its fleeting mold.
- Media diet, financial values, and relationship standards must be interrogated by Scripture.

IV. The Metamorphosis of Mind (v. 2b)
- "Transformed" (metamorphoo): An inward reality radiating outward like Christ on Transfiguration.
- Proving and experiencing the good, pleasing, and perfect will of God.`,
    studyNotes: `I. The Mercies of God as the Foundation (Romans 12:1)
- Paul builds upon chapters 1-11: Justification, election, adoption, and security.
- Dedication is the logical response ("logike latreia" = reasonable, rational priestly worship).

II. The Living Sacrifice
- Old Testament sacrifices were slain; New Covenant sacrifices are alive and sustained.
- Offering the physical body: eyes, ears, tongue, feet, and hands devoted to Kingdom honor.

III. Resisting Conformation (v. 2a)
- "Do not be conformed" (suschematizo): Don't allow this age to squeeze you into its fleeting mold.
- Media diet, financial values, and relationship standards must be interrogated by Scripture.

IV. The Metamorphosis of Mind (v. 2b)
- "Transformed" (metamorphoo): An inward reality radiating outward like Christ on Transfiguration.
- Proving and experiencing the good, pleasing, and perfect will of God.`,
    youtubeId: 'v8uKeqpCq2w',
    videoUrl: 'https://www.youtube.com/watch?v=v8uKeqpCq2w',
    questions: [
      'What secular philosophies or cultural pressures most aggressively seek to shape your decisions?',
      'How can you actively cultivate "the renewing of the mind" through daily scripture immersion?',
      'What part of your physical life needs to be laid back on the altar this week?'
    ],
    challenge: 'Take a 24-hour social media fast this week, replacing phone screen time with Scripture meditation and journaled prayer.',
    attachments: [
      { name: 'Romans_12_Consecration_Guide.pdf', size: '1.5 MB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_4_walking_in_spirit',
    title: 'Walking in the Spirit: Overcoming the Desires of the Flesh',
    lessonTitle: 'Walking in the Spirit: Overcoming the Desires of the Flesh',
    seriesTitle: 'Imperial Foundations',
    teachingDate: '2026-02-23',
    dateOrSeason: 'Winter 2026 • Session 4',
    facilitator: 'Lead Facilitator Whitney White',
    teachers: 'Lead Facilitator Whitney White',
    primaryPassage: 'Galatians 5:16-25',
    scripturePassage: 'Galatians 5:16-25',
    bookId: 'GAL',
    chapter: 5,
    theme: 'Pneumatology & Moral Victory',
    summary: 'The tension between the flesh and the Spirit cannot be won through willpower alone. Walking in step with the Holy Spirit produces organic fruit: love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, and temperance.',
    description: 'The tension between the flesh and the Spirit cannot be won through willpower alone. Walking in step with the Holy Spirit produces organic fruit: love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, and temperance.',
    notesContent: `I. The Continuous Walk (Galatians 5:16)
- "Peripateite" (walk continually): An habitual step-by-step pace of communion with God.
- The promise: "You shall not fulfill the lust of the flesh." Focus on walking with the Spirit, not wrestling the shadow.

II. The Inner Warfare (vv. 17-18)
- The flesh craves against the Spirit, and the Spirit against the flesh.
- Freedom from the condemnation and mechanics of the legalistic letter.

III. Works of the Flesh vs. Fruit of the Spirit (vv. 19-23)
- Works of flesh: manufactured by human effort, producing destruction and division.
- Fruit of the Spirit: singular cluster born of the root of divine love (agape).

IV. Crucifying the Affections (vv. 24-25)
- Those who belong to Christ have crucified the flesh with its passions and desires.
- "Stoicheo" (v. 25): Keep in rank, step in cadence with the Holy Spirit's rhythm.`,
    studyNotes: `I. The Continuous Walk (Galatians 5:16)
- "Peripateite" (walk continually): An habitual step-by-step pace of communion with God.
- The promise: "You shall not fulfill the lust of the flesh." Focus on walking with the Spirit, not wrestling the shadow.

II. The Inner Warfare (vv. 17-18)
- The flesh craves against the Spirit, and the Spirit against the flesh.
- Freedom from the condemnation and mechanics of the legalistic letter.

III. Works of the Flesh vs. Fruit of the Spirit (vv. 19-23)
- Works of flesh: manufactured by human effort, producing destruction and division.
- Fruit of the Spirit: singular cluster born of the root of divine love (agape).

IV. Crucifying the Affections (vv. 24-25)
- Those who belong to Christ have crucified the flesh with its passions and desires.
- "Stoicheo" (v. 25): Keep in rank, step in cadence with the Holy Spirit's rhythm.`,
    youtubeId: 'mN3K_2i9yQw',
    videoUrl: 'https://www.youtube.com/watch?v=mN3K_2i9yQw',
    questions: [
      'Which aspect of the fruit of the Spirit is currently most under development in your character?',
      'How do you distinguish between the gentle conviction of the Holy Spirit and the accusatory guilt of the enemy?',
      'What practical trigger reminds you to realign your pace with the Spirit throughout your workday?'
    ],
    challenge: 'Practice the "breath prayer" of Galatians 5:25 whenever anxiety or temptation strikes today.',
    attachments: [
      { name: 'Fruit_of_the_Spirit_Discipleship_Wheel.pdf', size: '1.1 MB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_5_discipleship_mandate',
    title: 'The Discipleship Mandate: Multiplying Kingdom Believers',
    lessonTitle: 'The Discipleship Mandate: Multiplying Kingdom Believers',
    seriesTitle: 'Imperial Multiplication',
    teachingDate: '2026-03-09',
    dateOrSeason: 'Spring 2026 • Session 5',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White & Lead Facilitator Whitney White',
    primaryPassage: 'Matthew 28:18-20',
    scripturePassage: 'Matthew 28:18-20 & 2 Timothy 2:2',
    bookId: 'MAT',
    chapter: 28,
    theme: 'Evangelism & Faithful Multiplication',
    summary: 'Jesus did not command us to merely accumulate church attendees, but to make disciples of all nations. True discipleship is generational: what we have received, we entrust to faithful brothers and sisters who will teach others also.',
    description: 'Jesus did not command us to merely accumulate church attendees, but to make disciples of all nations. True discipleship is generational: what we have received, we entrust to faithful brothers and sisters who will teach others also.',
    notesContent: `I. The All-Encompassing Authority (Matthew 28:18)
- "All power (exousia) is given unto me in heaven and in earth."
- The Great Commission is backed by the imperial crown of the resurrected Lord.

II. The Imperative: Make Disciples (v. 19)
- "Matheteusate": Train pupils in doctrine, character, and practical obedience.
- Baptizing into the triune identity: Father, Son, and Holy Ghost.

III. Teaching Full Obedience (v. 20)
- Not just theoretical theology, but observing all commandments.
- The abiding promise: "Lo, I am with you always, even unto the end of the world."

IV. Four Generations of Multiplication (2 Timothy 2:2)
- Paul -> Timothy -> Faithful Men -> Others Also.
- Discipleship is intentional, relational, accountable, and transmissible.`,
    studyNotes: `I. The All-Encompassing Authority (Matthew 28:18)
- "All power (exousia) is given unto me in heaven and in earth."
- The Great Commission is backed by the imperial crown of the resurrected Lord.

II. The Imperative: Make Disciples (v. 19)
- "Matheteusate": Train pupils in doctrine, character, and practical obedience.
- Baptizing into the triune identity: Father, Son, and Holy Ghost.

III. Teaching Full Obedience (v. 20)
- Not just theoretical theology, but observing all commandments.
- The abiding promise: "Lo, I am with you always, even unto the end of the world."

IV. Four Generations of Multiplication (2 Timothy 2:2)
- Paul -> Timothy -> Faithful Men -> Others Also.
- Discipleship is intentional, relational, accountable, and transmissible.`,
    youtubeId: 'Hq0N7cT_3zI',
    videoUrl: 'https://www.youtube.com/watch?v=Hq0N7cT_3zI',
    questions: [
      'Who in your life has poured into you as a spiritual mentor or father/mother in the faith?',
      'Who is one younger believer or peer God has placed in your sphere to intentionally encourage?',
      'How does living in authentic fellowship protect disciples from drifting away from the faith?'
    ],
    challenge: 'Reach out to one younger brother or sister this week for coffee, prayer, and intentional spiritual encouragement.',
    attachments: [
      { name: 'Four_Generations_Multiplication_Map.pdf', size: '750 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_6_secret_place',
    title: 'The Secret Place: Intercessory Prayer and Fasting',
    lessonTitle: 'The Secret Place: Intercessory Prayer and Fasting',
    seriesTitle: 'Imperial Warfare',
    teachingDate: '2026-03-23',
    dateOrSeason: 'Spring 2026 • Session 6',
    facilitator: 'Lead Facilitator Whitney White',
    teachers: 'Lead Facilitator Whitney White & Lead Facilitator Trent D. White',
    primaryPassage: 'Matthew 6:5-18',
    scripturePassage: 'Matthew 6:5-18 & James 5:16',
    bookId: 'MAT',
    chapter: 6,
    theme: 'Intercession, Solitude & Fasting',
    summary: 'The public power of a disciple is determined in the secret closet of prayer. We dismantle religious hypocrisy and enter the inner chamber where the Father who sees in secret rewards openly. Fasting recalibrates spiritual appetite and releases breakthrough.',
    description: 'The public power of a disciple is determined in the secret closet of prayer. We dismantle religious hypocrisy and enter the inner chamber where the Father who sees in secret rewards openly. Fasting recalibrates spiritual appetite and releases breakthrough.',
    notesContent: `I. The Closet Principle (Matthew 6:6)
- "Tameion" (inner chamber / secret storehouse).
- Shutting the door against human applause and distraction.
- Communion precedes petition; knowing the Father's heart before asking for His hand.

II. The Disciples' Prayer Pattern (vv. 9-13)
- Hallowing the Father's Name: Worship and adoration.
- Seeking the Kingdom and Will: Aligning our ambitions with eternity.
- Daily Bread: Humble dependence for physical and spiritual provision.
- Forgiveness and Deliverance: Protecting the soul from bitterness and temptation.

III. The Spiritual Discipline of Fasting (vv. 16-18)
- "When ye fast"—Jesus treats fasting as a normative spiritual rhythm, not an optional elective.
- Starving the flesh to feast on divine revelation.`,
    studyNotes: `I. The Closet Principle (Matthew 6:6)
- "Tameion" (inner chamber / secret storehouse).
- Shutting the door against human applause and distraction.
- Communion precedes petition; knowing the Father's heart before asking for His hand.

II. The Disciples' Prayer Pattern (vv. 9-13)
- Hallowing the Father's Name: Worship and adoration.
- Seeking the Kingdom and Will: Aligning our ambitions with eternity.
- Daily Bread: Humble dependence for physical and spiritual provision.
- Forgiveness and Deliverance: Protecting the soul from bitterness and temptation.

III. The Spiritual Discipline of Fasting (vv. 16-18)
- "When ye fast"—Jesus treats fasting as a normative spiritual rhythm, not an optional elective.
- Starving the flesh to feast on divine revelation.`,
    youtubeId: 'dD4N8eY3_sA',
    videoUrl: 'https://www.youtube.com/watch?v=dD4N8eY3_sA',
    questions: [
      'What prevents you from spending consistent unhurried time in secret communion with God?',
      'How has fasting impacted your spiritual sensitivity in past seasons?',
      'How can we intercede more effectively for our city of San Antonio and Joshua House of Worship?'
    ],
    challenge: 'Set aside 20 minutes before sunrise tomorrow with no phone, open Bible only, in uninterrupted adoration and intercession.',
    attachments: [
      { name: 'Secret_Place_Prayer_Outline.pdf', size: '640 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_7_guarding_the_temple',
    title: 'Guarding the Temple: Purity, Integrity, and Honor',
    lessonTitle: 'Guarding the Temple: Purity, Integrity, and Honor',
    seriesTitle: 'Imperial Character',
    teachingDate: '2026-04-06',
    dateOrSeason: 'Spring 2026 • Session 7',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White',
    primaryPassage: '1 Corinthians 6:18-20',
    scripturePassage: '1 Corinthians 6:18-20 & 1 Thessalonians 4:3-8',
    bookId: '1CO',
    chapter: 6,
    theme: 'Holiness, Moral Purity & Sacred Living',
    summary: 'Our bodies are not our own; we have been bought with the infinite price of Christ\'s blood. Fleeing sexual immorality and maintaining pure eyes, conversations, and intentions is the hallmark of true spiritual strength.',
    description: 'Our bodies are not our own; we have been bought with the infinite price of Christ\'s blood. Fleeing sexual immorality and maintaining pure eyes, conversations, and intentions is the hallmark of true spiritual strength.',
    notesContent: `I. The Divine Ownership Claim (1 Corinthians 6:19-20)
- "Know ye not that your body is the temple of the Holy Ghost?"
- You are not your own property—you belong to the King who purchased you.

II. The Command to Flee (v. 18)
- Greek "Pheugo" (run for your life, as Joseph fled Potiphar's wife).
- We do not debate with sexual temptation; we run to the sanctuary of holiness.

III. Vessel Possessing (1 Thessalonians 4:3-5)
- "This is the will of God, even your sanctification."
- Learning to possess our vessel in sanctification and honor, not in lust of the pagans.

IV. Blood-Purchased Glorification
- Glorify God in your body, and in your spirit, which are God's.
- Guarding internet gateways, relationships, and private thoughts.`,
    studyNotes: `I. The Divine Ownership Claim (1 Corinthians 6:19-20)
- "Know ye not that your body is the temple of the Holy Ghost?"
- You are not your own property—you belong to the King who purchased you.

II. The Command to Flee (v. 18)
- Greek "Pheugo" (run for your life, as Joseph fled Potiphar's wife).
- We do not debate with sexual temptation; we run to the sanctuary of holiness.

III. Vessel Possessing (1 Thessalonians 4:3-5)
- "This is the will of God, even your sanctification."
- Learning to possess our vessel in sanctification and honor, not in lust of the pagans.

IV. Blood-Purchased Glorification
- Glorify God in your body, and in your spirit, which are God's.
- Guarding internet gateways, relationships, and private thoughts.`,
    youtubeId: 'qQ5P6zB1_3E',
    videoUrl: 'https://www.youtube.com/watch?v=qQ5P6zB1_3E',
    questions: [
      'What boundaries do you keep on digital media and screen time to protect your eyes and heart?',
      'Why does biblical holiness produce lasting joy rather than restriction?',
      'How can YoungFire brothers and sisters hold each other accountable with grace and confidentiality?'
    ],
    challenge: 'Set up intentional accountability with a trusted same-gender brother or sister in the ministry.',
    attachments: [
      { name: 'Purity_and_Honor_Covenant.pdf', size: '520 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_8_spiritual_authority',
    title: 'Spiritual Authority: Boldness in the Marketplace',
    lessonTitle: 'Spiritual Authority: Boldness in the Marketplace',
    seriesTitle: 'Imperial Character',
    teachingDate: '2026-04-20',
    dateOrSeason: 'Spring 2026 • Session 8',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White & Lead Facilitator Whitney White',
    primaryPassage: 'Acts 4:23-31',
    scripturePassage: 'Acts 4:23-31',
    bookId: 'ACT',
    chapter: 4,
    theme: 'Apostolic Boldness & Cultural Witness',
    summary: 'When confronted by opposition, the early church did not pray for an easier life; they prayed for supernatural boldness. YoungFire disciples are called to carry the Kingdom of God with excellence and authority into their professions, campuses, and neighborhoods.',
    description: 'When confronted by opposition, the early church did not pray for an easier life; they prayed for supernatural boldness. YoungFire disciples are called to carry the Kingdom of God with excellence and authority into their professions, campuses, and neighborhoods.',
    notesContent: `I. Returning to Their Own Company (Acts 4:23)
- Fellowship is our fortress in times of external cultural pressure.
- Reporting the opposition honestly to the body of believers.

II. Sovereign Theology as the Anchor (vv. 24-28)
- Addressing God as "Despotes" (absolute sovereign ruler of cosmos).
- Psalm 2 prophecy: Why do the heathen rage? God sits enthroned above rulers.

III. The Petition for Parresia (vv. 29-30)
- "Grant unto thy servants, that with all boldness (parresia) they may speak thy word."
- Stretching forth the hand to heal and work miracles in the name of Jesus.

IV. The Shaking and the Outpouring (v. 31)
- The place was shaken where they were assembled together.
- Filled with the Holy Ghost, speaking the Word with unstoppable courage.`,
    studyNotes: `I. Returning to Their Own Company (Acts 4:23)
- Fellowship is our fortress in times of external cultural pressure.
- Reporting the opposition honestly to the body of believers.

II. Sovereign Theology as the Anchor (vv. 24-28)
- Addressing God as "Despotes" (absolute sovereign ruler of cosmos).
- Psalm 2 prophecy: Why do the heathen rage? God sits enthroned above rulers.

III. The Petition for Parresia (vv. 29-30)
- "Grant unto thy servants, that with all boldness (parresia) they may speak thy word."
- Stretching forth the hand to heal and work miracles in the name of Jesus.

IV. The Shaking and the Outpouring (v. 31)
- The place was shaken where they were assembled together.
- Filled with the Holy Ghost, speaking the Word with unstoppable courage.`,
    youtubeId: 'jJ1B8fR6zXw',
    videoUrl: 'https://www.youtube.com/watch?v=jJ1B8fR6zXw',
    questions: [
      'In what workplace or social settings are you tempted to hide your faith or remain silent?',
      'How does confidence in God\'s sovereignty give you fearlessness before human criticism?',
      'What does "marketplace ministry" look like in your specific occupation or trade?'
    ],
    challenge: 'Initiate a faith conversation or offer to pray for a colleague, classmate, or neighbor this week.',
    attachments: [
      { name: 'Marketplace_Kingdom_Ambassador_Manual.pdf', size: '1.4 MB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_9_covenant_community',
    title: 'Covenant Community: Bearing One Another\'s Burdens',
    lessonTitle: 'Covenant Community: Bearing One Another\'s Burdens',
    seriesTitle: 'Imperial Fellowship',
    teachingDate: '2026-05-04',
    dateOrSeason: 'Spring 2026 • Session 9',
    facilitator: 'Lead Facilitator Whitney White',
    teachers: 'Lead Facilitator Whitney White',
    primaryPassage: 'Galatians 6:1-10',
    scripturePassage: 'Galatians 6:1-10 & Ecclesiastes 4:9-12',
    bookId: 'GAL',
    chapter: 6,
    theme: 'Covenant Brotherhood, Sisterhood & Restoration',
    summary: 'The solitary Christian is an easy target for the enemy. Two are better than one, and a three-strand cord is not quickly broken. We are called to restore those overtaken in faults with gentleness, carry one another\'s heavy loads, and never grow weary in doing good.',
    description: 'The solitary Christian is an easy target for the enemy. Two are better than one, and a three-strand cord is not quickly broken. We are called to restore those overtaken in faults with gentleness, carry one another\'s heavy loads, and never grow weary in doing good.',
    notesContent: `I. The Ministry of Spiritual Restoration (Galatians 6:1)
- "Katartizo" (mending broken nets, setting dislocated bones).
- Restoring with a spirit of meekness, mindful of our own frailty.

II. Fulfilling the Law of Christ (v. 2)
- "Bear ye one another\'s burdens, and so fulfil the law of Christ."
- The law of Christ is self-sacrificing agape love.

III. Personal Examination and Sowing (vv. 3-8)
- Rejecting self-deception and narcissistic spiritual pride.
- Sowing to the Spirit produces life everlasting; sowing to the flesh reaps corruption.

IV. The Harvest of Perseverance (vv. 9-10)
- Let us not be weary in well doing: in due season we shall reap if we faint not.
- Doing good especially unto them who are of the household of faith.`,
    studyNotes: `I. The Ministry of Spiritual Restoration (Galatians 6:1)
- "Katartizo" (mending broken nets, setting dislocated bones).
- Restoring with a spirit of meekness, mindful of our own frailty.

II. Fulfilling the Law of Christ (v. 2)
- "Bear ye one another\'s burdens, and so fulfil the law of Christ."
- The law of Christ is self-sacrificing agape love.

III. Personal Examination and Sowing (vv. 3-8)
- Rejecting self-deception and narcissistic spiritual pride.
- Sowing to the Spirit produces life everlasting; sowing to the flesh reaps corruption.

IV. The Harvest of Perseverance (vv. 9-10)
- Let us not be weary in well doing: in due season we shall reap if we faint not.
- Doing good especially unto them who are of the household of faith.`,
    youtubeId: 'kP8K7xL2mYq',
    videoUrl: 'https://www.youtube.com/watch?v=kP8K7xL2mYq',
    questions: [
      'Have you ever felt isolated during a trial, and how could community have helped?',
      'How do we balance bearing each other\'s burdens while still carrying our personal daily responsibility?',
      'Who in YoungFire ministry could use a meal, a note, or practical assistance right now?'
    ],
    challenge: 'Send an intentional message of blessing and Scripture to 3 brothers or sisters in your group today.',
    attachments: [
      { name: 'Covenant_Fellowship_Practices.pdf', size: '680 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_10_holy_spirit_power',
    title: 'The Holy Spirit\'s Fire: Spiritual Gifts and Operations',
    lessonTitle: 'The Holy Spirit\'s Fire: Spiritual Gifts and Operations',
    seriesTitle: 'Imperial Fellowship',
    teachingDate: '2026-05-18',
    dateOrSeason: 'Spring 2026 • Session 10',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White & Lead Facilitator Whitney White',
    primaryPassage: '1 Corinthians 12:1-11',
    scripturePassage: '1 Corinthians 12:1-11 & 14:1',
    bookId: '1CO',
    chapter: 12,
    theme: 'Charismata, Edification & Divine Anointing',
    summary: 'The manifestation of the Spirit is given to every believer for the common good. We explore the scriptural operation of spiritual gifts: wisdom, knowledge, faith, healing, miracles, prophecy, discerning of spirits, tongues, and interpretation—all operating under divine love.',
    description: 'The manifestation of the Spirit is given to every believer for the common good. We explore the scriptural operation of spiritual gifts: wisdom, knowledge, faith, healing, miracles, prophecy, discerning of spirits, tongues, and interpretation—all operating under divine love.',
    notesContent: `I. Do Not Be Ignorant of Spiritual Gifts (1 Corinthians 12:1)
- "Pneumatikon" (spiritual realities and endowments).
- Moving from powerless idols to the active vocal leadership of the Holy Spirit.

II. Diversity of Gifts, Unity of the Lord (vv. 4-6)
- Same Spirit, same Lord, same God working all things in all believers.
- Every disciple has an essential assignment within the body.

III. The Nine Manifestations (vv. 7-11)
- Revelation Gifts: Word of wisdom, word of knowledge, discerning of spirits.
- Power Gifts: Faith, gifts of healing, working of miracles.
- Utterance Gifts: Prophecy, diverse kinds of tongues, interpretation of tongues.

IV. Sovereign Distribution (v. 11)
- Dividing to every person individually as the Spirit wills.
- Gifts must be practiced with humility, order, and supreme love (chapter 13).`,
    studyNotes: `I. Do Not Be Ignorant of Spiritual Gifts (1 Corinthians 12:1)
- "Pneumatikon" (spiritual realities and endowments).
- Moving from powerless idols to the active vocal leadership of the Holy Spirit.

II. Diversity of Gifts, Unity of the Lord (vv. 4-6)
- Same Spirit, same Lord, same God working all things in all believers.
- Every disciple has an essential assignment within the body.

III. The Nine Manifestations (vv. 7-11)
- Revelation Gifts: Word of wisdom, word of knowledge, discerning of spirits.
- Power Gifts: Faith, gifts of healing, working of miracles.
- Utterance Gifts: Prophecy, diverse kinds of tongues, interpretation of tongues.

IV. Sovereign Distribution (v. 11)
- Dividing to every person individually as the Spirit wills.
- Gifts must be practiced with humility, order, and supreme love (chapter 13).`,
    youtubeId: 'bB8B3nJ9_2K',
    videoUrl: 'https://www.youtube.com/watch?v=bB8B3nJ9_2K',
    questions: [
      'What spiritual gifts do you sense the Lord has deposited in you to serve the church?',
      'How does operating in spiritual gifts require deep dependence on prayer rather than human talent?',
      'How can we foster an environment where disciples feel safe to step out in faith and pray for healing?'
    ],
    challenge: 'Ask the Lord for a word of edification or encouragement for someone at the next fellowship gathering and share it.',
    attachments: [
      { name: 'Spiritual_Gifts_Biblical_Inventory.pdf', size: '1.3 MB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_11_sovereign_king',
    title: 'The Sovereign King: Christology and the Imperial Throne',
    lessonTitle: 'The Sovereign King: Christology and the Imperial Throne',
    seriesTitle: 'Imperial Majesty',
    teachingDate: '2026-06-01',
    dateOrSeason: 'Summer 2026 • Session 11',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White',
    primaryPassage: 'Colossians 1:15-20',
    scripturePassage: 'Colossians 1:15-20 & Revelation 1:12-18',
    bookId: 'COL',
    chapter: 1,
    theme: 'Cosmic Christology & Sovereign Supremacy',
    summary: 'Christ is the image of the invisible God, the firstborn over all creation. In Him all things were created and in Him all things hold together. When we behold the imperial majesty and dazzling glory of Jesus, all earthly idols fade into irrelevance.',
    description: 'Christ is the image of the invisible God, the firstborn over all creation. In Him all things were created and in Him all things hold together. When we behold the imperial majesty and dazzling glory of Jesus, all earthly idols fade into irrelevance.',
    notesContent: `I. The Cosmic Image (Colossians 1:15-17)
- "Eikon" (exact representation and manifestation of the invisible deity).
- Creator of thrones, dominions, principalities, and powers—all created by Him and for Him.
- He is before all things, and in Him all things consist (hold together).

II. Head of the Church (v. 18)
- The beginning, firstborn from the dead.
- "That in all things He might have the preeminence."

III. Reconciliation by Blood (vv. 19-20)
- In Him all fullness (pleroma) was pleased to dwell.
- Having made peace through the blood of His cross.

IV. The Vision of Patmos (Revelation 1:12-18)
- Eyes as a flame of fire, voice as sound of many waters.
- "I am He that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death."`,
    studyNotes: `I. The Cosmic Image (Colossians 1:15-17)
- "Eikon" (exact representation and manifestation of the invisible deity).
- Creator of thrones, dominions, principalities, and powers—all created by Him and for Him.
- He is before all things, and in Him all things consist (hold together).

II. Head of the Church (v. 18)
- The beginning, firstborn from the dead.
- "That in all things He might have the preeminence."

III. Reconciliation by Blood (vv. 19-20)
- In Him all fullness (pleroma) was pleased to dwell.
- Having made peace through the blood of His cross.

IV. The Vision of Patmos (Revelation 1:12-18)
- Eyes as a flame of fire, voice as sound of many waters.
- "I am He that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death."`,
    youtubeId: 'eC1C8uL6_4Z',
    videoUrl: 'https://www.youtube.com/watch?v=eC1C8uL6_4Z',
    questions: [
      'Is Jesus truly preeminent in your calendar, finances, and relationships, or merely prominent?',
      'How does the vision of Jesus in Revelation 1 elevate your view of worship on Sunday mornings?',
      'What fears vanish when you realize Christ holds the keys of death and the grave?'
    ],
    challenge: 'Spend 15 minutes meditating solely on Revelation 1:12-18, writing down attributes of Christ\'s majesty.',
    attachments: [
      { name: 'Christology_Imperial_King_Study.pdf', size: '1.6 MB' }
    ],
    attachmentUrls: [],
    canEdit: false
  },
  {
    id: 'lesson_12_finishing_the_course',
    title: 'Unashamed and Unstoppable: Finishing the Course with Joy',
    lessonTitle: 'Unashamed and Unstoppable: Finishing the Course with Joy',
    seriesTitle: 'Imperial Majesty',
    teachingDate: '2026-09-02',
    dateOrSeason: 'Fall 2026 • Session 12 (Locked Date)',
    facilitator: 'Lead Facilitator Trent D. White',
    teachers: 'Lead Facilitator Trent D. White & Lead Facilitator Whitney White',
    primaryPassage: '2 Timothy 4:1-8',
    scripturePassage: '2 Timothy 4:1-8 & Hebrews 12:1-3',
    bookId: '2TI',
    chapter: 4,
    theme: 'Perseverance, Endurance & Eternal Reward',
    summary: 'Paul\'s final apostolic charge to young Timothy. As the culture shifts and teachers tickle itching ears, the disciple of Jesus stands uncompromised. I have fought a good fight, I have finished my course, I have kept the faith: henceforth there is laid up for me a crown of righteousness.',
    description: 'Paul\'s final apostolic charge to young Timothy. As the culture shifts and teachers tickle itching ears, the disciple of Jesus stands uncompromised. I have fought a good fight, I have finished my course, I have kept the faith: henceforth there is laid up for me a crown of righteousness.',
    notesContent: `I. The Solemn Charge (2 Timothy 4:1-2)
- Charged before God and the Lord Jesus Christ who shall judge the quick and the dead.
- "Preach the word; be instant in season, out of season; reprove, rebuke, exhort with all longsuffering and doctrine."

II. The Prophesied Drift (vv. 3-4)
- When men will not endure sound doctrine, gathering teachers suited to their itching ears.
- Turning away ears from truth unto fables.

III. Watch in All Things (v. 5)
- Endure afflictions, do the work of an evangelist, make full proof of thy ministry.

IV. The Crown of Righteousness (vv. 6-8)
- "I am now ready to be offered, and the time of my departure is at hand."
- "I have fought a good fight, I have finished my course, I have kept the faith."
- Laid up: A crown of righteousness which the righteous Judge will give unto all who love His appearing!`,
    studyNotes: `I. The Solemn Charge (2 Timothy 4:1-2)
- Charged before God and the Lord Jesus Christ who shall judge the quick and the dead.
- "Preach the word; be instant in season, out of season; reprove, rebuke, exhort with all longsuffering and doctrine."

II. The Prophesied Drift (vv. 3-4)
- When men will not endure sound doctrine, gathering teachers suited to their itching ears.
- Turning away ears from truth unto fables.

III. Watch in All Things (v. 5)
- Endure afflictions, do the work of an evangelist, make full proof of thy ministry.

IV. The Crown of Righteousness (vv. 6-8)
- "I am now ready to be offered, and the time of my departure is at hand."
- "I have fought a good fight, I have finished my course, I have kept the faith."
- Laid up: A crown of righteousness which the righteous Judge will give unto all who love His appearing!`,
    youtubeId: 'zY9Y8wK5_1Q',
    videoUrl: 'https://www.youtube.com/watch?v=zY9Y8wK5_1Q',
    questions: [
      'What weights or entanglements is Hebrews 12 calling you to lay aside so you can run your race?',
      'How does the promise of eternal reward keep you steadfast in times of weariness or discouragement?',
      'What legacy of faith do you want to pass on to the next generation of young believers at Joshua House of Worship?'
    ],
    challenge: 'Write out your personal faith declaration of 2 Timothy 4:7-8 and place it where you will see it every day.',
    attachments: [
      { name: 'Finishing_The_Course_Imperial_Crown.pdf', size: '1.8 MB' },
      { name: 'Apostolic_Charge_Paul_Timothy.pdf', size: '920 KB' }
    ],
    attachmentUrls: [],
    canEdit: false
  }
];
