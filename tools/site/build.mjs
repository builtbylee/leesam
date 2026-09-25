// Builds the "Thread" redesign of talentbylee.com into a single static index.html.
import fs from 'fs';

const OUT = process.argv[2];
const maps = JSON.parse(fs.readFileSync(new URL('../geo/maps.json', import.meta.url)));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------- content
const companies = [
  { key: 'hp', name: 'Hewlett Packard', years: '2007 — 2010', from: 2007, logo: 'assets/logos/hp.svg', cls: 'logo-hp', fb: 'HP', roles: [
    { title: 'In-House Recruiter', years: '2007 — 2010', from: 2007,
      meta: 'Hewlett Packard · In-house recruiting · 2007 — 2010',
      summary: 'Recruited technical and commercial roles for the Technology Solutions Group while improving direct hiring outcomes.',
      proofs: [['98%', 'Direct recruitment in FY09'], ['<38', 'Days time-to-hire'], ['TSG', 'Technical Solutions Group']],
      bullets: ['Recruited Technical Account Managers, Technical Pre-Sales Consultants, and Sales Account Managers for the Technology Solutions Group.',
        'Supported hiring managers from requisition approval through close, advising on salary, benefits, working conditions, and process compliance.',
        'Reduced agency expenditure through direct sourcing and achieved 98% direct recruitment in FY09.',
        'Reduced time-to-hire to under 38 days in FY09 while managing the largest requisition volume in the Staffing team.'],
      noteTitle: 'Early proof', note: 'A strong early in-house recruiting role with measurable process improvement, direct sourcing impact, and high requisition ownership.' }] },
  { key: 'ey', name: 'EY', years: '2010 — 2011', from: 2010, logo: 'assets/logos/ey.png', cls: 'logo-ey', fb: 'EY', roles: [
    { title: 'Recruiter, IT Advisory', years: '2010 — 2011', from: 2010,
      meta: 'Ernst & Young · IT Advisory · 2010 — 2011',
      summary: 'Managed recruitment for IT Advisory, Risk Advisory, Programme Advisory Services, and interim Transactions Advisory coverage.',
      proofs: [['FY10', 'Headcount target'], ['D&I', 'Racial diversity champion'], ['Advisory', 'Transformation hiring']],
      bullets: ['Managed end-to-end recruitment for IT Advisory, Risk Advisory, Programme Advisory Services, and interim Transactions Advisory coverage.',
        'Recruited Programme Managers, Enterprise Architects, SAP Consultants, and transformation specialists across major sectors.',
        'Turned around IT Advisory recruitment, helping the group meet FY10 headcount targets and all recruitment KPIs.',
        'Served as Champion for Racial Diversity at EY UK, improving attraction and recruitment of candidates from under-represented ethnicities.',
        'Received six Values Awards from senior managers and partners, including a special award for direct recruitment achievements in FY10.'],
      noteTitle: 'Impact', note: 'Combined delivery turnaround, advisory hiring, and diversity work before moving deeper into technology recruiting.' }] },
  { key: 'boa', name: 'BoA Merrill Lynch', years: '2011 — 2013', from: 2011, logo: 'assets/logos/boa.png', cls: 'logo-boa', fb: 'BA', roles: [
    { title: 'Technology Recruiter', years: '2011 — 2013', from: 2011,
      meta: 'BoA Merrill Lynch · Technology · 2011 — 2013',
      summary: 'End-to-end technology hiring across global wealth, markets, infrastructure, and risk technology groups.',
      proofs: [['Tech', 'Infrastructure and risk'], ['Direct', 'Sourcing channels'], ['Markets', 'Financial services']],
      bullets: ['Managed end-to-end technology hiring across GWIM, GMRT, GWBT, Technology Infrastructure, and Risk Tech.',
        'Built talent pools for Software Engineers, Application Support Analysts, Business Analysts, and Project or Programme Managers.',
        'Partnered with hiring managers, HR Business Partners, agencies, and business leaders on pipeline, compensation, approvals, and market updates.',
        'Direct sourced candidates through LinkedIn, X-ray search, eFinancialCareers, Jobserve, CW Jobs, and niche boards.'],
      noteTitle: 'Recruiting craft', note: 'Built depth in direct sourcing, technical role calibration, hiring-manager partnership, and process management in a complex financial services environment.' }] },
  { key: 'twitter', name: 'Twitter', years: '2013 — 2015', from: 2013, logo: 'assets/logos/twitter.png', cls: 'logo-twitter', fb: 'TW', roles: [
    { title: 'Senior Recruiter', years: '2013 — 2015', from: 2013,
      meta: 'Twitter · UK and EMEA · 2013 — 2015',
      summary: 'Recruited across commercial, media, marketing, legal, finance, research, and partnership roles during Twitter regional growth.',
      proofs: [['EMEA', 'Regional coverage'], ['Ads', 'Commercial hiring'], ['Offer', 'Comp partnership']],
      bullets: ['Recruited across UK and EMEA roles spanning Ads Sales, Account Management, Media Partnerships, Marketing, Comms, Legal, Finance, and Research.',
        'Managed end-to-end hiring from intake through offer acceptance, with a strong focus on candidate experience.',
        'Used market data and internal benchmarks to construct competitive candidate offers with HR, Compensation, and senior business approval.',
        'Promoted employee referrals, ran sourcing sessions, maintained hiring trackers, and presented recruiting updates to the UK office.'],
      noteTitle: 'Signal', note: 'A formative high-growth platform-company role with broad functional coverage and a strong emphasis on candidate experience.' }] },
  { key: 'salesforce', name: 'Salesforce', years: '2015 — 2016', from: 2015, logo: 'assets/logos/salesforce-clean.png', cls: 'logo-salesforce', fb: 'SF', roles: [
    { title: 'Senior Recruiter', years: '2015 — 2016', from: 2015,
      meta: 'Salesforce · EMEA · 2015 — 2016',
      summary: 'Recruited specialist and senior roles across the Customer Success Group, Marketing Cloud, and Service Cloud in EMEA.',
      proofs: [['EMEA', 'Multi-cloud coverage'], ['PS', 'Professional Services'], ['1:1:1', 'Community model']],
      bullets: ['Led recruiting for the Customer Success Group (CSG), Marketing Cloud, and Service Cloud across EMEA.',
        'Recruited specialist roles including Solution Architects, Sales Specialist Directors, and Senior Technical Project Managers.',
        'Developed senior stakeholder relationships and delivered robust KPI reporting to senior management, maintaining high data integrity throughout.',
        'Worked closely with Employee Success, Finance, and cross-functional teams to keep recruiting processes smooth and compliant.',
        'Contributed to Salesforce 1:1:1 model through volunteering and local community activity.'],
      noteTitle: 'Stakeholders', note: 'A highly matrixed environment that sharpened senior stakeholder partnership, cross-functional process management, and SaaS talent-market fluency.' }] },
  { key: 'snap', name: 'Snap', years: '2017', from: 2017, logo: 'assets/logos/snap-clean.png', cls: 'logo-snap', fb: 'SN', roles: [
    { title: 'Senior Business Recruiter', years: '2017', from: 2017,
      meta: 'Snap Inc. · Business recruiting · 2017',
      summary: "Snap's first Business Recruiter outside the US, owning strategic EMEA hiring with additional cross-region support.",
      proofs: [['1st', 'Business recruiter outside US'], ['EMEA', 'Strategic hiring'], ['GTM', 'Commercial roles']],
      bullets: ["Hired as Snap's first Business Recruiter outside the US.",
        'Owned strategic hiring across EMEA, with additional ad-hoc roles across the Middle East and US.',
        'Managed end-to-end hiring from intake and sourcing through offers, contracts, and onboarding.',
        'Recruited across Account Executives, Account Managers, Creative Strategists, Marketing Managers, Event Managers, Sales Operations, Business Operations, and Agency Partners.'],
      noteTitle: 'Scope', note: 'Built recruiting coverage for a newer international business function where structure, speed, and candidate experience all mattered.' }] },
  { key: 'okta', name: 'Okta', years: '2018', from: 2018, logo: 'assets/logos/okta.png', cls: 'logo-okta', fb: 'OK', roles: [
    { title: 'Senior Recruiter', years: '2018', from: 2018,
      meta: 'Okta · Enterprise identity · 2018',
      summary: 'Enterprise identity recruiting inside a fast-growing cloud software company during a period of international scaling.',
      proofs: [['SaaS', 'Cloud software'], ['EMEA', 'International scale'], ['ID', 'Identity market']],
      bullets: ['Managed full-cycle recruiting across UK, Netherlands, and France, covering Engineering, Customer Success, Sales, and G&A functions.',
        'Partnered with hiring leaders across EMEA and the US to build pipeline, support expansion plans, and meet aggressive hiring timelines.',
        'Used direct sourcing tools and approaches to engage passive candidates in competitive enterprise identity and cloud software markets.'],
      noteTitle: 'Context', note: 'Short but useful exposure to enterprise identity, high-growth SaaS hiring, and scaling teams in an international cloud software environment.' }] },
  { key: 'cloudflare', name: 'Cloudflare', years: '2018 — 2026', from: 2018, logo: 'assets/logos/cloudflare.png', cls: 'logo-cloudflare', fb: 'CF', roles: [
    { title: 'Recruiter to Manager', years: '2018 — 2022', from: 2018,
      meta: 'Cloudflare · EMEA · Growth phase',
      summary: 'Progressed from individual contributor to regional recruiting leadership while helping build the foundation for Cloudflare EMEA hiring.',
      proofs: [['IC → Lead', 'Progression path'], ['GTM', 'Commercial hiring'], ['Eng', 'Technical hiring']],
      bullets: ['Progressed from Recruiter to EMEA Recruiting Lead and EMEA Recruiting Manager during Cloudflare regional growth.',
        'Hired across Sales and Engineering talent across EMEA.',
        'Partnered with managers and leaders to identify diverse talent for active and future hiring needs.',
        'Built the foundation for broader EMEA recruiting leadership across planning, delivery, stakeholder partnership, and team operating rhythm.'],
      noteTitle: 'Foundation', note: 'This period established the operating rhythm, stakeholder trust, and delivery credibility that later expanded into regional leadership.' },
    { title: 'Head of Recruiting, EMEA', years: '2022 — 2026', from: 2022,
      meta: 'Cloudflare · EMEA · Regional leadership',
      summary: 'Led regional recruiting delivery at scale while managing team performance, workforce planning partnership, and cross-functional hiring governance.',
      proofs: [['318', 'FY 2023 hires'], ['477', 'FY 2024 hires'], ['599', 'FY 2025 hires']],
      bullets: ['Led EMEA recruiting delivery at scale: 318 hires in 2023, 477 in 2024, and 599 hires in 2025 — a record year.',
        'Partnered with business leaders and Finance on headcount forecasting and resource planning for GTM and Engineering, aligning recruiting capacity with business growth objectives.',
        'Supported GTM leadership on EMEA territory expansion, building talent pipelines ahead of regional growth plans.',
        'Partnered with the M&A team on EMEA acquihire targets — facilitating candidate assessment, offer processes, and onboarding transitions.',
        'Built and developed a high-performing recruiting team through feedback loops, career development, performance management, and succession planning.',
        'Established employer brand partnerships to elevate visibility and connect with diverse talent pools across EMEA, embedding inclusive hiring practices across the team.'],
      noteTitle: 'Operating model', note: 'Balanced delivery, team development, executive communication, and hiring governance through a period of significant EMEA scale.' },
    { title: 'Executive Recruiting', years: '2026', from: 2026,
      meta: 'Cloudflare · EMEA · 2026',
      summary: 'A data-led, relationship-driven approach to executive hiring — combining market intelligence, inclusive pipeline development, AI-enabled operations, and structured search execution.',
      proofs: [['EMEA', 'VP+ leadership searches'], ['AI', 'Recruiting workflow adoption'], ['Exec', 'Senior stakeholder partnership']],
      bullets: ['Led VP+ executive search for Cloudflare across EMEA, focused on the most critical regional leadership roles.',
        'Designed executive search strategies, research frameworks, market maps, and proactive succession pipelines.',
        'Improved recruiting productivity and simplified recurring workflows, building custom internal tool prototypes.',
        "Contributed to Cloudflare's official candidate guidance on AI usage in interviews, helping define practical expectations for candidates and interview teams.",
        'Partnered with senior stakeholders on talent availability, market dynamics, candidate positioning, pipeline diversity, and search cadence.',
        'Applied a deliberate focus on inclusive pipeline development — building diverse candidate pools and bringing structured DE&I thinking to every leadership search.'],
      noteTitle: 'AI-era work', note: "Built practical tools for recurring recruiting tasks, helped define how candidates and interview teams should approach AI usage in hiring processes, and co-hosted an agentic coding workshop at Cloudflare's London office (February 2026) introducing non-technical employees to agentic coding using AI tools." }] }
];

const projects = [
  { kind: 'web', org: 'Cloudflare', type: 'Internal tool', title: 'Candidate Intelligence', url: 'candidate-intel.cloudflare.io',
    imgs: [['candidate-intel-start.jpg', 'Candidate Intelligence start screen'], ['candidate-intel-upload.jpg', 'Candidate Intelligence upload screen'], ['candidate-intel-result.jpg', 'Candidate Intelligence match result']],
    text: "Popular roles can attract hundreds of applications at Cloudflare — many never seen by a hiring manager due to the volume. The Candidate Intelligence tool allows candidates to upload their CV and a role link; the tool then assesses their profile against the job requirements and, if there's a suitable fit, they can opt to share their details directly to the hiring team." },
  { kind: 'web', org: 'Cloudflare', type: 'Internal tool', title: 'Job Builder', url: 'job-builder.cloudflare.io',
    imgs: [['job-builder-overview.jpg', 'Job Builder overview showing job basics and interview stages'], ['job-builder-submit.jpg', 'Job Builder review and submit screen']],
    text: 'Replaces an 11-page manual interview plan template with a guided flow that connects to Greenhouse via the Harvest API, pre-loads templates, and submits a fully configured job in minutes instead of days. Secured behind Cloudflare Access.' },
  { kind: 'web', org: 'Cloudflare', type: 'Recruiter automation', title: 'Relay', url: 'relay.cloudflare.io',
    imgs: [['relay-import.jpg', 'Relay import view showing roles pulled from Greenhouse'], ['relay-handover.jpg', 'Relay handover document with role status and candidate details']],
    text: 'Automates recruiter-to-recruiter handovers. Connects to Greenhouse via the Harvest API, imports role status with one tap, and generates a clean handover document that can be exported to PDF and shared immediately.' },
  { kind: 'photo', org: 'Cloudflare', type: 'Workshop · Feb 2026', title: 'Coding Workshop',
    imgs: [['workshop-close.jpg', 'Lee Sam co-hosting the agentic coding workshop at Cloudflare London'], ['workshop-wide.jpg', 'Attendees building projects during the agentic coding workshop']],
    text: "Co-hosted a hands-on agentic coding workshop at Cloudflare's London office introducing non-technical employees to building with AI. Attendees used Windsurf to build their own personal and work-related projects in the session." },
  { kind: 'phone', org: 'Personal', type: 'Mobile app', title: 'Execue',
    imgs: [['execue-report.jpg', 'Execue job match report'], ['execue-generating.jpg', 'Execue generating analysis'], ['execue-home.jpg', 'Execue home screen']],
    text: 'A React Native mobile app that lets users upload their CV and any job posting URL, then receive tailored role-fit analysis and detailed interview prep support.' },
  { kind: 'phone', org: 'Personal', type: 'Mobile app', title: 'Pinr',
    imgs: [['pinr-map.jpg', 'Pinr map'], ['pinr-profile.jpg', 'Pinr profile'], ['pinr-place.jpg', 'Pinr destination detail']],
    text: 'A React Native travel app that lets users pin their favourite travel photos on a live globe, connect with friends, explore new destinations, and play games. Live on the Google Play and Apple App stores.' },
  { kind: 'phone', org: 'Personal', type: 'Mobile app', title: 'Ryval',
    imgs: [['ryval-workout.jpg', 'Ryval workout'], ['ryval-home.jpg', 'Ryval home dashboard'], ['ryval-detail.jpg', 'Ryval workout detail']],
    text: "A React Native gym workout app that displays live heart rate during sessions when connected to a monitor. Compete against your own previous workouts or a friend's by overlaying heart rate data in real time. Android approved for Google Play; iOS in final development." }
];

const photos = [
  ['busan', 'busan.jpg', 'Busan', 'Lee Sam overlooking the colourful hillside houses in Busan'],
  ['bali', 'bali.jpg', 'Bali coastline', 'Lee Sam standing above the coastline in Bali'],
  ['petra', 'petra.jpg', 'Petra', 'Lee Sam standing in front of Petra'],
  ['rio', 'rio.jpg', 'Rio de Janeiro', 'Lee Sam sitting on the Escadaria Selaron steps in Rio'],
  ['machu', 'machu-picchu.jpg', 'Machu Picchu', 'Lee Sam at Machu Picchu'],
  ['milwaukee', 'fiserv-forum.jpg', 'Fiserv Forum', 'Lee Sam outside Fiserv Forum in Milwaukee'],
  ['milwaukee', 'bucks-tipoff.jpg', 'Bucks tipoff', 'Milwaukee Bucks tipoff at Fiserv Forum'],
  ['milwaukee', 'giannis-courtside.jpg', 'Courtside', 'Giannis Antetokounmpo courtside during a Milwaukee Bucks game'],
  ['milwaukee', 'broadcast-booth.jpg', 'Broadcast booth', 'Lee Sam wearing a headset in a basketball broadcast booth']
];

// ---------------------------------------------------------------- pieces
const role = (r, co) => `
            <div class="role" data-year="${r.from}" data-co="${esc(co.name)}">
              <p class="role-when mono">${esc(r.years)}</p>
              <h4>${esc(r.title)}</h4>
              <p class="role-meta">${esc(r.meta)}</p>
              <p class="role-sum">${esc(r.summary)}</p>
              <dl class="proofs">${r.proofs.map(p => `<div><dt>${esc(p[0])}</dt><dd>${esc(p[1])}</dd></div>`).join('')}</dl>
              <details class="more">
                <summary><span>Responsibilities and notes</span><i aria-hidden="true"></i></summary>
                <div class="more-body">
                  <ul>${r.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
                  <p class="note"><b>${esc(r.noteTitle)}.</b> ${esc(r.note)}</p>
                </div>
              </details>
            </div>`;

const chapter = co => `
          <article class="chapter" id="co-${co.key}" data-node data-reveal>
            <header class="ch-head">
              <span class="logo ${co.cls}"><img src="${co.logo}" alt="" onerror="this.hidden=true"><span class="logo-fallback">${co.fb}</span></span>
              <div><h3>${esc(co.name)}</h3><p class="mono">${esc(co.years)}</p></div>
            </header>
            <div class="roles">${[...co.roles].map(r => role(r, co)).join('')}
            </div>
          </article>`;

const shot = (p, i) => {
  const imgs = p.imgs.map((im, k) => `<img${k === 0 ? ' class="on"' : ''} src="assets/apps/${im[0]}" alt="${esc(im[1])}" loading="lazy">`).join('');
  let inner;
  if (p.kind === 'web') inner = `<div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>${p.url}</span></div><div class="browser-stage">${imgs}</div></div>`;
  else if (p.kind === 'phone') inner = `<div class="phone"><div class="phone-screen">${imgs}</div></div>`;
  else inner = `<div class="photo-stage">${imgs}</div>`;
  const pips = p.imgs.length > 1 ? `<span class="pips" aria-hidden="true">${p.imgs.map((_, k) => `<i${k === 0 ? ' class="on"' : ''}></i>`).join('')}</span>` : '';
  const next = p.imgs.length > 1 ? `<button type="button" class="shot-next" aria-label="Next ${esc(p.title)} screen"></button>` : '';
  return `
            <article class="card" data-card>
              <div class="shot ${p.kind}">${inner}${pips}${next}</div>
              <div class="card-body">
                <p class="card-meta mono"><b>${esc(p.org)}</b> · ${esc(p.type)}</p>
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.text)}</p>
              </div>
            </article>`;
};

const tile = (ph, i) => `
            <button type="button" class="tile" data-place="${ph[0]}" aria-pressed="${i === 0}" aria-label="${esc(ph[2])}: show on the map">
              <img src="assets/outside-work/${ph[1]}" alt="${esc(ph[3])}" loading="lazy">
              <span class="tile-cap"><span>${esc(ph[2])}</span><span class="mono">${String(i + 1).padStart(2, '0')}</span></span>
            </button>`;

// ---------------------------------------------------------------- page
const html = fs.readFileSync(new URL('./page.html', import.meta.url), 'utf8')
  .replace('<!--CHAPTERS-->', companies.map(chapter).join(''))
  .replace('<!--CARDS-->', projects.map(shot).join(''))
  .replace('<!--TILES-->', photos.map(tile).join(''))
  .replace('__EMEA_D__', maps.emea.d)
  .replace('__WORLD_D__', maps.world.d);
if (/<!--[A-Z]+-->|__[A-Z]+_D__/.test(html)) throw new Error('unfilled placeholder');
fs.writeFileSync(OUT, html);
console.log('wrote', OUT, html.length, 'bytes');
