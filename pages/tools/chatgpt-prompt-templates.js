import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ChatGPTPromptTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'All', 'Writing', 'Marketing', 'Coding', 'Business', 'Education', 
    'Social Media', 'SEO', 'Email', 'Creative', 'Productivity', 'Career'
  ];

  const templates = [
    // Writing Prompts
    { id: 1, category: 'Writing', title: 'Blog Post Writer', prompt: 'Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include an engaging introduction, 5 main sections with subheadings, actionable tips, and a compelling conclusion. Target word count: 1500-2000 words. Use a conversational yet professional tone.' },
    { id: 2, category: 'Writing', title: 'Story Generator', prompt: 'Create an engaging short story about [THEME/TOPIC]. Include vivid descriptions, compelling characters, dialogue, and an unexpected twist. Set the story in [SETTING/TIME PERIOD]. Length: 1000-1500 words.' },
    { id: 3, category: 'Writing', title: 'Article Rewriter', prompt: 'Rewrite the following article to make it unique while maintaining the original meaning and key points: [PASTE ARTICLE]. Improve readability, vary sentence structure, and use different vocabulary. Maintain a [TONE] tone.' },
    { id: 4, category: 'Writing', title: 'Essay Outline Creator', prompt: 'Create a detailed outline for an essay on [TOPIC]. Include thesis statement, 5 main arguments with supporting points, counterarguments, and conclusion. Make it suitable for [ACADEMIC LEVEL] level.' },
    { id: 5, category: 'Writing', title: 'Product Description Writer', prompt: 'Write compelling product descriptions for [PRODUCT NAME]. Highlight key features, benefits, unique selling points, and create urgency. Include emotional triggers and SEO keywords: [KEYWORDS]. Length: 150-200 words per variation. Create 3 variations.' },
    { id: 6, category: 'Writing', title: 'Press Release Generator', prompt: 'Write a professional press release announcing [EVENT/NEWS]. Include headline, dateline, lead paragraph answering who/what/when/where/why, supporting paragraphs, boilerplate, and contact information. Follow AP style.' },
    { id: 7, category: 'Writing', title: 'Script Writer', prompt: 'Write a script for a [TYPE] video about [TOPIC]. Include opening hook, main content sections, transitions, call-to-action, and closing. Target length: [DURATION] minutes. Tone: [TONE].' },
    { id: 8, category: 'Writing', title: 'Newsletter Content', prompt: 'Create engaging newsletter content for [AUDIENCE] about [TOPIC]. Include catchy subject line, opening greeting, 3-4 content sections with valuable information, and clear call-to-action. Tone: [TONE].' },

    // Marketing Prompts
    { id: 9, category: 'Marketing', title: 'Ad Copy Generator', prompt: 'Create 10 variations of compelling ad copy for [PRODUCT/SERVICE]. Each should include: attention-grabbing headline, benefit-focused body copy (50-75 words), and strong call-to-action. Target audience: [AUDIENCE]. Platform: [FACEBOOK/GOOGLE/INSTAGRAM].' },
    { id: 10, category: 'Marketing', title: 'Landing Page Copy', prompt: 'Write persuasive landing page copy for [PRODUCT/SERVICE]. Include: headline, subheadline, hero section, 5 benefit sections, social proof section, FAQ section, and 3 CTA buttons. Address pain points: [PAIN POINTS]. Target audience: [AUDIENCE].' },
    { id: 11, category: 'Marketing', title: 'Sales Funnel Strategy', prompt: 'Design a complete sales funnel strategy for [PRODUCT/SERVICE]. Include: awareness stage tactics, consideration stage content, decision stage offers, retention strategies, and specific content ideas for each stage. Target market: [MARKET].' },
    { id: 12, category: 'Marketing', title: 'Brand Voice Guide', prompt: 'Create a comprehensive brand voice guide for [COMPANY/BRAND]. Define: brand personality traits, tone of voice (formal/casual), vocabulary to use/avoid, messaging pillars, example phrases, and do\'s and don\'ts for communication.' },
    { id: 13, category: 'Marketing', title: 'Content Calendar', prompt: 'Create a 30-day content calendar for [PLATFORM/CHANNEL]. Include: post topics, content types (video/image/text), posting times, hashtags, and engagement strategies. Focus on: [GOALS/THEMES]. Format as a table.' },
    { id: 14, category: 'Marketing', title: 'Competitor Analysis', prompt: 'Analyze my competitors in [INDUSTRY]. For each of [COMPETITOR 1, 2, 3], identify: strengths, weaknesses, marketing strategies, unique selling propositions, pricing, and opportunities for differentiation. Provide actionable insights.' },
    { id: 15, category: 'Marketing', title: 'Customer Persona', prompt: 'Create 3 detailed customer personas for [PRODUCT/SERVICE]. For each, include: demographics, psychographics, goals, challenges, buying behaviors, preferred channels, pain points, and how our solution helps. Make them realistic and specific.' },
    { id: 16, category: 'Marketing', title: 'Value Proposition', prompt: 'Create a compelling value proposition for [PRODUCT/SERVICE]. Clearly state: what we offer, who we serve, how we\'re different, specific benefits, and why customers should choose us over alternatives. Make it concise and memorable.' },

    // Coding Prompts
    { id: 17, category: 'Coding', title: 'Code Explainer', prompt: 'Explain the following code in simple terms: [PASTE CODE]. Break down: what each section does, how it works, potential issues, and suggest improvements. Assume audience is [BEGINNER/INTERMEDIATE/ADVANCED].' },
    { id: 18, category: 'Coding', title: 'Bug Fixer', prompt: 'Debug the following code and fix any errors: [PASTE CODE]. Identify: syntax errors, logical errors, performance issues, and security vulnerabilities. Provide the corrected code with explanations of changes made.' },
    { id: 19, category: 'Coding', title: 'Function Creator', prompt: 'Write a [LANGUAGE] function that [DESCRIBE FUNCTIONALITY]. Include: input parameters, return values, error handling, comments, and example usage. Follow best practices and coding standards for [LANGUAGE].' },
    { id: 20, category: 'Coding', title: 'Algorithm Designer', prompt: 'Design an efficient algorithm to [SOLVE PROBLEM]. Provide: pseudocode, time complexity analysis, space complexity analysis, implementation in [LANGUAGE], and test cases. Optimize for [SPEED/MEMORY/READABILITY].' },
    { id: 21, category: 'Coding', title: 'Code Reviewer', prompt: 'Review the following code for: [PASTE CODE]. Check: code quality, adherence to best practices, potential bugs, security issues, performance optimizations, and readability. Provide detailed feedback and suggestions.' },
    { id: 22, category: 'Coding', title: 'API Builder', prompt: 'Create a RESTful API endpoint for [FUNCTIONALITY] using [FRAMEWORK]. Include: route definition, request/response structure, validation, error handling, authentication, and example requests using curl/Postman.' },
    { id: 23, category: 'Coding', title: 'Database Schema', prompt: 'Design a database schema for [APPLICATION/FEATURE]. Include: table structures, relationships, primary/foreign keys, indexes, constraints, and sample SQL queries. Optimize for [POSTGRESQL/MYSQL/MONGODB].' },
    { id: 24, category: 'Coding', title: 'Unit Test Writer', prompt: 'Write comprehensive unit tests for the following code: [PASTE CODE]. Use [TESTING FRAMEWORK]. Include: test cases for normal operation, edge cases, error conditions, and mocking external dependencies.' },

    // Business Prompts
    { id: 25, category: 'Business', title: 'Business Plan Writer', prompt: 'Write a comprehensive business plan for [BUSINESS IDEA]. Include: executive summary, market analysis, competitive landscape, business model, marketing strategy, financial projections (3 years), team structure, and risk analysis.' },
    { id: 26, category: 'Business', title: 'SWOT Analysis', prompt: 'Conduct a detailed SWOT analysis for [COMPANY/PROJECT]. Identify 10+ items for each category: Strengths, Weaknesses, Opportunities, Threats. Provide strategic recommendations based on the analysis.' },
    { id: 27, category: 'Business', title: 'Pitch Deck Creator', prompt: 'Create content for a 10-slide investor pitch deck for [STARTUP]. Include: problem, solution, market opportunity, business model, traction, competition, team, financials, ask, and contact. Make it compelling and data-driven.' },
    { id: 28, category: 'Business', title: 'Meeting Agenda', prompt: 'Create a detailed meeting agenda for [MEETING PURPOSE]. Include: objectives, time allocations, discussion topics, decision points, action items template, and follow-up plan. Duration: [TIME]. Attendees: [ROLES].' },
    { id: 29, category: 'Business', title: 'Project Proposal', prompt: 'Write a professional project proposal for [PROJECT]. Include: executive summary, objectives, scope, methodology, timeline, resource requirements, budget breakdown, risks, deliverables, and success metrics.' },
    { id: 30, category: 'Business', title: 'KPI Dashboard', prompt: 'Design a KPI dashboard for [DEPARTMENT/PROJECT]. Define: 8-10 key metrics to track, targets, data sources, visualization types, reporting frequency, and how to interpret results. Focus on: [GOALS].' },
    { id: 31, category: 'Business', title: 'Process Optimizer', prompt: 'Analyze and optimize the following business process: [DESCRIBE PROCESS]. Identify: bottlenecks, inefficiencies, automation opportunities, cost reduction areas, and provide step-by-step improved process with expected impact.' },
    { id: 32, category: 'Business', title: 'Contract Template', prompt: 'Create a professional [CONTRACT TYPE] contract template for [PURPOSE]. Include: all standard clauses, terms and conditions, payment terms, termination clauses, liability limitations, and dispute resolution. Make it legally sound.' },

    // Education Prompts
    { id: 33, category: 'Education', title: 'Lesson Plan Creator', prompt: 'Create a detailed lesson plan for teaching [TOPIC] to [GRADE LEVEL]. Include: learning objectives, materials needed, introduction activity, main lesson (step-by-step), practice activities, assessment methods, and homework. Duration: [TIME].' },
    { id: 34, category: 'Education', title: 'Study Guide Generator', prompt: 'Create a comprehensive study guide for [SUBJECT/TOPIC]. Include: key concepts, definitions, formulas, practice questions with answers, mnemonics, visual aids descriptions, and study tips. Suitable for [EXAM/LEVEL].' },
    { id: 35, category: 'Education', title: 'Quiz Maker', prompt: 'Create a [NUMBER]-question quiz on [TOPIC]. Include: multiple choice (50%), true/false (20%), short answer (20%), and essay questions (10%). Provide answer key with explanations. Difficulty: [EASY/MEDIUM/HARD].' },
    { id: 36, category: 'Education', title: 'Homework Helper', prompt: 'Help me understand and solve this homework problem: [PROBLEM]. Don\'t just give the answer - explain: the concept, step-by-step solution process, why each step is necessary, and similar practice problems. Subject: [SUBJECT].' },
    { id: 37, category: 'Education', title: 'Research Paper Helper', prompt: 'Help me write a research paper on [TOPIC]. Provide: thesis statement, outline with main arguments, recommended sources, citation examples ([APA/MLA/CHICAGO]), and tips for writing each section. Length: [WORDS].' },
    { id: 38, category: 'Education', title: 'Learning Path Designer', prompt: 'Design a complete learning path for mastering [SKILL/SUBJECT]. Include: prerequisites, curriculum breakdown (beginner to advanced), recommended resources, practice projects, time estimates, and milestone assessments.' },
    { id: 39, category: 'Education', title: 'Concept Explainer', prompt: 'Explain [COMPLEX CONCEPT] in simple terms suitable for [AGE/LEVEL]. Use: analogies, real-world examples, visual descriptions, and step-by-step breakdown. Then provide progressively more advanced explanations.' },
    { id: 40, category: 'Education', title: 'Flashcard Generator', prompt: 'Create 30 flashcards for memorizing [TOPIC]. Each card should have: question on front, detailed answer on back, relevant examples, and memory tips. Cover all key concepts comprehensively.' },

    // Social Media Prompts
    { id: 41, category: 'Social Media', title: 'Instagram Caption Writer', prompt: 'Write 10 engaging Instagram captions for [TOPIC/NICHE]. Each should include: hook, value/story, call-to-action, and 15-20 relevant hashtags. Vary the style: inspirational, educational, entertaining, promotional. Character limit: 2200.' },
    { id: 42, category: 'Social Media', title: 'Tweet Thread Creator', prompt: 'Create a viral Twitter thread about [TOPIC]. Include: attention-grabbing first tweet, 8-12 follow-up tweets with valuable insights, data/statistics, practical tips, and CTA in final tweet. Keep each tweet under 280 characters.' },
    { id: 43, category: 'Social Media', title: 'LinkedIn Post Generator', prompt: 'Write a professional LinkedIn post about [TOPIC]. Include: compelling hook, personal story/experience, valuable insights, actionable takeaways, and engagement question. Tone: authentic and professional. Length: 150-300 words.' },
    { id: 44, category: 'Social Media', title: 'TikTok Script Writer', prompt: 'Write a TikTok video script for [TOPIC]. Include: 3-second hook, main content (45 seconds), on-screen text ideas, trending sound suggestions, and hashtag strategy. Make it entertaining and shareable.' },
    { id: 45, category: 'Social Media', title: 'Facebook Ad Copy', prompt: 'Create Facebook ad copy for [PRODUCT/SERVICE]. Write: 5 headline variations (40 chars), primary text (125 words), description (30 words), and CTA button text. Target: [AUDIENCE]. Objective: [AWARENESS/CONVERSION].' },
    { id: 46, category: 'Social Media', title: 'YouTube Description', prompt: 'Write a complete YouTube video description for [VIDEO TOPIC]. Include: compelling summary, timestamps for key sections, relevant links, keyword-optimized text, call-to-action, and 10-15 tags. Length: 200-300 words.' },
    { id: 47, category: 'Social Media', title: 'Engagement Booster', prompt: 'Create 20 engaging social media posts for [BRAND/NICHE] that drive comments and shares. Include mix of: questions, fill-in-the-blank, polls, controversial takes, behind-the-scenes, user-generated content ideas.' },
    { id: 48, category: 'Social Media', title: 'Hashtag Strategy', prompt: 'Develop a hashtag strategy for [BRAND/CAMPAIGN] on [PLATFORM]. Provide: 5 branded hashtags, 20 industry hashtags (categorized by size), campaign hashtags, hashtag research tips, and usage guidelines.' },

    // SEO Prompts
    { id: 49, category: 'SEO', title: 'SEO Content Brief', prompt: 'Create an SEO content brief for targeting keyword "[KEYWORD]". Include: search intent analysis, recommended word count, H2-H3 outline, related keywords to include, competitor analysis, and internal linking opportunities.' },
    { id: 50, category: 'SEO', title: 'Meta Description Writer', prompt: 'Write 5 compelling meta descriptions for a page about [TOPIC]. Each should be 150-160 characters, include target keyword "[KEYWORD]", have a clear benefit, create urgency, and include a call-to-action.' },
    { id: 51, category: 'SEO', title: 'Keyword Cluster Generator', prompt: 'Create a keyword cluster around the main topic "[TOPIC]". Provide: pillar page keyword, 20 supporting keywords (grouped by subtopic), search intent for each, difficulty estimates, and content format recommendations.' },
    { id: 52, category: 'SEO', title: 'Title Tag Optimizer', prompt: 'Optimize this title tag for SEO: "[CURRENT TITLE]". Target keyword: "[KEYWORD]". Provide 5 improved variations that: include keyword naturally, are under 60 characters, are compelling, and include power words.' },
    { id: 53, category: 'SEO', title: 'Content Gap Analysis', prompt: 'Analyze content gaps for [WEBSITE] in [NICHE]. Compare against top 3 competitors: [COMPETITORS]. Identify: missing topics, keyword opportunities, content types to create, and prioritized content roadmap.' },
    { id: 54, category: 'SEO', title: 'Link Building Outreach', prompt: 'Write a link building outreach email template for [CONTENT/RESOURCE]. Include: personalized intro, value proposition, specific linking opportunity, why it benefits them, and polite follow-up. Make it conversational and genuine.' },
    { id: 55, category: 'SEO', title: 'Schema Markup Guide', prompt: 'Recommend appropriate schema markup for [PAGE TYPE]. Explain: which schema types to use, required/recommended properties, implementation code examples, expected rich results, and validation steps.' },
    { id: 56, category: 'SEO', title: 'Local SEO Strategy', prompt: 'Create a local SEO strategy for [BUSINESS] in [LOCATION]. Cover: Google Business Profile optimization, local citations, review strategy, local content ideas, geo-targeted keywords, and local link building tactics.' },

    // Email Prompts
    { id: 57, category: 'Email', title: 'Welcome Email Series', prompt: 'Create a 5-email welcome sequence for [PRODUCT/SERVICE]. Each email should: Email 1: Welcome + set expectations, Email 2: Show value, Email 3: Educate, Email 4: Social proof, Email 5: Offer + CTA. Include subject lines.' },
    { id: 58, category: 'Email', title: 'Cold Email Template', prompt: 'Write a cold email template for [PURPOSE/GOAL]. Include: attention-grabbing subject line, personalized opening, clear value proposition, specific ask, and easy next step. Keep under 150 words. Tone: professional but friendly.' },
    { id: 59, category: 'Email', title: 'Cart Abandonment Email', prompt: 'Create a 3-email cart abandonment sequence. Email 1 (1 hour): Gentle reminder, Email 2 (24 hours): Add urgency + benefits, Email 3 (48 hours): Discount offer. Include subject lines, preview text, and CTAs.' },
    { id: 60, category: 'Email', title: 'Re-engagement Campaign', prompt: 'Write a re-engagement email for inactive subscribers. Include: attention-grabbing subject line, acknowledge absence, highlight what they\'ve missed, exclusive offer, easy way to update preferences, and friendly unsubscribe option.' },
    { id: 61, category: 'Email', title: 'Product Launch Email', prompt: 'Write a product launch announcement email for [PRODUCT]. Include: exciting subject line, build anticipation, highlight key features and benefits, limited-time offer, social proof, FAQs, and multiple CTAs.' },
    { id: 62, category: 'Email', title: 'Feedback Request Email', prompt: 'Create a customer feedback request email for [PRODUCT/SERVICE]. Make it: short and easy to respond, explain why feedback matters, offer incentive (optional), include direct link to survey, and thank them for time.' },
    { id: 63, category: 'Email', title: 'Newsletter Template', prompt: 'Design a weekly newsletter template for [NICHE/AUDIENCE]. Include: catchy subject line formula, greeting, featured content section, quick tips, resource recommendations, community highlights, and call-to-action.' },
    { id: 64, category: 'Email', title: 'Referral Program Email', prompt: 'Write a referral program promotion email. Explain: how the program works, benefits for referrer and referee, make sharing easy with copy-paste message templates, track rewards, and create urgency with limited-time bonus.' },

    // Creative Prompts
    { id: 65, category: 'Creative', title: 'Brainstorm Ideas', prompt: 'Generate 50 creative ideas for [PROJECT/GOAL]. Think outside the box and include: conventional approaches, unconventional solutions, crazy ideas that might work, and hybrid concepts. Categorize by feasibility and impact.' },
    { id: 66, category: 'Creative', title: 'Slogan Creator', prompt: 'Create 20 memorable slogans for [BRAND/PRODUCT]. Each should be: short (3-7 words), catchy and memorable, reflect brand values, differentiate from competitors, and evoke emotion. Explain the concept behind each.' },
    { id: 67, category: 'Creative', title: 'Character Developer', prompt: 'Develop a detailed character for [STORY/GAME]. Include: physical description, personality traits, backstory, motivations, fears, relationships, unique quirks, character arc, and dialogue examples. Make them three-dimensional.' },
    { id: 68, category: 'Creative', title: 'World Building', prompt: 'Create a detailed fictional world for [GENRE]. Define: geography, climate, political systems, economy, social structure, technology level, magic/science rules, history, cultures, and conflicts. Make it internally consistent.' },
    { id: 69, category: 'Creative', title: 'Plot Generator', prompt: 'Generate 10 unique plot ideas for [GENRE] story. Each should include: protagonist, conflict, stakes, twist, and resolution direction. Vary the complexity and themes. Make them original and engaging.' },
    { id: 70, category: 'Creative', title: 'Design Brief', prompt: 'Create a comprehensive design brief for [PROJECT]. Include: project overview, objectives, target audience, brand guidelines, mood/inspiration references, deliverables, technical requirements, timeline, and success criteria.' },
    { id: 71, category: 'Creative', title: 'Video Concept', prompt: 'Develop a creative video concept for [BRAND/MESSAGE]. Include: big idea, story arc, visual style, mood, music suggestions, key scenes, runtime, target platforms, and how it achieves marketing objectives.' },
    { id: 72, category: 'Creative', title: 'Campaign Theme', prompt: 'Create a creative campaign theme for [BRAND/PRODUCT] targeting [AUDIENCE]. Develop: central concept, tagline, visual direction, content pillars, activation ideas across channels, and measurement approach.' },

    // Productivity Prompts
    { id: 73, category: 'Productivity', title: 'Task Prioritization', prompt: 'Help me prioritize these tasks: [LIST TASKS]. Analyze each by: urgency, importance, effort required, impact. Use Eisenhower Matrix to categorize. Provide recommended order and time estimates. Suggest what to delegate/eliminate.' },
    { id: 74, category: 'Productivity', title: 'Time Management Plan', prompt: 'Create a personalized time management system for [ROLE/SITUATION]. Include: daily schedule template, time blocking strategy, productivity techniques to use, tools/apps recommendations, and habit-building approach.' },
    { id: 75, category: 'Productivity', title: 'Goal Setting Framework', prompt: 'Help me set and plan SMART goals for [AREA/TIME PERIOD]. For each goal: make it Specific, Measurable, Achievable, Relevant, Time-bound. Break into milestones, action steps, and create accountability system.' },
    { id: 76, category: 'Productivity', title: 'Meeting Minutes', prompt: 'Summarize this meeting transcript: [PASTE TRANSCRIPT]. Create structured minutes including: attendees, key decisions, action items with owners and deadlines, open questions, and next steps. Format: professional and scannable.' },
    { id: 77, category: 'Productivity', title: 'Daily Planning', prompt: 'Create my daily plan for [DATE]. My priorities: [PRIORITIES]. Appointments: [APPOINTMENTS]. Include: morning routine, time blocks for deep work, breaks, meetings, admin time, buffer time, and evening wind-down.' },
    { id: 78, category: 'Productivity', title: 'Email Management', prompt: 'Create an email management system to reach inbox zero. Provide: folder structure, filtering rules, response templates, time-saving shortcuts, when to respond/archive/delete guidelines, and daily email routine.' },
    { id: 79, category: 'Productivity', title: 'Habit Tracker', prompt: 'Design a habit tracking system for building [HABITS]. Include: habit stacking strategies, tracking method, accountability measures, obstacle preparation, reward system, and 30-day challenge structure.' },
    { id: 80, category: 'Productivity', title: 'Decision Framework', prompt: 'Create a decision-making framework for [TYPE OF DECISIONS]. Include: criteria to evaluate, weighting system, pros/cons analysis template, risk assessment, bias checks, and when to trust gut vs. analyze.' },

    // Career Prompts
    { id: 81, category: 'Career', title: 'Resume Builder', prompt: 'Help me write a resume for [JOB TITLE]. My background: [BRIEF SUMMARY]. Create: compelling summary, achievement-focused bullets using action verbs, quantified results, relevant skills section, and ATS-optimized format.' },
    { id: 82, category: 'Career', title: 'Cover Letter Writer', prompt: 'Write a compelling cover letter for [JOB TITLE] at [COMPANY]. Show: why I\'m passionate about company, how my skills match requirements, specific achievements, value I bring, and strong call-to-action. Length: 300-400 words.' },
    { id: 83, category: 'Career', title: 'Interview Prep', prompt: 'Prepare me for interview for [JOB TITLE]. Provide: 15 likely questions with strong answer frameworks, questions to ask interviewer, STAR method examples, salary negotiation tips, and day-of checklist.' },
    { id: 84, category: 'Career', title: 'LinkedIn Profile', prompt: 'Optimize my LinkedIn profile for [TARGET ROLE]. Improve: headline (compelling + keyword-rich), about section (story-based), experience bullets (achievement-focused), skills (strategic), and engagement strategy.' },
    { id: 85, category: 'Career', title: 'Salary Negotiation', prompt: 'Prepare salary negotiation strategy for offer: [OFFER DETAILS]. My target: [TARGET]. Provide: market research approach, negotiation scripts, alternative compensation to discuss, how to handle objections, and when to accept/walk away.' },
    { id: 86, category: 'Career', title: 'Career Transition Plan', prompt: 'Create a plan to transition from [CURRENT FIELD] to [TARGET FIELD]. Include: skills gap analysis, learning roadmap, networking strategy, resume repositioning, portfolio projects, and 6-month timeline.' },
    { id: 87, category: 'Career', title: 'Performance Review', prompt: 'Help me prepare for annual review. My accomplishments: [LIST]. Create: achievement summary with metrics, growth areas identified proactively, development goals, promotion case if applicable, and talking points.' },
    { id: 88, category: 'Career', title: 'Personal Brand', prompt: 'Develop my personal brand strategy for [INDUSTRY/NICHE]. Define: unique value proposition, target audience, key messages, content themes, channel strategy, and 90-day execution plan. Make me stand out authentically.' },

    // Bonus Universal Prompts
    { id: 89, category: 'Productivity', title: 'Problem Solver', prompt: 'Help me solve this problem: [DESCRIBE PROBLEM]. Analyze: root causes, constraints, stakeholders affected. Generate 10 potential solutions (conventional and creative). Evaluate each by feasibility, cost, impact. Recommend top 3 with implementation plans.' },
    { id: 90, category: 'Business', title: 'ROI Calculator', prompt: 'Calculate ROI for [INITIATIVE/INVESTMENT]. Costs: [LIST]. Expected benefits: [LIST]. Provide: detailed cost-benefit analysis, break-even point, payback period, risk assessment, and recommendation with justification.' },
    { id: 91, category: 'Writing', title: 'Tone Adjuster', prompt: 'Rewrite this text in [FORMAL/CASUAL/FRIENDLY/PROFESSIONAL/PERSUASIVE/HUMOROUS] tone: [PASTE TEXT]. Maintain the core message but adjust vocabulary, sentence structure, and style to match the target tone perfectly.' },
    { id: 92, category: 'Creative', title: 'Analogy Generator', prompt: 'Create 10 creative analogies to explain [COMPLEX CONCEPT] to [AUDIENCE]. Each analogy should: use familiar reference points, clarify the concept, be memorable, and make understanding easier. Vary complexity.' },
    { id: 93, category: 'Education', title: 'Curriculum Designer', prompt: 'Design a complete curriculum for teaching [SUBJECT/SKILL]. Include: course overview, learning objectives, module breakdown (8-12 modules), lesson plans, assignments, assessments, recommended resources, and pacing guide.' },
    { id: 94, category: 'Marketing', title: 'Viral Content Formula', prompt: 'Analyze what makes content viral in [NICHE]. Then create 10 viral content ideas for [BRAND]. Each should have: hook, format, platform, emotional trigger, shareability factor, and engagement prediction.' },
    { id: 95, category: 'Coding', title: 'Code Documentation', prompt: 'Write comprehensive documentation for this code: [PASTE CODE]. Include: overview, prerequisites, installation steps, usage examples, API reference, configuration options, troubleshooting guide, and contribution guidelines.' },
    { id: 96, category: 'Business', title: 'Risk Assessment', prompt: 'Conduct risk assessment for [PROJECT/DECISION]. Identify: 10-15 potential risks, likelihood (low/medium/high), impact (low/medium/high), mitigation strategies, contingency plans, and risk ownership.' },
    { id: 97, category: 'SEO', title: 'Featured Snippet Optimizer', prompt: 'Optimize content to win featured snippet for query "[KEYWORD]". Provide: ideal answer format (paragraph/list/table), optimal length, structured data markup, supporting content, and comparison to current featured snippet.' },
    { id: 98, category: 'Social Media', title: 'Crisis Communication', prompt: 'Create crisis communication plan for [SITUATION] on social media. Include: immediate response template, holding statement, detailed response, FAQ, monitoring plan, escalation protocol, and reputation recovery strategy.' },
    { id: 99, category: 'Email', title: 'Segmentation Strategy', prompt: 'Design email list segmentation strategy for [BUSINESS]. Create: 8-10 segments based on behavior/demographics/engagement, segment-specific messaging, automation workflows, re-segmentation triggers, and personalization tactics.' },
    { id: 100, category: 'Career', title: 'Networking Strategy', prompt: 'Create a networking strategy to achieve [GOAL]. Include: target contacts to reach, conversation starters, value-first approach, follow-up system, relationship nurturing plan, and monthly action steps. Make it authentic.' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <Head>
        <title>100+ ChatGPT Prompt Templates Library - Ready-to-Use AI Prompts | Free</title>
        <meta name="description" content="Free library of 100+ ChatGPT prompt templates for writing, marketing, coding, business, education, SEO, and more. Copy-paste ready prompts to get better AI results instantly. No signup required." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/chatgpt-prompt-templates" />
        <meta name="keywords" content="ChatGPT prompts, AI prompt templates, ChatGPT examples, prompt library, AI writing prompts, ChatGPT for business, prompt engineering, AI prompts" />
        <meta property="og:title" content="100+ ChatGPT Prompt Templates - Free AI Prompt Library" />
        <meta property="og:description" content="Copy-paste ready ChatGPT prompts for every use case. 100+ professional templates to save time and get better AI results." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="100+ ChatGPT Prompt Templates Library" />
        <meta name="twitter:description" content="Free library of ready-to-use ChatGPT prompts for writing, marketing, coding, and more." />
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">ChatGPT Prompt Templates Library</h1>
        <p className="text-gray-600 mb-8">100+ ready-to-use ChatGPT prompt templates for writing, marketing, coding, business, education, and more. Simply copy, customize, and paste into ChatGPT, Claude, or any AI tool.</p>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search Prompts
              </label>
              <input
                type="text"
                placeholder="Search by title, category, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📁 Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} prompts
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 mb-8">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-emerald-500 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      {template.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800">{template.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(template.prompt, template.id)}
                  className={`btn px-4 py-2 text-sm whitespace-nowrap ${
                    copiedId === template.id 
                      ? 'bg-green-600 text-white' 
                      : 'btn-primary'
                  }`}
                >
                  {copiedId === template.id ? '✅ Copied!' : '📋 Copy Prompt'}
                </button>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono">
                {template.prompt}
              </p>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No prompts found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mt-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-6">How to Use ChatGPT Prompt Templates</h2>
          <div className="prose prose-emerald max-w-none text-gray-700 space-y-4">
            <p>
              Welcome to the most comprehensive library of <strong>ChatGPT prompt templates</strong> on the web! This free collection contains 100+ professionally crafted prompts across 12 categories, designed to help you get better results from <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">ChatGPT</a>, <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Claude</a>, <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Gemini</a>, and other AI tools instantly.
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">What Are ChatGPT Prompt Templates?</h3>
            <p>
              ChatGPT prompt templates are pre-written, structured prompts that you can copy and customize for your specific needs. Instead of struggling to write effective prompts from scratch, these templates provide proven frameworks that consistently produce high-quality AI responses. Each template includes placeholders (in [BRACKETS]) that you replace with your specific information.
            </p>
            <p>
              <strong>Example:</strong> Instead of asking "Write a blog post," use our template: "Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include an engaging introduction, 5 main sections with subheadings, actionable tips, and a compelling conclusion." The template provides structure that produces much better results.
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Use Prompt Templates?</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Save Time:</strong> No need to craft prompts from scratch. Copy, customize placeholders, and get results in seconds.</li>
              <li><strong>Better Results:</strong> Templates include proven structures that consistently produce high-quality, detailed AI responses.</li>
              <li><strong>Learn Prompt Engineering:</strong> Study how effective prompts are structured to improve your own prompt-writing skills.</li>
              <li><strong>Professional Quality:</strong> Get business-ready output without trial and error. Each template is tested and optimized.</li>
              <li><strong>Consistent Format:</strong> Templates ensure AI provides information in the exact format you need (lists, paragraphs, tables, etc.).</li>
              <li><strong>Reduce Ambiguity:</strong> Clear, detailed prompts minimize vague or incomplete AI responses.</li>
              <li><strong>100% Free:</strong> All 100+ templates are completely free with no signup or subscription required.</li>
              <li><strong>Universal Compatibility:</strong> Works with ChatGPT, Claude, Gemini, Perplexity, and all AI chat tools.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">How to Use These Templates (3 Simple Steps)</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Find Your Template:</strong> Browse by category or use the search bar to find a prompt that matches your need. We have templates for writing, marketing, coding, business, education, SEO, social media, email, creative work, productivity, and career.</li>
              <li><strong>Copy & Customize:</strong> Click "Copy Prompt" button to copy the template. Replace text in [BRACKETS] with your specific information. For example, change [TOPIC] to "artificial intelligence" or [AUDIENCE] to "small business owners."</li>
              <li><strong>Paste & Get Results:</strong> Paste the customized prompt into ChatGPT or your preferred AI tool. The AI will generate a detailed, structured response based on your specifications.</li>
            </ol>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Prompt Template Categories</h3>
            <p>
              Our library covers 12 comprehensive categories with 100+ templates:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Writing (8 templates)</h4>
                <p className="text-sm text-gray-700">Blog posts, stories, articles, essays, product descriptions, press releases, scripts, newsletters</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📢 Marketing (8 templates)</h4>
                <p className="text-sm text-gray-700">Ad copy, landing pages, sales funnels, brand voice, content calendars, competitor analysis, personas, value propositions</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Coding (8 templates)</h4>
                <p className="text-sm text-gray-700">Code explanations, bug fixing, function creation, algorithms, code reviews, APIs, database schemas, unit tests</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💼 Business (8 templates)</h4>
                <p className="text-sm text-gray-700">Business plans, SWOT analysis, pitch decks, meeting agendas, proposals, KPI dashboards, process optimization, contracts</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📚 Education (8 templates)</h4>
                <p className="text-sm text-gray-700">Lesson plans, study guides, quizzes, homework help, research papers, learning paths, concept explanations, flashcards</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📱 Social Media (8 templates)</h4>
                <p className="text-sm text-gray-700">Instagram captions, Twitter threads, LinkedIn posts, TikTok scripts, Facebook ads, YouTube descriptions, engagement posts, hashtags</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🔍 SEO (8 templates)</h4>
                <p className="text-sm text-gray-700">Content briefs, meta descriptions, keyword clusters, title tags, content gaps, link building, schema markup, local SEO</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📧 Email (8 templates)</h4>
                <p className="text-sm text-gray-700">Welcome series, cold emails, cart abandonment, re-engagement, product launches, feedback requests, newsletters, referrals</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎨 Creative (8 templates)</h4>
                <p className="text-sm text-gray-700">Brainstorming, slogans, character development, world building, plot generation, design briefs, video concepts, campaigns</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">⚡ Productivity (8 templates)</h4>
                <p className="text-sm text-gray-700">Task prioritization, time management, goal setting, meeting minutes, daily planning, email management, habit tracking, decisions</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💼 Career (8 templates)</h4>
                <p className="text-sm text-gray-700">Resumes, cover letters, interview prep, LinkedIn profiles, salary negotiation, career transitions, performance reviews, personal branding</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">➕ Bonus Templates (12 templates)</h4>
                <p className="text-sm text-gray-700">Problem solving, ROI calculators, tone adjustment, analogies, curriculum design, viral content, documentation, risk assessment</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Tips for Customizing Templates</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Replace ALL Placeholders:</strong> Look for text in [BRACKETS] and replace with your specific information. Don't leave any brackets in your final prompt.</li>
              <li><strong>Be Specific:</strong> The more specific your replacements, the better the AI output. Instead of [TOPIC] = "marketing," use [TOPIC] = "Instagram marketing for e-commerce brands."</li>
              <li><strong>Add Context:</strong> Include relevant background information that helps the AI understand your situation better.</li>
              <li><strong>Adjust Length/Format:</strong> Modify word counts, number of sections, or output format based on your needs.</li>
              <li><strong>Iterate:</strong> If the first result isn't perfect, refine your prompt or ask follow-up questions to improve the output.</li>
              <li><strong>Combine Templates:</strong> Mix elements from multiple templates to create custom prompts for unique situations.</li>
              <li><strong>Save Your Favorites:</strong> Bookmark or save templates you use frequently for quick access.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Best Practices for Using AI Prompts</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-800 mb-2">✅ DO: Be Clear and Specific</p>
                <p className="text-green-700">Give detailed instructions about format, length, tone, and specific requirements. Clear prompts = better results.</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-800 mb-2">✅ DO: Provide Context</p>
                <p className="text-green-700">Explain your situation, audience, goals, and constraints. Context helps AI tailor responses appropriately.</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-800 mb-2">✅ DO: Ask for Examples</p>
                <p className="text-green-700">Request examples, case studies, or specific formats to make responses more concrete and actionable.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-red-800 mb-2">❌ DON'T: Be Vague</p>
                <p className="text-red-700">Avoid generic prompts like "Tell me about marketing." Use specific templates with clear parameters instead.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-red-800 mb-2">❌ DON'T: Skip Fact-Checking</p>
                <p className="text-red-700">Always verify AI-generated facts, statistics, and claims. AI can make mistakes or provide outdated information.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Example: Before vs. After Using Templates</h3>
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
              <p className="font-semibold text-red-800 mb-2">❌ Vague Prompt (Poor Results)</p>
              <p className="text-red-700 font-mono text-sm">"Write a marketing email"</p>
              <p className="text-red-700 text-sm mt-2"><strong>Result:</strong> Generic, short email with no specific purpose or structure.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold text-green-800 mb-2">✅ Template-Based Prompt (Great Results)</p>
              <p className="text-green-700 font-mono text-sm">"Create a 3-email cart abandonment sequence. Email 1 (1 hour): Gentle reminder, Email 2 (24 hours): Add urgency + benefits, Email 3 (48 hours): Discount offer. Product: wireless headphones. Include subject lines, preview text, and CTAs."</p>
              <p className="text-green-700 text-sm mt-2"><strong>Result:</strong> Complete 3-email sequence with specific subject lines, strategic timing, personalized content, and clear CTAs ready to implement.</p>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Are these prompts really free?</h4>
                <p className="text-gray-700">Yes! All 100+ ChatGPT prompt templates are completely free. No signup, no subscription, no hidden costs. Copy and use as many as you want.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Do these work with Claude, Gemini, and other AI tools?</h4>
                <p className="text-gray-700">Absolutely! These templates work with ChatGPT, Claude, Google Gemini, Perplexity, Bing Copilot, and any AI chat tool. The prompt structure is universal.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Can I modify these templates?</h4>
                <p className="text-gray-700">Yes, please do! These templates are designed to be customized. Adjust length, format, tone, and any parameters to fit your specific needs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">How do I choose the right template?</h4>
                <p className="text-gray-700">Use the category filter or search function to find templates matching your task. Browse the title and prompt preview to see if it fits your needs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">What if I need a template that's not here?</h4>
                <p className="text-gray-700">Use our <a href="/tools/ai-prompt-generator" className="text-emerald-600 hover:underline">AI Prompt Generator</a> to create custom prompts for any purpose. Or modify existing templates to suit your unique needs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Do I need ChatGPT Plus to use these?</h4>
                <p className="text-gray-700">No! These templates work with free ChatGPT, Claude, and all AI tools. ChatGPT Plus offers faster responses and GPT-4 access, but templates work on free versions too.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Choose Our Prompt Template Library?</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>100+ Professional Templates:</strong> Largest free collection covering every use case</li>
              <li><strong>Copy-Paste Ready:</strong> No editing required - just customize placeholders</li>
              <li><strong>12 Categories:</strong> Organized by use case for easy finding</li>
              <li><strong>Search & Filter:</strong> Quickly find exactly what you need</li>
              <li><strong>Tested & Optimized:</strong> Each template produces high-quality results</li>
              <li><strong>Regular Updates:</strong> New templates added frequently</li>
              <li><strong>100% Free:</strong> No signup, no limits, no costs</li>
              <li><strong>Universal Compatibility:</strong> Works with all AI chat tools</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Start Using ChatGPT Prompt Templates Now</h3>
            <p>
              Browse our library above, copy any template, customize it for your needs, and paste into ChatGPT or your preferred AI tool. Get professional-quality AI responses instantly without struggling to write effective prompts from scratch. Whether you need help with writing, marketing, coding, business, education, or any other task, we have a template ready for you.
            </p>
            <p className="font-semibold text-emerald-800 mt-4">
              Save time, get better results, and become a ChatGPT power user with our free prompt templates!
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Related AI Tools</h3>
            <p className="mb-4">Enhance your AI workflow with our other powerful tools:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/tools/ai-prompt-generator" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Prompt Generator</h4>
                <p className="text-sm text-gray-600">Create custom AI prompts for any purpose</p>
              </a>
              <a href="/tools/ai-content-detector" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Content Detector</h4>
                <p className="text-sm text-gray-600">Check if text is AI-generated</p>
              </a>
              <a href="/tools/ai-resume-optimizer" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Resume Optimizer</h4>
                <p className="text-sm text-gray-600">Optimize resume for ATS systems</p>
              </a>
              <a href="/tools/word-counter" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Word Counter</h4>
                <p className="text-sm text-gray-600">Count words in AI-generated content</p>
              </a>
              <a href="/tools/paraphraser" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Paraphraser</h4>
                <p className="text-sm text-gray-600">Rewrite AI text in different words</p>
              </a>
              <a href="/tools/text-cleaner" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Text Cleaner</h4>
                <p className="text-sm text-gray-600">Clean and format AI-generated text</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
