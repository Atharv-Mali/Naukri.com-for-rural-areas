import { Job } from './types';

export const ALL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Farm Manager',
    company: 'Green Valley Agriculture',
    location: 'RuralTown, USA',
    description: 'Oversee daily operations of a large-scale organic farm. Responsibilities include crop planning, staff management, and ensuring compliance with organic standards.',
    skills: ['Agronomy', 'Team Leadership', 'Organic Farming', 'Budgeting'],
    type: 'full-time',
    postedDate: '2023-10-01',
    providerUsername: 'provider1'
  },
  {
    id: '2',
    title: 'Agritech Specialist',
    company: 'AgriFuture Inc.',
    location: 'Farmville, USA',
    description: 'Implement and manage precision agriculture technologies, including GPS-guided tractors, drones for crop monitoring, and data analysis for yield optimization.',
    skills: ['Precision Agriculture', 'Data Analysis', 'Drone Operation', 'GIS Software'],
    type: 'full-time',
    postedDate: '2023-10-05',
    providerUsername: 'provider1'
  },
  {
    id: '3',
    title: 'Seasonal Harvester',
    company: 'Sunny Orchards',
    location: 'Orchard City, USA',
    description: 'Assist with the seasonal harvesting of apples and pears. This is a temporary position with the potential for future opportunities.',
    skills: ['Manual Dexterity', 'Teamwork', 'Punctuality'],
    type: 'part-time',
    postedDate: '2023-09-20',
    providerUsername: 'provider2'
  },
  {
    id: '4',
    title: 'Veterinary Technician',
    company: 'Countryside Vets',
    location: 'Meadowlands, USA',
    description: 'Support veterinarians in a mixed-practice clinic serving both large and small animals. Duties include animal handling, lab work, and client communication.',
    skills: ['Animal Handling', 'Veterinary Medicine', 'Client Communication', 'Lab Procedures'],
    type: 'full-time',
    postedDate: '2023-10-12',
    providerUsername: 'provider2'
  },
  {
    id: '5',
    title: 'Farmers Market Stall Manager',
    company: 'Local Roots Cooperative',
    location: 'Marketville, USA',
    description: 'Manage our stall at the weekly farmers market. Responsibilities include setup, sales, customer service, and inventory management.',
    skills: ['Customer Service', 'Sales', 'Inventory Management', 'Cash Handling'],
    type: 'part-time',
    postedDate: '2023-09-15',
    providerUsername: 'provider1'
  },
   {
    id: '6',
    title: 'Greenhouse Worker',
    company: 'Bloom & Grow Nursery',
    location: 'Greenleaf, USA',
    description: 'Care for plants in a commercial greenhouse. Tasks include watering, potting, pest control, and preparing orders for shipment.',
    skills: ['Horticulture', 'Pest Control', 'Attention to Detail'],
    type: 'part-time',
    postedDate: '2023-10-18',
    providerUsername: 'provider2'
  },
];
