#!/usr/bin/env node

import { generateId } from 'better-auth';
import { hashPassword } from 'better-auth/crypto';
import { Command } from 'commander';
import * as readlineSync from 'readline-sync';
import { PrismaClient } from '@/generated/prisma';
import { universityRoles } from '@/lib/permissions';

const prisma = new PrismaClient();
const program = new Command();

const ROLES = Object.keys(universityRoles);

interface UserData {
  email: string;
  fullName: string;
  password: string;
  role: string;
  universityId?: string;
  admissionYear?: number;
  employeeNo?: string;
  academicRank?: string;
  currentSemester?: number;
  cgpa?: number;
}

program
  .name('user-cli')
  .description('University Management System - User CLI')
  .version('1.0.0');

// Create super admin command
program
  .command('create-superadmin')
  .description('Create a super admin user')
  .option('-e, --email <email>', 'Admin email')
  .option('-n, --name <name>', 'Admin full name')
  .option('-p, --password <password>', 'Admin password')
  .action(async (options) => {
    console.log('👑 Create Super Admin\n');

    let { email, name: fullName, password } = options;

    // Get missing info interactively
    if (!email) {
      email = readlineSync.questionEMail('Admin Email: ');
    }
    if (!fullName) {
      fullName = readlineSync.question('Admin Full Name: ');
    }
    if (!password) {
      password = readlineSync.question('Admin Password: ', {
        hideEchoBack: true,
      });
      const confirmPassword = readlineSync.question('Confirm Password: ', {
        hideEchoBack: true,
      });
      if (password !== confirmPassword) {
        console.error('❌ Passwords do not match!');
        return;
      }
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters long!');
      return;
    }

    const userData = {
      email,
      fullName,
      password,
      role: 'superAdmin',
    };

    await createUser(userData);
  });

// Create user command
program
  .command('create-user')
  .description('Create a new user with specified role')
  .requiredOption('-e, --email <email>', 'User email')
  .requiredOption('-n, --name <name>', 'User full name')
  .requiredOption('-r, --role <role>', `User role (${ROLES.join(', ')})`)
  .option(
    '-p, --password <password>',
    'User password (will prompt if not provided)',
  )
  .option('--university-id <id>', 'University ID (for students/parents)')
  .option('--employee-no <no>', 'Employee number (for staff)')
  .option('--academic-rank <rank>', 'Academic rank (for faculty)')
  .option('--admission-year <year>', 'Admission year (for students)', '2024')
  .option(
    '--current-semester <semester>',
    'Current semester (for students)',
    '1',
  )
  .option('--cgpa <cgpa>', 'CGPA (for students)', '0.0')
  .action(async (options) => {
    const { email, name: fullName, role, ...additionalFields } = options;

    if (!ROLES.includes(role)) {
      console.error(`❌ Invalid role. Available roles: ${ROLES.join(', ')}`);
      return;
    }

    let password = options.password;
    if (!password) {
      password = readlineSync.question('Password: ', { hideEchoBack: true });
      const confirmPassword = readlineSync.question('Confirm Password: ', {
        hideEchoBack: true,
      });
      if (password !== confirmPassword) {
        console.error('❌ Passwords do not match!');
        return;
      }
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters long!');
      return;
    }

    const userData = {
      email,
      fullName,
      password,
      role,
      ...additionalFields,
    };

    // Convert numeric fields
    if (userData.admissionYear) {
      userData.admissionYear = parseInt(userData.admissionYear);
    }
    if (userData.currentSemester) {
      userData.currentSemester = parseInt(userData.currentSemester);
    }
    if (userData.cgpa) {
      userData.cgpa = Math.round(parseFloat(userData.cgpa) * 100); // Store as integer
    }

    await createUser(userData);
  });

// Interactive user creation
program
  .command('interactive')
  .alias('i')
  .description('Interactive user creation with prompts')
  .action(async () => {
    await interactiveUserCreation();
  });

// List users command
program
  .command('list')
  .description('List all users in the system')
  .option('-v, --verbose', 'Show detailed information')
  .action(async (options) => {
    await listUsers(options.verbose);
  });

// Show available roles
program
  .command('roles')
  .description('List all available user roles')
  .action(() => {
    console.log('\n🎭 Available Roles:\n');
    ROLES.forEach((role, index) => {
      console.log(`${index + 1}. ${role}`);
    });
    console.log('');
  });

async function createUser(userData: UserData) {
  try {
    console.log('\n🔄 Creating user...');

    const hashedPassword = await hashPassword(userData.password);

    const result = await prisma.$transaction(async (tx) => {
      const userId = generateId();

      const user = await tx.user.create({
        data: {
          id: userId,
          email: userData.email,
          name: userData.fullName,
          emailVerified: true,
        },
      });

      await tx.account.create({
        data: {
          id: generateId(),
          userId: user.id,
          providerId: 'credential',
          accountId: user.id,
          password: hashedPassword,
        },
      });

      console.log(`✅ User created successfully!`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   User ID: ${user.id}`);

      return user;
    });

    return result;
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('❌ Error: A user with this email already exists.');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
    return null;
  }
}

async function interactiveUserCreation() {
  console.log('\n📝 Interactive User Creation\n');

  const email = readlineSync.questionEMail('Email: ');
  const fullName = readlineSync.question('Full Name: ');
  const password = readlineSync.question('Password: ', { hideEchoBack: true });
  const confirmPassword = readlineSync.question('Confirm Password: ', {
    hideEchoBack: true,
  });

  if (password !== confirmPassword) {
    console.error('❌ Passwords do not match!');
    return;
  }

  console.log('\n🎭 Available Roles:');
  ROLES.forEach((role, index) => {
    console.log(`${index + 1}. ${role}`);
  });

  const roleIndex = readlineSync.keyInSelect(ROLES, 'Select role:', {
    cancel: false,
  });
  const role = ROLES[roleIndex];

  const userData: UserData = { email, fullName, password, role };

  // Get role-specific fields
  if (['student', 'parent'].includes(role)) {
    const universityId = readlineSync.question('University ID (optional): ', {
      defaultInput: '',
    });
    if (universityId) userData.universityId = universityId;

    const admissionYear = readlineSync.questionInt(
      'Admission Year (optional): ',
      {
        limit: [2020, 2030],
        defaultInput: new Date().getFullYear().toString(),
      },
    );
    userData.admissionYear = admissionYear;
  }

  if (['professor', 'ta', 'registrar', 'dean', 'hod'].includes(role)) {
    const employeeNo = readlineSync.question('Employee Number (optional): ', {
      defaultInput: '',
    });
    if (employeeNo) userData.employeeNo = employeeNo;

    const academicRank = readlineSync.question('Academic Rank (optional): ', {
      defaultInput: '',
    });
    if (academicRank) userData.academicRank = academicRank;
  }

  if (role === 'student') {
    const currentSemester = readlineSync.questionInt(
      'Current Semester (optional): ',
      {
        limit: [1, 12],
        defaultInput: '1',
      },
    );
    userData.currentSemester = currentSemester;

    const cgpa = readlineSync.questionFloat('CGPA (optional): ', {
      limit: [0.0, 4.0],
      defaultInput: '0.0',
    });
    userData.cgpa = Math.round(cgpa * 100);
  }

  await createUser(userData);
}

async function listUsers(verbose = false) {
  try {
    console.log('\n👥 All Users\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('No users found.');
      return;
    }

    console.log(`Found ${users.length} user(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   ✅ Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      if (verbose) {
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
        console.log(`   🔐 Accounts: ${user._count.accounts}`);
      }
      console.log('');
    });
  } catch (error: any) {
    console.error('❌ Error fetching users:', error.message);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message);
  prisma.$disconnect();
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Close database connection when done
prisma.$disconnect();
