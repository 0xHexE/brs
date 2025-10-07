#!/usr/bin/env node

import { hashPassword } from 'better-auth/crypto';
import { Command } from 'commander';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();
const program = new Command();

program
  .name('demo-data')
  .description('Seed demo data for University Management System')
  .version('1.0.0');

program
  .command('seed')
  .description('Seed all demo data (users, universities, courses, etc.)')
  .option('--force', 'Clear existing data before seeding', false)
  .action(async (options) => {
    await seedDemoData(options.force);
  });

program
  .command('clear')
  .description('Clear all demo data')
  .option('--confirm', 'Skip confirmation prompt', false)
  .action(async (options) => {
    await clearDemoData(options.confirm);
  });

async function clearDemoData(confirmed = false) {
  if (!confirmed) {
    const readlineSync = await import('readline-sync');
    const confirm = readlineSync.default.keyInYNStrict(
      '⚠️  This will delete ALL demo data. Are you sure?',
    );
    if (!confirm) {
      console.log('❌ Cancelled.');
      return;
    }
  }

  console.log('🗑️  Clearing demo data...');

  try {
    // Delete in order of dependencies
    await prisma.teamMember.deleteMany();
    await prisma.admission_offers.deleteMany();
    await prisma.course_groups.deleteMany();
    await prisma.users.deleteMany();
    await prisma.universities.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Demo data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', (error as Error).message);
  }
}

async function seedDemoData(force = false) {
  if (force) {
    await clearDemoData(true);
  }

  console.log('🌱 Seeding demo data...');

  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0 && !force) {
      console.log(
        '⚠️  Demo data already exists. Use --force to clear and reseed.',
      );
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      console.log('📝 Creating users...');

      // Create users
      const users = await Promise.all([
        tx.user.create({
          data: {
            id: 'usr_super',
            email: 'super@nut.edu',
            name: 'Super Admin',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_reg',
            email: 'registrar@nut.edu',
            name: 'Registrar Wilson',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_dean',
            email: 'dean@nut.edu',
            name: 'Dean Wilson',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_hod',
            email: 'hod@nut.edu',
            name: 'HOD Smith',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_prof',
            email: 'prof@nut.edu',
            name: 'Prof. Johnson',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_ta',
            email: 'ta@nut.edu',
            name: 'TA Lee',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_stud1',
            email: 'student1@nut.edu',
            name: 'Alice Brown',
            emailVerified: true,
          },
        }),
        tx.user.create({
          data: {
            id: 'usr_stud2',
            email: 'student2@nut.edu',
            name: 'Bob Green',
            emailVerified: true,
          },
        }),
      ]);

      console.log('🔐 Creating accounts...');
      // Create accounts with properly hashed passwords
      const demoPassword = 'Demo@123';
      const hashedPassword = await hashPassword(demoPassword);

      await Promise.all([
        tx.account.create({
          data: {
            id: 'acc_super',
            userId: 'usr_super',
            providerId: 'credential',
            accountId: 'usr_super',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_reg',
            userId: 'usr_reg',
            providerId: 'credential',
            accountId: 'usr_reg',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_dean',
            userId: 'usr_dean',
            providerId: 'credential',
            accountId: 'usr_dean',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_hod',
            userId: 'usr_hod',
            providerId: 'credential',
            accountId: 'usr_hod',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_prof',
            userId: 'usr_prof',
            providerId: 'credential',
            accountId: 'usr_prof',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_ta',
            userId: 'usr_ta',
            providerId: 'credential',
            accountId: 'usr_ta',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_stud1',
            userId: 'usr_stud1',
            providerId: 'credential',
            accountId: 'usr_stud1',
            password: hashedPassword,
          },
        }),
        tx.account.create({
          data: {
            id: 'acc_stud2',
            userId: 'usr_stud2',
            providerId: 'credential',
            accountId: 'usr_stud2',
            password: hashedPassword,
          },
        }),
      ]);

      console.log('🎓 Creating university...');
      // Create university
      const university = await tx.universities.create({
        data: {
          id: 'uni_abc123',
          name: 'National University of Technology',
          code: 'NUT',
          faculty: 'Engineering',
          department: 'Computer Science',
          programme: 'BSc Computer Science',
          degreeType: 'bachelor',
          studyYear: 3,
          intakeSeason: 'Fall2025',
          createdAt: new Date(),
        },
      });

      console.log('👥 Creating user-university relationships...');
      // Create user-university relationships with roles
      await Promise.all([
        tx.users.create({
          data: {
            id: 'u_rel_super',
            organizationId: university.id,
            userId: 'usr_super',
            role: 'superAdmin',
            fullName: 'Super Admin',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_reg',
            organizationId: university.id,
            userId: 'usr_reg',
            role: 'registrar',
            fullName: 'Registrar Wilson',
            employeeNo: 'REG001',
            academicRank: 'Registrar',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_dean',
            organizationId: university.id,
            userId: 'usr_dean',
            role: 'dean',
            fullName: 'Dean Wilson',
            employeeNo: 'DEAN001',
            academicRank: 'Dean',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_hod',
            organizationId: university.id,
            userId: 'usr_hod',
            role: 'hod',
            fullName: 'HOD Smith',
            employeeNo: 'HOD001',
            academicRank: 'Associate Professor',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_prof',
            organizationId: university.id,
            userId: 'usr_prof',
            role: 'professor',
            fullName: 'Prof. Johnson',
            employeeNo: 'PROF001',
            academicRank: 'Professor',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_ta',
            organizationId: university.id,
            userId: 'usr_ta',
            role: 'ta',
            fullName: 'TA Lee',
            employeeNo: 'TA001',
            academicRank: 'Teaching Assistant',
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_stud1',
            organizationId: university.id,
            userId: 'usr_stud1',
            role: 'student',
            fullName: 'Alice Brown',
            universityId: 'STU001',
            admissionYear: 2023,
            currentSemester: 2,
            cgpa: 350, // 3.5 * 100
            createdAt: new Date(),
          },
        }),
        tx.users.create({
          data: {
            id: 'u_rel_stud2',
            organizationId: university.id,
            userId: 'usr_stud2',
            role: 'student',
            fullName: 'Bob Green',
            universityId: 'STU002',
            admissionYear: 2023,
            currentSemester: 1,
            cgpa: 380, // 3.8 * 100
            createdAt: new Date(),
          },
        }),
      ]);

      console.log('📚 Creating course groups...');
      // Create course groups
      const courseGroups = await Promise.all([
        tx.course_groups.create({
          data: {
            id: 'grp_cs401',
            name: 'CS401-Algorithms-A',
            organizationId: university.id,
            courseCode: 'CS401',
            courseTitle: 'Design & Analysis of Algorithms',
            creditHours: 3,
            semester: 'Spring2026',
            lecturerId: 'usr_prof',
            createdAt: new Date(),
          },
        }),
        tx.course_groups.create({
          data: {
            id: 'grp_cs402',
            name: 'CS402-Databases-B',
            organizationId: university.id,
            courseCode: 'CS402',
            courseTitle: 'Database Systems',
            creditHours: 3,
            semester: 'Spring2026',
            lecturerId: 'usr_hod',
            createdAt: new Date(),
          },
        }),
      ]);

      console.log('🎓 Creating class enrollments...');
      // Create class enrollments
      await Promise.all([
        tx.teamMember.create({
          data: {
            id: 'enr1',
            teamId: 'grp_cs401',
            userId: 'usr_stud1',
            createdAt: new Date(),
          },
        }),
        tx.teamMember.create({
          data: {
            id: 'enr2',
            teamId: 'grp_cs401',
            userId: 'usr_stud2',
            createdAt: new Date(),
          },
        }),
        tx.teamMember.create({
          data: {
            id: 'enr3',
            teamId: 'grp_cs402',
            userId: 'usr_stud1',
            createdAt: new Date(),
          },
        }),
      ]);

      console.log('📧 Creating admission offers...');
      // Create admission offers
      await Promise.all([
        tx.admission_offers.create({
          data: {
            id: 'inv1',
            organizationId: university.id,
            email: 'student1@nut.edu',
            role: 'student',
            intendedRole: 'student',
            programme: 'BSc Computer Science',
            admissionType: 'regular',
            inviterId: 'usr_reg',
            status: 'accepted',
            expiresAt: new Date('2025-12-31'),
          },
        }),
        tx.admission_offers.create({
          data: {
            id: 'inv2',
            organizationId: university.id,
            email: 'student2@nut.edu',
            role: 'student',
            intendedRole: 'student',
            programme: 'BSc Computer Science',
            admissionType: 'regular',
            inviterId: 'usr_reg',
            status: 'accepted',
            expiresAt: new Date('2025-12-31'),
          },
        }),
      ]);

      console.log('🔐 Creating sessions...');
      // Create sessions with active organization and team
      await Promise.all([
        tx.session.create({
          data: {
            id: 'sess_super',
            userId: 'usr_super',
            activeOrganizationId: university.id,
            activeTeamId: 'grp_cs401',
            token: 'demo_token_super',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            createdAt: new Date(),
          },
        }),
        tx.session.create({
          data: {
            id: 'sess_reg',
            userId: 'usr_reg',
            activeOrganizationId: university.id,
            activeTeamId: 'grp_cs401',
            token: 'demo_token_reg',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        }),
        tx.session.create({
          data: {
            id: 'sess_prof',
            userId: 'usr_prof',
            activeOrganizationId: university.id,
            activeTeamId: 'grp_cs401',
            token: 'demo_token_prof',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        }),
        tx.session.create({
          data: {
            id: 'sess_stud1',
            userId: 'usr_stud1',
            activeOrganizationId: university.id,
            activeTeamId: 'grp_cs401',
            token: 'demo_token_stud1',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        }),
      ]);

      return { users, university, courseGroups };
    });

    console.log('\n✅ Demo data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${result.users.length}`);
    console.log(`   🎓 University: ${result.university.name}`);
    console.log(`   📚 Course Groups: ${result.courseGroups.length}`);
    console.log(`   🔐 Sessions: 4 (active users)`);

    console.log('\n🔑 Login Credentials:');
    console.log('   All passwords: Demo@123');
    console.log('\n📧 Test Users:');
    result.users.forEach((user) => {
      console.log(`   - ${user.name}: ${user.email}`);
    });
  } catch (error) {
    console.error('❌ Error seeding demo data:', (error as Error).message);
    console.error((error as Error).stack);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  prisma.$disconnect();
  process.exit(0);
});

// Parse command line arguments
program.parse();

// Close database connection when done
prisma.$disconnect();
