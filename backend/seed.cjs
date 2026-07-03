/**
 * Seed script: populates the opportunities collection with Nigerian scholarships,
 * fellowships, internships, and competitions.
 *
 * Usage:
 *   node seed.cjs
 *
 * Requires MONGODB_URI in .env (or set as environment variable).
 */

// Load .env manually (no dotenv dependency needed — read file directly)
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match) {
      const [, key, val] = match;
      if (!process.env[key]) process.env[key] = val.replace(/^['"]|['"]$/g, '').trim();
    }
  }
}

loadEnv();

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set. Create backend/.env with MONGODB_URI=...');
  process.exit(1);
}

const now = new Date();

const opportunities = [
  // ── SCHOLARSHIPS ──────────────────────────────────────────────────────────
  {
    title: 'MTN Foundation Scholarship',
    description:
      'Annual scholarship for outstanding science and technology students enrolled in accredited Nigerian public universities. Covers tuition and provides a yearly stipend of ₦300,000.',
    type: 'scholarship',
    provider: 'MTN Nigeria Foundation',
    deadline: new Date('2026-09-30'),
    eligibility:
      'Nigerian students in STEM courses (Computer Science, Engineering, Physics, Mathematics) at public universities. Minimum CGPA of 3.5/5.0. Must be in 200–400 level.',
    applicationUrl: 'https://mtnfoundation.com/scholarships',
    tags: ['nigeria', 'stem', 'undergraduate', 'mtn', 'public-university'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'NLNG Nigeria Prize for Science & Technology',
    description:
      'Full tuition scholarship for top-performing students at federal universities in Nigeria. The NLNG scholarship covers all academic fees plus a generous living allowance for the duration of the degree.',
    type: 'scholarship',
    provider: 'Nigeria LNG Limited (NLNG)',
    deadline: new Date('2026-10-31'),
    eligibility:
      'Students in Science, Engineering, Technology or Mathematics (STEM) at Nigerian federal universities. Must be in 200 level or above with a minimum CGPA of 3.5.',
    applicationUrl: 'https://www.nlng.com/nlng-community/scholarship-scheme/',
    tags: ['nigeria', 'federal-university', 'stem', 'full-tuition', 'nlng'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Shell Nigeria SPDC Scholarship',
    description:
      'Prestigious scholarship offered to top undergraduate students in engineering, geosciences and related disciplines at Nigerian universities. Includes full tuition, accommodation allowance and a laptop grant.',
    type: 'scholarship',
    provider: 'Shell Petroleum Development Company (SPDC)',
    deadline: new Date('2026-08-31'),
    eligibility:
      'Nigerian undergraduates in engineering or geosciences with a minimum CGPA of 3.5/5.0 in 200 or 300 level. Must be studying at an accredited Nigerian university.',
    applicationUrl: 'https://www.shell.com.ng/sustainability/communities/scholarships.html',
    tags: ['nigeria', 'engineering', 'geoscience', 'shell', 'undergraduate'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Chevron Nigeria University Scholarship',
    description:
      'Supports undergraduates in their 200 level studying Engineering, Geosciences or Computer Science. Covers tuition fees and provides a monthly living allowance throughout the degree.',
    type: 'scholarship',
    provider: 'Chevron Nigeria Limited',
    deadline: new Date('2026-07-31'),
    eligibility:
      'Nigerian citizens in 200 level of Engineering, Geosciences or Computer Science at a federal or state university. Minimum CGPA 3.5/5.0.',
    applicationUrl: 'https://nigeria.chevron.com/community/scholarships',
    tags: ['nigeria', 'engineering', '200-level', 'chevron', 'undergraduate'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Dangote Foundation Tertiary Education Scholarship',
    description:
      'Scholarship programme targeting students from underserved communities pursuing Agriculture, Medicine, Engineering, Law or Education in Nigerian tertiary institutions. Provides ₦250,000 yearly stipend.',
    type: 'scholarship',
    provider: 'Aliko Dangote Foundation',
    deadline: new Date('2026-08-15'),
    eligibility:
      'Nigerian undergraduates from low-income backgrounds studying Agriculture, Medicine, Engineering, Law or Education. Must demonstrate financial need and academic merit (min CGPA 3.0).',
    applicationUrl: 'https://aliko-dangote-foundation.org/scholarship',
    tags: ['nigeria', 'medicine', 'agriculture', 'engineering', 'underserved', 'dangote'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Access Bank Undergraduate Scholarship',
    description:
      'Access Bank annually awards scholarships to 100 first-generation university students across Nigeria. Recipients receive tuition support and are enrolled in a mentorship programme with bank executives.',
    type: 'scholarship',
    provider: 'Access Bank Plc',
    deadline: new Date('2026-09-15'),
    eligibility:
      'First-year or second-year Nigerian undergraduates who are first-generation university students. Must be studying Business Administration, Finance, Economics, Computer Science or Law.',
    applicationUrl: 'https://www.accessbankplc.com/corporate-responsibility/scholarship',
    tags: ['nigeria', 'first-generation', 'business', 'finance', 'banking', 'access-bank'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // ── FELLOWSHIPS ───────────────────────────────────────────────────────────
  {
    title: 'Mandela Washington Fellowship for Young African Leaders',
    description:
      'The flagship US government exchange programme for young African leaders. Fellows spend six weeks at a US university for intensive leadership training, followed by a presidential summit in Washington D.C. Fully funded.',
    type: 'fellowship',
    provider: 'US Department of State / YALI',
    deadline: new Date('2026-11-01'),
    eligibility:
      'Nigerian and African citizens aged 25–35 with demonstrated leadership experience in Business and Entrepreneurship, Civic Leadership or Public Management. No travel or financial requirement.',
    applicationUrl: 'https://yali.state.gov/washington-fellowship/',
    tags: ['fellowship', 'usa', 'leadership', 'fully-funded', 'africa', 'mandela'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Tony Elumelu Foundation (TEF) Entrepreneurship Programme',
    description:
      'The largest African philanthropy initiative for African entrepreneurs. Provides $5,000 seed capital, 12 weeks of business training, and lifelong mentorship from TEF mentors. Open to all 54 African countries.',
    type: 'fellowship',
    provider: 'Tony Elumelu Foundation',
    deadline: new Date('2026-12-31'),
    eligibility:
      'African entrepreneurs (including Nigerians) aged 18 and above with a business idea or early-stage business. No degree or prior experience required.',
    applicationUrl: 'https://tefconnect.com/programme',
    tags: ['entrepreneurship', 'africa', 'nigeria', 'seed-capital', 'business', 'tef'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'ALX Africa Software Engineering Fellowship',
    description:
      'Intensive 12-month software engineering programme that trains African tech talent to world-class standards. Covers Python, JavaScript, C, and systems programming. Remote-first with project-based learning. Fully sponsored for eligible Nigerians.',
    type: 'fellowship',
    provider: 'ALX Africa',
    deadline: new Date('2026-09-01'),
    eligibility:
      'Nigerian and African applicants aged 18+ with basic computer literacy. No programming experience required. Must pass an aptitude test and commit to 40+ hours per week for 12 months.',
    applicationUrl: 'https://www.alxafrica.com/software-engineering/',
    tags: ['tech', 'software-engineering', 'remote', 'africa', 'nigeria', 'alx', 'coding'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Mastercard Foundation Scholars Program',
    description:
      'Provides full scholarships to academically talented but economically disadvantaged young Africans to study at leading African and global universities. Includes leadership development and community service requirements.',
    type: 'fellowship',
    provider: 'Mastercard Foundation',
    deadline: new Date('2026-10-15'),
    eligibility:
      'Young Africans (including Nigerians) who demonstrate academic excellence and financial need. Open to students applying to designated partner universities. Includes leadership and social impact focus.',
    applicationUrl: 'https://mastercardfdn.org/scholars-program/',
    tags: ['scholarship', 'africa', 'leadership', 'mastercard', 'fully-funded', 'undergraduate'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // ── INTERNSHIPS ───────────────────────────────────────────────────────────
  {
    title: 'Google Africa Developer Scholarship (ADS)',
    description:
      'A six-month online training and scholarship programme that prepares African developers for the tech industry. Covers Android, Cloud, and Mobile Web development via the Grow with Google curriculum. Scholarship includes certification exam vouchers.',
    type: 'internship',
    provider: 'Google / Andela / Pluralsight',
    deadline: new Date('2026-08-01'),
    eligibility:
      'African students and professionals interested in technology. Basic programming knowledge preferred. Open to all disciplines — not just CS students.',
    applicationUrl: 'https://andela.com/alc/google-africa-developer-scholarship/',
    tags: ['google', 'tech', 'africa', 'nigeria', 'cloud', 'android', 'mobile', 'online'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Microsoft LEAP Nigeria Graduate Programme',
    description:
      'A 16-week paid apprenticeship for recent Nigerian graduates who are transitioning into the software industry. Covers Cloud Engineering, Data Science and Product Management with Microsoft mentors. Competitive stipend included.',
    type: 'internship',
    provider: 'Microsoft Nigeria',
    deadline: new Date('2026-07-15'),
    eligibility:
      'Nigerian graduates (within 3 years of graduation) from any discipline. Must demonstrate interest in tech and problem solving. Application includes an online aptitude assessment.',
    applicationUrl: 'https://www.microsoft.com/en-ng/leap',
    tags: ['microsoft', 'tech', 'nigeria', 'graduate', 'cloud', 'data-science', 'paid'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Andela Nigeria Technical Leadership Programme',
    description:
      'Andela trains African software engineers and connects them with global companies. The fellowship is a paid, remote-first programme with intensive software engineering and leadership training. Successful fellows are matched with partner companies worldwide.',
    type: 'internship',
    provider: 'Andela',
    deadline: new Date('2026-09-30'),
    eligibility:
      'Nigerian developers with at least 1 year of experience in a programming language (Python, JavaScript, Ruby, etc.). Must pass a technical skills assessment.',
    applicationUrl: 'https://andela.com/ats/',
    tags: ['andela', 'tech', 'nigeria', 'software-engineering', 'remote', 'paid', 'global'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'PwC Nigeria Graduate Trainee Programme',
    description:
      'PricewaterhouseCoopers Nigeria hires graduates into a structured 12-month trainee programme across Assurance, Advisory, Tax and Technology consulting. Trainees receive full salaries, training and professional certification support.',
    type: 'internship',
    provider: 'PwC Nigeria',
    deadline: new Date('2026-08-31'),
    eligibility:
      'Nigerian graduates with a minimum of Second Class Upper (2:1) in any discipline. Must have completed NYSC or be due to complete it. Strong analytical skills required.',
    applicationUrl: 'https://www.pwc.com/ng/en/careers.html',
    tags: ['pwc', 'consulting', 'nigeria', 'graduate', 'finance', 'assurance', 'advisory'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // ── COMPETITIONS ──────────────────────────────────────────────────────────
  {
    title: 'MTN MoMo Hackathon — FinTech Edition',
    description:
      'Annual pan-Nigerian hackathon challenging teams to build innovative mobile money and fintech solutions on the MTN MoMo API. Winners receive up to ₦5 million in prize money and a fast-track to MoMo partnership.',
    type: 'competition',
    provider: 'MTN Nigeria',
    deadline: new Date('2026-10-01'),
    eligibility:
      'Teams of 2–5 Nigerian university students or recent graduates. At least one developer per team. Must build on the MTN MoMo API.',
    applicationUrl: 'https://hackathon.mtn.com.ng',
    tags: ['hackathon', 'fintech', 'mtn', 'nigeria', 'mobile-money', 'prizes'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Nigeria University Innovation Challenge (NUIC)',
    description:
      'A national startup competition for Nigerian university students with social-impact business ideas. Teams pitch to a panel of investors and entrepreneurs. Winners receive seed funding, mentorship and incubation support.',
    type: 'competition',
    provider: 'Ministry of Education / NUC',
    deadline: new Date('2026-09-20'),
    eligibility:
      'Nigerian undergraduate and postgraduate students with an original startup or social enterprise idea. Teams of 1–4 students from the same or different universities.',
    applicationUrl: 'https://nuic.gov.ng',
    tags: ['startup', 'social-impact', 'competition', 'nigeria', 'university', 'incubation'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Cowrywise Financial Literacy & Innovation Challenge',
    description:
      'Essay and project competition focused on financial inclusion and investment education for young Nigerians. Winners are featured in Cowrywise media and receive Cowrywise investment account credits and cash prizes.',
    type: 'competition',
    provider: 'Cowrywise',
    deadline: new Date('2026-08-20'),
    eligibility:
      'Nigerian undergraduates in any year of study. Entries may be individual or team (max 3). Competition includes written and digital media categories.',
    applicationUrl: 'https://cowrywise.com/challenge',
    tags: ['finance', 'investment', 'nigeria', 'essay', 'cowrywise', 'financial-literacy'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // ── GRANTS ────────────────────────────────────────────────────────────────
  {
    title: 'FATE Foundation Young Entrepreneurs Grant',
    description:
      'The FATE Foundation awards seed grants of up to ₦2 million to early-stage Nigerian entrepreneurs aged 18–35. Recipients also get access to FATE\'s business advisory network and training resources.',
    type: 'grant',
    provider: 'FATE Foundation',
    deadline: new Date('2026-10-31'),
    eligibility:
      'Nigerian citizens aged 18–35 with a registered or in-progress business in manufacturing, agriculture, health, education or technology. Must pitch to a selection committee.',
    applicationUrl: 'https://fate-foundation.org/grant',
    tags: ['grant', 'nigeria', 'entrepreneurship', 'startup', 'fate', 'seed-funding'],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Extract database name from URI or use default
    const uriParts = MONGODB_URI.split('/');
    const dbName = (uriParts[uriParts.length - 1] || '').split('?')[0] || 'agentpath';
    const db = client.db(dbName);
    const collection = db.collection('opportunities');

    const existing = await collection.countDocuments();
    if (existing > 0) {
      console.log(`Collection already has ${existing} documents. Clearing and re-seeding...`);
      await collection.deleteMany({});
    }

    const result = await collection.insertMany(opportunities);
    console.log(`\nSeeded ${result.insertedCount} opportunities successfully!`);
    console.log('\nOpportunities by type:');
    const types = {};
    opportunities.forEach(o => { types[o.type] = (types[o.type] || 0) + 1; });
    Object.entries(types).forEach(([type, count]) => console.log(`  ${type}: ${count}`));
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDone. Connection closed.');
  }
}

seed();
