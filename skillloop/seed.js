// seed.js - Seeds MongoDB with realistic initial demo campus records
// Run this anytime with: npm run seed or node seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Skill = require('./models/Skill');
const ExchangeRequest = require('./models/ExchangeRequest');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://shivanshrajput3009_db_user:1zZTzibQiuLJgg1j@cluster0.u1lkuak.mongodb.net/skillloop?retryWrites=true&w=majority';
    console.log(`Connecting to MongoDB Atlas at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@')}`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas.');

    // Check existing records to prevent duplication
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`ℹ️ Database already contains data (${userCount} users found).`);
      console.log('Database already populated with campus records.');
      process.exit(0);
    }

    console.log('🌱 Seeding initial demo students...');
    const users = await User.insertMany([
      { name: 'Rahul Sharma', email: 'rahul.sharma@campus.edu', department: 'Computer Science', credits: 75 },
      { name: 'Priya Patel', email: 'priya.design@campus.edu', department: 'Design & Multimedia', credits: 60 },
      { name: 'Amit Kumar', email: 'amit.music@campus.edu', department: 'Electronics Engg', credits: 45 },
      { name: 'Sneha Reddy', email: 'sneha.reddy@campus.edu', department: 'Mathematics & Computing', credits: 80 },
      { name: 'Vikram Singh', email: 'vikram.photo@campus.edu', department: 'Mechanical Engg', credits: 50 }
    ]);
    console.log(`✅ Created ${users.length} demo students.`);

    console.log('🌱 Seeding initial campus skills...');
    const skills = await Skill.insertMany([
      {
        title: 'Core Java & OOP Concepts',
        description: 'Comprehensive help with object-oriented programming, classes, polymorphism, interfaces, and Java lab assignments. Ideal for first/second-year students.',
        category: 'Programming',
        level: 'Intermediate',
        ownerName: 'Rahul Sharma',
        availability: 'Mon, Wed, Fri (After 5 PM)',
        duration: '1 hour per session',
        credits: 15,
        status: 'Available'
      },
      {
        title: 'Figma UI/UX & Wireframing',
        description: 'Learn modern user interface design, Figma components, auto-layout, interactive prototypes, and typography tips for college project presentations.',
        category: 'Design',
        level: 'Advanced',
        ownerName: 'Priya Patel',
        availability: 'Tue, Thu (Evening)',
        duration: '1.5 hours per session',
        credits: 20,
        status: 'Available'
      },
      {
        title: 'Acoustic Guitar Chords & Strumming',
        description: 'Hands-on beginner guitar lessons: tuning, open chords (C, G, D, Em), finger transitions, and rhythm strumming for popular campus songs.',
        category: 'Music',
        level: 'Beginner',
        ownerName: 'Amit Kumar',
        availability: 'Weekends (Flexible)',
        duration: '45 mins per session',
        credits: 10,
        status: 'Available'
      },
      {
        title: 'Engineering Mathematics & Calculus',
        description: 'Step-by-step problem solving for integration, differential equations, Taylor series, and Laplace transforms. Exam-focused crash prep.',
        category: 'Academics',
        level: 'Advanced',
        ownerName: 'Sneha Reddy',
        availability: 'Mon to Thu (4 PM - 6 PM)',
        duration: '1 hour per session',
        credits: 25,
        status: 'Available'
      },
      {
        title: 'Python for Beginners & Automation',
        description: 'Learn Python syntax, loops, lists, dictionaries, reading files, and simple automation scripts to boost productivity.',
        category: 'Programming',
        level: 'Beginner',
        ownerName: 'Rahul Sharma',
        availability: 'Saturday & Sunday mornings',
        duration: '1.5 hours per session',
        credits: 15,
        status: 'Available'
      },
      {
        title: 'Campus Photography & Lightroom Editing',
        description: 'Learn the exposure triangle (aperture, shutter speed, ISO), rule-of-thirds composition, and portrait color grading in Adobe Lightroom.',
        category: 'Photography',
        level: 'Beginner',
        ownerName: 'Vikram Singh',
        availability: 'Sundays (Campus ground)',
        duration: '2 hours per workshop',
        credits: 15,
        status: 'Available'
      },
      {
        title: 'Conversational Spanish Basics',
        description: 'Learn fundamental Spanish vocabulary, everyday conversational greetings, question-asking, and cultural phrases.',
        category: 'Languages',
        level: 'Beginner',
        ownerName: 'Priya Patel',
        availability: 'Wednesdays (6 PM)',
        duration: '45 mins per session',
        credits: 12,
        status: 'Available'
      },
      {
        title: 'Web Dev Essentials (HTML, CSS & Flexbox)',
        description: 'Master building responsive web pages from scratch without frameworks. Perfect for students making their first web development portfolio.',
        category: 'Programming',
        level: 'Beginner',
        ownerName: 'Amit Kumar',
        availability: 'Tue, Fri (After 6 PM)',
        duration: '1 hour per session',
        credits: 18,
        status: 'Available'
      }
    ]);
    console.log(`✅ Created ${skills.length} demo skills.`);

    console.log('🌱 Seeding initial exchange requests...');
    await ExchangeRequest.insertMany([
      {
        skillId: skills[0]._id,
        skillTitle: skills[0].title,
        requesterName: 'Priya Patel',
        ownerName: 'Rahul Sharma',
        message: 'Hey Rahul! I would love to learn Java for my Data Structures lab. In exchange, I can design a custom portfolio or app mockup in Figma for you!',
        status: 'Accepted'
      },
      {
        skillId: skills[3]._id,
        skillTitle: skills[3].title,
        requesterName: 'Amit Kumar',
        ownerName: 'Sneha Reddy',
        message: 'Hi Sneha, I am having trouble with differential equations before midterms. Could you spare an hour? I can teach you guitar chords in return.',
        status: 'Pending'
      },
      {
        skillId: skills[2]._id,
        skillTitle: skills[2].title,
        requesterName: 'Sneha Reddy',
        ownerName: 'Amit Kumar',
        message: 'Always wanted to pick up the guitar for fun! Looking forward to learning.',
        status: 'Completed'
      },
      {
        skillId: skills[4]._id,
        skillTitle: skills[4].title,
        requesterName: 'Vikram Singh',
        ownerName: 'Rahul Sharma',
        message: 'Want to automate image renaming and folder sorting with Python. Let me know if we can exchange for a photo session!',
        status: 'Pending'
      }
    ]);
    console.log('✅ Created demo exchange requests.');

    console.log('\n🎉 Seed completed successfully!');
    console.log('💡 Primary demo student for testing: Rahul Sharma');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
