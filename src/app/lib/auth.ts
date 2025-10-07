import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { PrismaClient } from '@/generated/prisma';
import { ac, universityRoles } from '@/lib/permissions';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.META_CLIENT_ID as string,
      clientSecret: process.env.META_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ['https://appleid.apple.com'],
  appName: process.env.NEXT_PUBLIC_COMPANY_NAME,
  telemetry: {
    enabled: false,
  },
  plugins: [
    organization({
      // Map organization plugin concepts to university terminology
      schema: {
        organization: {
          modelName: 'universities',
          fields: {
            name: 'name',
            slug: 'code',
          },
          additionalFields: {
            faculty: {
              type: 'string',
              required: true,
            },
            department: {
              type: 'string',
              required: true,
            },
            programme: {
              type: 'string',
              required: true,
            },
            degreeType: {
              type: 'string',
              required: true,
            },
            studyYear: {
              type: 'number',
              required: false,
            },
            intakeSeason: {
              type: 'string',
              required: false,
            },
            accreditation: {
              type: 'string',
              required: false,
            },
          },
        },
        team: {
          modelName: 'course_groups',
          fields: {
            name: 'name',
          },
          additionalFields: {
            courseCode: {
              type: 'string',
              required: true,
            },
            courseTitle: {
              type: 'string',
              required: true,
            },
            creditHours: {
              type: 'number',
              required: true,
            },
            semester: {
              type: 'string',
              required: true,
            },
            lecturerId: {
              type: 'string',
              required: false,
            },
            labSection: {
              type: 'string',
              required: false,
            },
          },
        },
        member: {
          modelName: 'users',
          fields: {
            role: 'role',
          },
          additionalFields: {
            fullName: {
              type: 'string',
              required: true,
            },
            universityId: {
              type: 'string',
              required: false,
              unique: true,
            },
            nationalId: {
              type: 'string',
              required: false,
            },
            admissionYear: {
              type: 'number',
              required: false,
            },
            currentSemester: {
              type: 'number',
              required: false,
            },
            cgpa: {
              type: 'number',
              required: false,
            },
            employeeNo: {
              type: 'string',
              required: false,
            },
            academicRank: {
              type: 'string',
              required: false,
            },
          },
        },
        invitation: {
          modelName: 'admission_offers',
          additionalFields: {
            intendedRole: {
              type: 'string',
              required: true,
            },
            programme: {
              type: 'string',
              required: true,
            },
            admissionType: {
              type: 'string',
              required: false,
            },
          },
        },
      },
      // University-specific roles and permissions
      ac,
      roles: universityRoles,
      // Enable teams for course groups
      teams: {
        enabled: true,
        maximumTeams: 500,
      },
      // Configure limits and permissions
      membershipLimit: 10_000,
      allowUserToCreateOrganization: false, // Only registrar+ can create universities
      creatorRole: 'registrar',
      // Email configuration for admission offers
      async sendInvitationEmail(data) {
        // TODO: Implement email sending for admission offers
        console.log('Sending admission offer email:', {
          email: data.email,
          university: data.organization.name,
          invitationId: data.id,
        });
      },
      // Organization hooks for university-specific logic
      organizationHooks: {
        beforeCreateOrganization: async ({ organization, user }) => {
          // Only registrars and above can create universities
          const userRole = user.role;
          if (!['registrar', 'dean', 'superAdmin'].includes(userRole)) {
            throw new Error(
              'Only registrars and above can create universities',
            );
          }

          return {
            data: {
              ...organization,
              // Ensure required university fields are present
              faculty: organization.faculty || 'General',
              department: organization.department || 'General Studies',
              programme: organization.programme || 'General Programme',
              degreeType: organization.degreeType || 'bachelor',
            },
          };
        },
        afterCreateOrganization: async ({ organization }) => {
          console.log(
            `University created: ${organization.name} (${organization.code})`,
          );
        },
      },
    }),
  ],
});
