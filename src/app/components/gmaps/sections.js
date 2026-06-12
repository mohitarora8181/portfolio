import {
  getExperiencePeriod,
  getPortfolioData,
  getProjectDate,
  getSkillGroups,
} from '@/src/services/portfolioData'

const data = getPortfolioData()
const skillGroups = getSkillGroups()

export const PROFILE = {
  name: data.meta.name,
  firstName: data.meta.name.split(' ')[0],
  tagline: data.meta.tagline,
  email: data.meta.email,
  phone: data.meta.phone,
  avatar: data.meta.avatar,
  resume_url: data.meta.resume_url,
  links: data.meta.links,
  home: {
    coords: [28.6139, 77.209],
    zoom: 11,
    place: 'New Delhi, India',
  },
}

const locationBook = {
  about: { coords: [28.6139, 77.209], zoom: 12, place: 'New Delhi, India' },
  experience: { coords: [28.4595, 77.0266], zoom: 11, place: 'Gurugram, India' },
  projects: { coords: [28.7041, 77.1025], zoom: 11, place: 'Delhi project studio' },
  open_source: { coords: [12.9716, 77.5946], zoom: 11, place: 'Bengaluru developer community' },
  skills: { coords: [17.385, 78.4867], zoom: 11, place: 'Hyderabad tech map' },
  education: { coords: [28.6219, 77.0907], zoom: 15, place: 'MSIT, New Delhi' },
  achievements: { coords: [28.5458, 77.1926], zoom: 13, place: 'IIT Delhi innovation circuit' },
  contact: { coords: [28.6139, 77.209], zoom: 12, place: 'Contact base, New Delhi' },
}

const stopCoords = [
  [28.4595, 77.0266],
  [28.5355, 77.391],
  [19.076, 72.8777],
  [28.7041, 77.1025],
  [12.9716, 77.5946],
  [17.385, 78.4867],
  [28.6219, 77.0907],
  [28.5458, 77.1926],
]

const withCoords = (items, offset = 0) =>
  items.map((item, index) => ({
    ...item,
    place: item.place ?? item.location,
    coords: item.coords ?? stopCoords[(index + offset) % stopCoords.length],
  }))

const sections = [
  {
    id: 'about',
    type: 'about',
    title: 'About',
    category: 'Profile',
    icon: 'M',
    color: '#1a73e8',
    rating: 4.9,
    reviews: 818,
    location: locationBook.about,
    content: PROFILE,
    keywords: [data.meta.name, data.meta.tagline, data.meta.email, 'resume'],
  },
  {
    id: 'experience',
    type: 'experience',
    title: 'Experience',
    category: 'Work history',
    icon: 'W',
    color: '#0f9d58',
    rating: 4.8,
    reviews: data.experience.length * 42,
    location: locationBook.experience,
    content: withCoords(data.experience),
    keywords: data.experience.flatMap((item) => [item.company, item.role, ...item.tech_stack]),
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Projects',
    category: 'Selected builds',
    icon: 'P',
    color: '#fbbc04',
    rating: 4.9,
    reviews: data.projects.length * 55,
    location: locationBook.projects,
    content: withCoords(data.projects, 3),
    keywords: data.projects.flatMap((item) => [item.name, item.tagline, ...item.tech_stack]),
  },
  {
    id: 'open_source',
    type: 'open_source',
    title: 'Open Source',
    category: 'Contributions',
    icon: 'O',
    color: '#673ab7',
    rating: 4.7,
    reviews: data.open_source.length * 31,
    location: locationBook.open_source,
    content: withCoords(data.open_source, 4),
    keywords: data.open_source.map((item) => item.name),
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Skills',
    category: 'Tech stack',
    icon: 'S',
    color: '#ea4335',
    rating: 4.9,
    reviews: skillGroups.length * 63,
    location: locationBook.skills,
    content: withCoords(skillGroups.map((group) => ({ ...group, id: group.label })), 5),
    keywords: skillGroups.flatMap((group) => [group.label, ...group.items]),
  },
  {
    id: 'education',
    type: 'education',
    title: 'Education',
    category: 'Academic background',
    icon: 'E',
    color: '#0097a7',
    rating: 4.8,
    reviews: 76,
    location: locationBook.education,
    content: data.education,
    keywords: data.education.flatMap((item) => [item.institution, item.degree]),
  },
  {
    id: 'achievements',
    type: 'achievements',
    title: 'Achievements',
    category: 'Recognition',
    icon: 'A',
    color: '#ff6d00',
    rating: 4.8,
    reviews: data.achievements.length * 37,
    location: locationBook.achievements,
    content: withCoords(data.achievements, 7),
    keywords: data.achievements.flatMap((item) => [item.title, item.issuer, item.type]),
  },
  {
    id: 'contact',
    type: 'contact',
    title: 'Contact',
    category: 'Links and profiles',
    icon: 'C',
    color: '#4285f4',
    rating: 5,
    reviews: 100,
    location: locationBook.contact,
    content: PROFILE,
    keywords: ['email', 'phone', 'linkedin', 'github', 'portfolio'],
  },
]

export const SECTIONS = sections.map((section) => ({
  ...section,
  stops: section.content?.filter?.((item) => item.coords).map((item) => ({
    id: item.id ?? item.label ?? item.name,
    label: item.company ?? item.name ?? item.label ?? item.title,
    sub: item.role ?? item.tagline ?? item.issuer,
    coords: item.coords,
  })),
}))

export const RANDOM_PLACES = [
  { name: 'New Delhi', coords: [28.6139, 77.209] },
  { name: 'Gurugram', coords: [28.4595, 77.0266] },
  { name: 'Bengaluru', coords: [12.9716, 77.5946] },
  { name: 'Hyderabad', coords: [17.385, 78.4867] },
  { name: 'Mumbai', coords: [19.076, 72.8777] },
]

export const period = (startDate, endDate) =>
  getExperiencePeriod({ start_date: startDate, end_date: endDate })

export const projectDate = getProjectDate
