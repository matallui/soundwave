import { prisma } from "../src/server/db";

const SCORES = [
  {
    school: "School of Rock",
    teacher: "Mr. Brown",
    grade: "1st",
    score: 10.1,
  },
  {
    school: "School of Rock",
    teacher: "Mr. Brown",
    grade: "2nd",
    score: 11.2,
  },
  {
    school: "School of Rock",
    teacher: "Ms. Smith",
    grade: "2nd",
    score: 10.9,
  },
  {
    school: "School of Rock",
    teacher: "Ms. Smith",
    grade: "4th",
    score: 11.5,
  },
  {
    school: "School of Rock",
    teacher: "Ms. Smith",
    grade: "3rd",
    score: 11.6,
  },
  {
    school: "School of Jazz",
    teacher: "Mr. Davis",
    grade: "3rd",
    score: 10.2,
  },
  {
    school: "School of Jazz",
    teacher: "Ms. Williams",
    grade: "5th",
    score: 10.0,
  },
  {
    school: "School of Jazz",
    teacher: "Ms. Willians",
    grade: "1st",
    score: 12.0,
  },
  {
    school: "School of Jazz",
    teacher: "Mr. Davis",
    grade: "4th",
    score: 11.3,
  },
  {
    school: "School of Jazz",
    teacher: "Ms. Williams",
    grade: "2nd",
    score: 12.1,
  },
];

async function main() {
  for (const score of SCORES) {
    await prisma.score.upsert({
      where: {
        school_teacher_grade: {
          school: score.school,
          teacher: score.teacher,
          grade: score.grade,
        },
      },
      update: {},
      create: {
        school: score.school,
        teacher: score.teacher,
        grade: score.grade,
        score: score.score,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
