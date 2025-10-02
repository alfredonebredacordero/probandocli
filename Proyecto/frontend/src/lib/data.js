export const jobs = [
  {
    id: 'job1',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    payRate: '$1500 - $2000 / project',
    location: 'New York, NY',
    duration: 'Project-based (2 weeks)',
    category: 'Technology',
    description: 'We are looking for a skilled Frontend Developer for a short-term project to implement key UI components.',
    shopContactEmail: 'techsolutions@example.com',
    shopContactPhone: '555-111-2222',
  },
  {
    id: 'job2',
    title: 'Barista',
    company: 'Coffee Nook',
    payRate: '$18 - $22 / hour',
    location: 'Brooklyn, NY',
    duration: 'Weekend shifts',
    category: 'Food Service',
    description: 'Join our cozy cafe for weekend shifts! We need someone passionate about coffee and customer service.',
    shopContactEmail: 'coffeenook@example.com',
    shopContactPhone: '555-222-3333',
  },
  {
    id: 'job3',
    title: 'Delivery Driver',
    company: 'QuickShip Logistics',
    payRate: '$25 / hour + tips',
    location: 'Queens, NY',
    duration: 'Flexible (Weekends)',
    category: 'Delivery',
    description: "Seeking reliable delivery drivers with their own vehicle for weekend deliveries. Must have a valid driver's license and clean driving record.",
    shopContactEmail: 'quickship@example.com',
    shopContactPhone: '555-333-4444',
  },
  {
    id: 'job4',
    title: 'Retail Associate',
    company: 'Fashion Forward',
    payRate: '$17 / hour',
    location: 'Manhattan, NY',
    duration: 'Holiday Season (Part-time)',
    category: 'Retail',
    description: 'Energetic Retail Associate needed for the busy holiday season. Assist customers, manage inventory, and maintain store appearance.',
    shopContactEmail: 'fashionforward@example.com',
    shopContactPhone: '555-444-5555',
  },
  {
    id: 'job5',
    title: 'Graphic Designer',
    company: 'Creative Minds Agency',
    payRate: '$60 - $80 / hour',
    location: 'Remote',
    duration: 'Contract (3 months)',
    category: 'Design',
    description: 'Freelance Graphic Designer wanted for a 3-month contract. Strong portfolio and proficiency in Adobe Creative Suite required.',
    shopContactEmail: 'creativeminds@example.com',
    shopContactPhone: '555-555-6666',
  },
  {
    id: 'job6',
    title: 'Customer Support Rep',
    company: 'Global Connect',
    payRate: '$25 / hour',
    location: 'Remote',
    duration: 'Temporary (6 weeks)',
    category: 'Customer Service',
    description: 'Provide excellent customer support for our software product for a 6-week temporary assignment. Must be a problem-solver with great communication skills.',
    shopContactEmail: 'globalconnect@example.com',
    shopContactPhone: '555-666-7777',
  },
  {
    id: 'job7',
    title: 'Data Entry Clerk',
    company: 'Data Solutions Co.',
    payRate: '$19 / hour',
    location: 'Bronx, NY',
    duration: 'Part-time (Afternoons)',
    category: 'Administrative',
    description: 'Accurate and efficient Data Entry Clerk needed for afternoon shifts. Must have strong attention to detail and basic computer skills.',
    shopContactEmail: 'datasolutions@example.com',
    shopContactPhone: '555-777-8888',
  },
];

export const users = [
  {
    id: 'worker1',
    name: 'Alice Smith',
    education: 'B.S. Computer Science',
    age: 28,
    description: 'Passionate frontend developer with 5 years of experience in React and modern web technologies.',
    experience: '5 years in Web Development',
    gender: 'Female',
    applications: ['job2', 'job4'], // Job IDs of applied jobs
    hiredJobs: ['job1'], // Job IDs of jobs where the worker was hired
    notifications: [
      {
        id: 'notif1',
        type: 'new_job_match',
        message: 'New job matches your skills: Senior Frontend Dev at Innovate Corp.',
        timestamp: Date.now() - (1000 * 60 * 5), // 5 minutes ago
        read: false,
        link: '/job/job8', // Assuming job8 exists
      },
      {
        id: 'notif2',
        type: 'application_accepted',
        message: 'Your application for Barista at Coffee Nook has been accepted!',
        timestamp: Date.now() - (1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        link: '/dashboard', // Link to dashboard or specific application status
      },
      {
        id: 'notif3',
        type: 'job_filled',
        message: 'The Delivery Driver position at QuickShip Logistics has been filled.',
        timestamp: Date.now() - (1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        link: '/job/job3',
      },
      {
        id: 'notif4',
        type: 'new_message',
        message: 'New message from Fashion Forward regarding your Retail Associate application.',
        timestamp: Date.now() - (1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: false,
        link: '/messages/fashionforward', // Link to messages or application
      },
      {
        id: 'notif5',
        type: 'job_starts_soon',
        message: 'Reminder: Your Frontend Developer project starts tomorrow!',
        timestamp: Date.now() - (1000 * 60 * 60 * 24 * 5), // 5 days ago
        read: true,
        link: '/dashboard',
      },
    ],
  },
  {
    id: 'worker2',
    name: 'Bob Johnson',
    education: 'High School Diploma',
    age: 22,
    description: 'Hardworking and reliable individual seeking part-time opportunities in food service or delivery.',
    experience: '2 years in Customer Service',
    gender: 'Male',
    applications: [],
    hiredJobs: [],
    notifications: [],
  },
];
