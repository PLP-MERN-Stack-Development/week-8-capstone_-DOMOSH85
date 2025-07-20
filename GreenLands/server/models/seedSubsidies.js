const mongoose = require('mongoose');
const Subsidy = require('./Subsidy');

const subsidies = [
  {
    name: 'Organic Farming Support',
    description: 'Financial support for farmers adopting organic practices.',
    eligibility: 'All registered farmers practicing organic farming.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
  },
  {
    name: 'Irrigation Equipment Grant',
    description: 'Grant for purchasing modern irrigation equipment.',
    eligibility: 'Farmers with less than 10 acres of land.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60) // 60 days from now
  },
  {
    name: 'Drought Relief Fund',
    description: 'Relief fund for farmers affected by drought.',
    eligibility: 'Farmers in drought-declared regions.',
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) // 15 days from now
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/greenlands');
  await Subsidy.deleteMany({});
  await Subsidy.insertMany(subsidies);
  console.log('Seeded subsidies!');
  await mongoose.disconnect();
}

seed(); 