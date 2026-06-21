import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const indianColleges = [
  { name: "IIT Delhi", location: "Delhi", baseFees: 200000, baseRating: 4.8, basePlacement: 95 },
  { name: "IIT Bombay", location: "Mumbai", baseFees: 220000, baseRating: 4.9, basePlacement: 97 },
  { name: "IIT Madras", location: "Chennai", baseFees: 210000, baseRating: 4.8, basePlacement: 96 },
  { name: "IIT Kanpur", location: "Kanpur", baseFees: 200000, baseRating: 4.7, basePlacement: 94 },
  { name: "IIT Kharagpur", location: "Kharagpur", baseFees: 195000, baseRating: 4.7, basePlacement: 93 },
  { name: "IIT Roorkee", location: "Roorkee", baseFees: 198000, baseRating: 4.6, basePlacement: 92 },
  { name: "IIT Guwahati", location: "Guwahati", baseFees: 190000, baseRating: 4.5, basePlacement: 89 },
  { name: "IIT Hyderabad", location: "Hyderabad", baseFees: 192000, baseRating: 4.5, basePlacement: 88 },
  { name: "IIT Bhubaneswar", location: "Bhubaneswar", baseFees: 180000, baseRating: 4.3, basePlacement: 85 },
  { name: "IIT Jodhpur", location: "Jodhpur", baseFees: 178000, baseRating: 4.3, basePlacement: 84 },
  { name: "NIT Trichy", location: "Trichy", baseFees: 120000, baseRating: 4.4, basePlacement: 88 },
  { name: "NIT Warangal", location: "Warangal", baseFees: 115000, baseRating: 4.3, basePlacement: 86 },
  { name: "NIT Surathkal", location: "Mangalore", baseFees: 118000, baseRating: 4.3, basePlacement: 85 },
  { name: "NIT Calicut", location: "Calicut", baseFees: 112000, baseRating: 4.2, basePlacement: 83 },
  { name: "NIT Rourkela", location: "Rourkela", baseFees: 110000, baseRating: 4.2, basePlacement: 82 },
  { name: "NIT Allahabad", location: "Allahabad", baseFees: 108000, baseRating: 4.1, basePlacement: 80 },
  { name: "NIT Jaipur", location: "Jaipur", baseFees: 106000, baseRating: 4.1, basePlacement: 79 },
  { name: "NIT Nagpur", location: "Nagpur", baseFees: 105000, baseRating: 4.0, basePlacement: 78 },
  { name: "NIT Durgapur", location: "Durgapur", baseFees: 103000, baseRating: 4.0, basePlacement: 77 },
  { name: "NIT Surat", location: "Surat", baseFees: 100000, baseRating: 3.9, basePlacement: 76 },
  { name: "BITS Pilani", location: "Pilani", baseFees: 350000, baseRating: 4.7, basePlacement: 93 },
  { name: "BITS Goa", location: "Goa", baseFees: 360000, baseRating: 4.5, basePlacement: 90 },
  { name: "BITS Hyderabad", location: "Hyderabad", baseFees: 355000, baseRating: 4.5, basePlacement: 89 },
  { name: "VIT Vellore", location: "Vellore", baseFees: 180000, baseRating: 4.2, basePlacement: 82 },
  { name: "VIT Chennai", location: "Chennai", baseFees: 185000, baseRating: 4.1, basePlacement: 80 },
  { name: "SRM Institute of Science and Technology", location: "Chennai", baseFees: 170000, baseRating: 4.0, basePlacement: 78 },
  { name: "Manipal Institute of Technology", location: "Manipal", baseFees: 280000, baseRating: 4.2, basePlacement: 83 },
  { name: "Amity University", location: "Noida", baseFees: 220000, baseRating: 3.8, basePlacement: 72 },
  { name: "Lovely Professional University", location: "Phagwara", baseFees: 140000, baseRating: 3.7, basePlacement: 70 },
  { name: "Thapar Institute of Engineering", location: "Patiala", baseFees: 260000, baseRating: 4.3, basePlacement: 85 },
  { name: "PSG College of Technology", location: "Coimbatore", baseFees: 95000, baseRating: 4.2, basePlacement: 82 },
  { name: "College of Engineering Pune", location: "Pune", baseFees: 90000, baseRating: 4.1, basePlacement: 80 },
  { name: "Jadavpur University", location: "Kolkata", baseFees: 35000, baseRating: 4.4, basePlacement: 87 },
  { name: "Anna University", location: "Chennai", baseFees: 55000, baseRating: 4.1, basePlacement: 79 },
  { name: "Delhi Technological University", location: "Delhi", baseFees: 85000, baseRating: 4.2, basePlacement: 84 },
  { name: "Netaji Subhas University of Technology", location: "Delhi", baseFees: 80000, baseRating: 4.0, basePlacement: 79 },
  { name: "Institute of Chemical Technology", location: "Mumbai", baseFees: 75000, baseRating: 4.3, basePlacement: 86 },
  { name: "DAIICT Gandhinagar", location: "Gandhinagar", baseFees: 155000, baseRating: 4.2, basePlacement: 83 },
  { name: "PES University", location: "Bangalore", baseFees: 320000, baseRating: 4.0, basePlacement: 80 },
  { name: "RV College of Engineering", location: "Bangalore", baseFees: 150000, baseRating: 4.1, basePlacement: 81 },
  { name: "MS Ramaiah Institute of Technology", location: "Bangalore", baseFees: 145000, baseRating: 4.0, basePlacement: 79 },
  { name: "BMS College of Engineering", location: "Bangalore", baseFees: 140000, baseRating: 3.9, basePlacement: 77 },
  { name: "Symbiosis Institute of Technology", location: "Pune", baseFees: 290000, baseRating: 3.9, basePlacement: 76 },
  { name: "MIT World Peace University", location: "Pune", baseFees: 250000, baseRating: 3.8, basePlacement: 74 },
  { name: "Savitribai Phule Pune University", location: "Pune", baseFees: 45000, baseRating: 3.9, basePlacement: 75 },
  { name: "Coimbatore Institute of Technology", location: "Coimbatore", baseFees: 80000, baseRating: 3.9, basePlacement: 76 },
  { name: "Sri Sivasubramaniya Nadar College", location: "Chennai", baseFees: 120000, baseRating: 3.9, basePlacement: 77 },
  { name: "Kongu Engineering College", location: "Erode", baseFees: 75000, baseRating: 3.7, basePlacement: 72 },
  { name: "Sri Krishna College of Technology", location: "Coimbatore", baseFees: 72000, baseRating: 3.6, basePlacement: 70 },
  { name: "Rajagiri School of Engineering", location: "Kochi", baseFees: 130000, baseRating: 3.8, basePlacement: 74 },
  { name: "Model Engineering College", location: "Kochi", baseFees: 65000, baseRating: 3.9, basePlacement: 76 },
  { name: "Government Engineering College Thrissur", location: "Thrissur", baseFees: 30000, baseRating: 3.8, basePlacement: 73 },
  { name: "National Institute of Fashion Technology Delhi", location: "Delhi", baseFees: 170000, baseRating: 4.2, basePlacement: 85 },
  { name: "XLRI Jamshedpur", location: "Jamshedpur", baseFees: 380000, baseRating: 4.6, basePlacement: 95 },
  { name: "IIM Ahmedabad", location: "Ahmedabad", baseFees: 1100000, baseRating: 4.9, basePlacement: 100 },
  { name: "IIM Bangalore", location: "Bangalore", baseFees: 1050000, baseRating: 4.8, basePlacement: 100 },
  { name: "IIM Calcutta", location: "Kolkata", baseFees: 1000000, baseRating: 4.8, basePlacement: 99 },
  { name: "IIM Lucknow", location: "Lucknow", baseFees: 950000, baseRating: 4.6, basePlacement: 98 },
  { name: "IIM Indore", location: "Indore", baseFees: 900000, baseRating: 4.5, basePlacement: 97 },
  { name: "Indian School of Business", location: "Hyderabad", baseFees: 1200000, baseRating: 4.7, basePlacement: 99 },
  { name: "JNTU Hyderabad", location: "Hyderabad", baseFees: 65000, baseRating: 3.8, basePlacement: 72 },
  { name: "Osmania University", location: "Hyderabad", baseFees: 40000, baseRating: 3.7, basePlacement: 68 },
  { name: "University of Hyderabad", location: "Hyderabad", baseFees: 35000, baseRating: 4.0, basePlacement: 75 },
  { name: "IIIT Hyderabad", location: "Hyderabad", baseFees: 280000, baseRating: 4.6, basePlacement: 93 },
  { name: "IIIT Delhi", location: "Delhi", baseFees: 290000, baseRating: 4.5, basePlacement: 92 },
  { name: "IIIT Bangalore", location: "Bangalore", baseFees: 300000, baseRating: 4.4, basePlacement: 90 },
  { name: "Christ University", location: "Bangalore", baseFees: 160000, baseRating: 3.9, basePlacement: 76 },
  { name: "Jain University", location: "Bangalore", baseFees: 145000, baseRating: 3.7, basePlacement: 72 },
  { name: "Dayananda Sagar University", location: "Bangalore", baseFees: 135000, baseRating: 3.6, basePlacement: 70 },
  { name: "SRM University Amaravati", location: "Amaravati", baseFees: 155000, baseRating: 3.7, basePlacement: 71 },
  { name: "Shiv Nadar University", location: "Greater Noida", baseFees: 350000, baseRating: 4.1, basePlacement: 82 },
  { name: "Ashoka University", location: "Sonipat", baseFees: 800000, baseRating: 4.3, basePlacement: 80 },
  { name: "OP Jindal Global University", location: "Sonipat", baseFees: 600000, baseRating: 4.2, basePlacement: 82 },
  { name: "Chandigarh University", location: "Chandigarh", baseFees: 180000, baseRating: 3.9, basePlacement: 76 },
  { name: "Chitkara University", location: "Chandigarh", baseFees: 170000, baseRating: 3.8, basePlacement: 74 },
  { name: "UPES Dehradun", location: "Dehradun", baseFees: 220000, baseRating: 3.8, basePlacement: 74 },
  { name: "GD Goenka University", location: "Gurugram", baseFees: 250000, baseRating: 3.7, basePlacement: 71 },
  { name: "Bennett University", location: "Greater Noida", baseFees: 320000, baseRating: 3.8, basePlacement: 73 },
  { name: "KL University", location: "Vijayawada", baseFees: 140000, baseRating: 3.8, basePlacement: 75 },
  { name: "Vignan University", location: "Guntur", baseFees: 120000, baseRating: 3.6, basePlacement: 70 },
  { name: "Kalinga Institute of Industrial Technology", location: "Bhubaneswar", baseFees: 260000, baseRating: 4.0, basePlacement: 80 },
  { name: "SOA University", location: "Bhubaneswar", baseFees: 145000, baseRating: 3.8, basePlacement: 74 },
  { name: "SASTRA University", location: "Thanjavur", baseFees: 130000, baseRating: 4.0, basePlacement: 79 },
  { name: "Vel Tech University", location: "Chennai", baseFees: 110000, baseRating: 3.6, basePlacement: 68 },
  { name: "Karunya Institute of Technology", location: "Coimbatore", baseFees: 140000, baseRating: 3.7, basePlacement: 70 },
  { name: "Sathyabama Institute of Science", location: "Chennai", baseFees: 125000, baseRating: 3.6, basePlacement: 68 },
  { name: "Presidency University Bangalore", location: "Bangalore", baseFees: 180000, baseRating: 3.6, basePlacement: 68 },
  { name: "CMR University", location: "Bangalore", baseFees: 155000, baseRating: 3.5, basePlacement: 66 },
  { name: "REVA University", location: "Bangalore", baseFees: 145000, baseRating: 3.5, basePlacement: 65 },
  { name: "Graphic Era University", location: "Dehradun", baseFees: 175000, baseRating: 3.7, basePlacement: 70 },
  { name: "DIT University", location: "Dehradun", baseFees: 160000, baseRating: 3.6, basePlacement: 68 },
  { name: "Quantum University", location: "Roorkee", baseFees: 120000, baseRating: 3.5, basePlacement: 65 },
  { name: "Invertis University", location: "Bareilly", baseFees: 100000, baseRating: 3.4, basePlacement: 62 },
  { name: "Galgotias University", location: "Greater Noida", baseFees: 150000, baseRating: 3.6, basePlacement: 67 },
  { name: "Noida International University", location: "Greater Noida", baseFees: 130000, baseRating: 3.4, basePlacement: 63 },
  { name: "Sharda University", location: "Greater Noida", baseFees: 200000, baseRating: 3.7, basePlacement: 72 },
  { name: "Marwadi University", location: "Rajkot", baseFees: 140000, baseRating: 3.6, basePlacement: 68 },
  { name: "PDPU Gandhinagar", location: "Gandhinagar", baseFees: 180000, baseRating: 3.9, basePlacement: 76 },
  { name: "Nirma University", location: "Ahmedabad", baseFees: 195000, baseRating: 4.0, basePlacement: 79 },
];

const courseTemplates = [
  { name: "B.Tech Computer Science Engineering", duration: "4 Years", feesMultiplier: 1.0 },
  { name: "B.Tech Electronics & Communication Engineering", duration: "4 Years", feesMultiplier: 0.95 },
  { name: "B.Tech Electrical Engineering", duration: "4 Years", feesMultiplier: 0.9 },
  { name: "B.Tech Mechanical Engineering", duration: "4 Years", feesMultiplier: 0.88 },
  { name: "B.Tech Civil Engineering", duration: "4 Years", feesMultiplier: 0.85 },
  { name: "B.Tech Chemical Engineering", duration: "4 Years", feesMultiplier: 0.87 },
  { name: "M.Tech Computer Science", duration: "2 Years", feesMultiplier: 0.7 },
  { name: "M.Tech VLSI Design", duration: "2 Years", feesMultiplier: 0.72 },
  { name: "MBA", duration: "2 Years", feesMultiplier: 1.5 },
  { name: "MCA", duration: "3 Years", feesMultiplier: 0.65 },
  { name: "B.Sc Data Science", duration: "3 Years", feesMultiplier: 0.6 },
  { name: "B.Tech Artificial Intelligence", duration: "4 Years", feesMultiplier: 1.05 },
];

const reviewTemplates = [
  {
    reviewerName: "Rahul Sharma",
    comment: "Excellent faculty and infrastructure. The placement cell is very active and helped me secure a great job. The campus life is vibrant with many clubs and activities.",
  },
  {
    reviewerName: "Priya Patel",
    comment: "Great learning environment. The curriculum is industry-aligned and the professors are highly qualified. The campus facilities including labs are top-notch.",
  },
  {
    reviewerName: "Arjun Singh",
    comment: "Good overall experience. The college has strong industry connections which helped in internships and placements. Hostel facilities are decent.",
  },
  {
    reviewerName: "Sneha Iyer",
    comment: "The technical education quality here is outstanding. Faculty members are experienced and approachable. The research opportunities are excellent for interested students.",
  },
  {
    reviewerName: "Vikram Mehta",
    comment: "Satisfied with the college experience. The library and digital resources are comprehensive. Placement percentage is consistently high year over year.",
  },
  {
    reviewerName: "Ananya Krishnan",
    comment: "Very good college with strong alumni network. The industrial visits and guest lectures add practical value to the theoretical knowledge.",
  },
  {
    reviewerName: "Rohan Gupta",
    comment: "The college has excellent sports facilities and extracurricular activities. Academically strong with good research output from faculty.",
  },
  {
    reviewerName: "Divya Nair",
    comment: "One of the best colleges in the region. The placement season saw many top companies recruiting from campus. Faculty support is exceptional.",
  },
  {
    reviewerName: "Karan Agarwal",
    comment: "Great atmosphere for learning and growth. The college organizes excellent technical fests and hackathons that attract industry professionals.",
  },
  {
    reviewerName: "Meera Reddy",
    comment: "Highly recommend this college for engineering aspirants. The balance between academics and extra-curricular activities is perfect.",
  },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 1): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  const colleges = [];
  for (const collegeData of indianColleges) {
      const feesVariation = getRandomFloat(0.9, 1.1, 2);
      const actualFees = Math.round(collegeData.baseFees * feesVariation);
      const ratingVariation = getRandomFloat(-0.2, 0.1, 1);
      const actualRating = Math.min(5.0, Math.max(1.0, parseFloat((collegeData.baseRating + ratingVariation).toFixed(1))));
      const placementVariation = getRandomInt(-3, 3);
      const actualPlacement = Math.min(100, Math.max(50, collegeData.basePlacement + placementVariation));

      const avgPackage = Math.round(actualPlacement * 1200 + getRandomInt(300000, 800000));
      const highestPackage = Math.round(avgPackage * getRandomFloat(2.5, 5.0, 1));

      const numCourses = getRandomInt(3, 5);
      const selectedCourses = pickRandomN(courseTemplates, numCourses);

      const numReviews = 5;
      const selectedReviewers = pickRandomN(reviewTemplates, numReviews);

      const college = await prisma.college.create({
        data: {
          name: collegeData.name,
          location: collegeData.location,
          description: `${collegeData.name} is one of India's premier educational institutions located in ${collegeData.location}. With a rich history of academic excellence, it offers world-class education and research opportunities. The institution has produced numerous distinguished alumni who have made significant contributions across various sectors including technology, business, research, and public service. The campus is equipped with state-of-the-art facilities including modern laboratories, a comprehensive library, sports complexes, and comfortable hostels. Strong industry partnerships ensure excellent placement opportunities for graduating students.`,
          fees: actualFees,
          rating: actualRating,
          placementPercentage: actualPlacement,
          averagePackage: avgPackage,
          highestPackage: highestPackage,
          courses: {
            create: selectedCourses.map((course) => ({
              name: course.name,
              duration: course.duration,
              fees: Math.round(actualFees * course.feesMultiplier),
            })),
          },
          reviews: {
            create: selectedReviewers.map((review) => ({
              reviewerName: review.reviewerName,
              comment: review.comment,
              rating: getRandomFloat(actualRating - 0.5, Math.min(5, actualRating + 0.5), 1),
            })),
          },
        },
      });

      colleges.push(college);
      process.stdout.write(`\r   Seeding: ${colleges.length}/${indianColleges.length} colleges...`);
  }
  console.log();

  console.log(`✅ Created ${colleges.length} colleges with courses and reviews`);

  await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "demo@collegecompass.in",
      password: await bcrypt.hash("Demo@1234", 12),
    },
  });
  console.log("✅ Created demo user (email: demo@collegecompass.in, password: Demo@1234)");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
