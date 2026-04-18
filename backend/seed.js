/**
 * seed.js — called once by server.js after DB connects.
 * Creates a pre-authenticated user "John Doe" with realistic Cal.com data.
 * Includes rich sample data: event types, availability, bookings, and workflows.
 */
const bcrypt        = require('bcryptjs');
const User          = require('./models/User');
const EventType     = require('./models/EventType');
const Availability  = require('./models/Availability');
const Booking       = require('./models/Booking');
const Team          = require('./models/Team');
const Workflow      = require('./models/Workflow');

const JOHN_EMAIL    = 'john@cal.com';
const JOHN_USERNAME = 'john';

async function seed() {
  try {
    console.log('   Starting seed script...');
  // ── 1. User ────────────────────────────────────────────────────────────────
  let john = await User.findOne({ email: JOHN_EMAIL });
  if (!john) {
    const hashedPw = await bcrypt.hash('password123', 10);
    john = await User.create({
      name:                'John Doe',
      username:            JOHN_USERNAME,
      email:               JOHN_EMAIL,
      password:            hashedPw,
      avatar:              '',
      bio:                 'Scheduling expert at Cal.com. I love helping teams book meetings efficiently.',
      timezone:            'Asia/Kolkata',
      locale:              'en',
      timeFormat:          12,
      weekStart:           'Sunday',
      theme:               'dark',
      brandColor:          '#0ea5e9',
      darkBrandColor:      '#0ea5e9',
      plan:                'PRO',
      completedOnboarding: true,
    });
    console.log('✅ Seed: Created user John Doe');
  }

  // ── 2. Default Availability ────────────────────────────────────────────────
  let avail = await Availability.findOne({ userId: john._id, isDefault: true });
  if (!avail) {
    // Calculate upcoming dates for overrides
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 864e5);
    const twoWeeks = new Date(today.getTime() + 14 * 864e5);
    const threeWeeks = new Date(today.getTime() + 21 * 864e5);
    const fmtDate = d => d.toISOString().split('T')[0];

    avail = await Availability.create({
      userId:    john._id,
      name:      'Working Hours',
      isDefault: true,
      timezone:  'Asia/Kolkata',
      days: [
        { day: 'Sunday',    enabled: false, startTime: '09:00', endTime: '17:00' },
        { day: 'Monday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday',   enabled: true,  startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', enabled: true,  startTime: '09:00', endTime: '17:00' },
        { day: 'Thursday',  enabled: true,  startTime: '09:00', endTime: '17:00' },
        { day: 'Friday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
        { day: 'Saturday',  enabled: false, startTime: '09:00', endTime: '17:00' },
      ],
      overrides: [
        { date: fmtDate(nextWeek),   isOff: true,  startTime: '09:00', endTime: '17:00' },  // Day off
        { date: fmtDate(twoWeeks),   isOff: false, startTime: '10:00', endTime: '14:00' },  // Short day
        { date: fmtDate(threeWeeks), isOff: false, startTime: '08:00', endTime: '20:00' },  // Extended hours
      ],
    });
    await User.findByIdAndUpdate(john._id, { defaultScheduleId: avail._id });
    console.log('✅ Seed: Created default availability (Working Hours) with date overrides');
  }

  // ── 2b. Additional Availability Schedule ───────────────────────────────────
  const extraAvail = await Availability.findOne({ userId: john._id, name: 'Evening & Weekends' });
  if (!extraAvail) {
    await Availability.create({
      userId:    john._id,
      name:      'Evening & Weekends',
      isDefault: false,
      timezone:  'Asia/Kolkata',
      days: [
        { day: 'Sunday',    enabled: true,  startTime: '10:00', endTime: '14:00' },
        { day: 'Monday',    enabled: true,  startTime: '18:00', endTime: '21:00' },
        { day: 'Tuesday',   enabled: true,  startTime: '18:00', endTime: '21:00' },
        { day: 'Wednesday', enabled: false, startTime: '18:00', endTime: '21:00' },
        { day: 'Thursday',  enabled: true,  startTime: '18:00', endTime: '21:00' },
        { day: 'Friday',    enabled: true,  startTime: '18:00', endTime: '21:00' },
        { day: 'Saturday',  enabled: true,  startTime: '10:00', endTime: '16:00' },
      ],
    });
    console.log('✅ Seed: Created "Evening & Weekends" schedule');
  }

  // ── 3. Event Types ─────────────────────────────────────────────────────────
  const existingET = await EventType.countDocuments({ userId: john._id });
  if (existingET === 0) {
    await EventType.insertMany([
      {
        userId:      john._id,
        title:       '15 Min Meeting',
        slug:        '15min',
        description: 'A quick 15-minute introductory call to discuss your needs and see how I can help.',
        length:      15,
        location:    'Google Meet',
        locationType:'integrations:google:meet',
        hidden:      false,
        minimumBookingNotice: 60,
        beforeEventBuffer: 0,
        afterEventBuffer:  0,
      },
      {
        userId:      john._id,
        title:       '30 Min Meeting',
        slug:        '30min',
        description: 'A standard 30-minute meeting for in-depth discussions, demos, or consultations.',
        length:      30,
        location:    'Google Meet',
        locationType:'integrations:google:meet',
        hidden:      false,
        minimumBookingNotice: 120,
        beforeEventBuffer: 5,
        afterEventBuffer:  5,
      },
      {
        userId:      john._id,
        title:       '60 Min Consultation',
        slug:        '60min',
        description: 'A comprehensive 1-hour deep-dive session for strategic planning and detailed reviews.',
        length:      60,
        location:    'Zoom',
        locationType:'integrations:zoom',
        hidden:      false,
        minimumBookingNotice: 240,
        beforeEventBuffer: 10,
        afterEventBuffer:  10,
        customInputs: [
          {
            type: 'textLong',
            label: 'What topics would you like to cover?',
            required: true,
            placeholder: 'Please share your agenda items...',
          },
          {
            type: 'select',
            label: 'How did you hear about me?',
            required: false,
            placeholder: 'Select an option',
            options: ['Google Search', 'Social Media', 'Referral', 'Blog Post', 'Other'],
          }
        ],
      },
      {
        userId:      john._id,
        title:       'Pair Programming',
        slug:        'pair-programming',
        description: 'A collaborative coding session. Share your screen and we will work through problems together.',
        length:      45,
        location:    'Google Meet',
        locationType:'integrations:google:meet',
        hidden:      false,
        minimumBookingNotice: 180,
        beforeEventBuffer: 5,
        afterEventBuffer:  5,
        customInputs: [
          {
            type: 'text',
            label: 'GitHub repo link (optional)',
            required: false,
            placeholder: 'https://github.com/...',
          }
        ],
      },
      {
        userId:      john._id,
        title:       'Team Standup',
        slug:        'standup',
        description: 'Daily standup for team sync. Quick round of updates.',
        length:      15,
        location:    'Google Meet',
        locationType:'integrations:google:meet',
        hidden:      false,
        requiresConfirmation: true,
        minimumBookingNotice: 30,
      },
      {
        userId:      john._id,
        title:       'Secret Beta Session',
        slug:        'secret',
        description: 'Private hidden event type for beta testers only.',
        length:      45,
        location:    'Google Meet',
        locationType:'integrations:google:meet',
        hidden:      true,
        minimumBookingNotice: 60,
      },
    ]);
    console.log('✅ Seed: Created 6 event types');
  }

  // ── 4. Sample Bookings ─────────────────────────────────────────────────────
  // We check for a specific sample booking to see if we need to refresh the samples
  const sampleExists = await Booking.findOne({ hostUserId: john._id, attendeeEmail: 'clark@dailyplanet.com' });
  
  if (!sampleExists) {
    console.log('🌱 Seed: Sample bookings missing or incomplete. Refreshing...');
    
    // Find ANY event types for John to use as templates
    const allET = await EventType.find({ userId: john._id });
    if (allET.length > 0) {
      const et15 = allET.find(e => e.slug === '15min') || allET[0];
      const et30 = allET.find(e => e.slug === '30min') || allET[Math.min(1, allET.length - 1)];
      const et60 = allET.find(e => e.slug === '60min') || allET[Math.min(2, allET.length - 1)];
      const etPP = allET.find(e => e.slug === 'pair-programming') || allET[0];
      const now = new Date();
      const addDays  = (d, n) => new Date(d.getTime() + n * 864e5);
      const addHours = (d, h) => new Date(d.getTime() + h * 36e5);

      // Helper to create a booking at a specific hour on a relative day
      const makeBooking = (et, name, email, tz, dayOffset, hour, status, extra = {}) => {
        const start = new Date(addDays(now, dayOffset));
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start.getTime() + et.length * 60000);
        return {
          eventTypeId:      et._id,
          hostUserId:       john._id,
          attendeeName:     name,
          attendeeEmail:    email,
          attendeeTimezone: tz,
          startTime:        start,
          endTime:          end,
          title:            `${name} <> John Doe`,
          status,
          location:         et.location || 'Google Meet',
          metadata:         { isSample: true, ...extra.metadata },
          ...extra,
        };
      };

      const bookings = [
        // ── Upcoming Bookings ────────────────────────────
        makeBooking(et30, 'Alice Johnson', 'alice@example.com', 'America/New_York', 1, 10, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/abc-defg-hij',
          notes: 'Want to discuss the Q2 roadmap and timeline.',
        }),
        makeBooking(et15, 'Bob Smith', 'bob@example.com', 'Europe/London', 1, 14, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
        }),
        makeBooking(et60 || et30, 'Charlie Wilson', 'charlie@startup.io', 'America/Los_Angeles', 2, 9, 'ACCEPTED', {
          meetingUrl: 'https://zoom.us/j/1234567890',
          notes: 'Deep dive into architecture patterns for our new microservices platform.',
        }),
        makeBooking(et30, 'Diana Ross', 'diana@enterprise.com', 'Europe/Berlin', 2, 15, 'PENDING', {
          notes: 'Exploring Cal.com for enterprise deployment.',
        }),
        makeBooking(et15, 'Ethan Hunt', 'ethan@agency.co', 'Asia/Tokyo', 3, 11, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/mnp-qrst-uvw',
        }),
        makeBooking(etPP || et30, 'Fiona Davies', 'fiona@devshop.com', 'Australia/Sydney', 4, 10, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/fgh-ijkl-mno',
          notes: 'Pair programming session on React component architecture.',
        }),
        makeBooking(et30, 'Grace Kim', 'grace@design.co', 'Asia/Seoul', 5, 14, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/pqr-stuv-wxy',
        }),
        makeBooking(et15, 'Henry Chen', 'henry@tech.com', 'America/Chicago', 7, 9, 'PENDING', {
          notes: 'Quick intro call about integration possibilities.',
        }),

        // ── Past Bookings ────────────────────────────────
        makeBooking(et30, 'Ivy Martinez', 'ivy@company.org', 'America/New_York', -1, 10, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/aaa-bbbb-ccc',
          notes: 'Reviewed Q1 performance metrics.',
        }),
        makeBooking(et15, 'Jake Thompson', 'jake@freelance.dev', 'Europe/London', -2, 15, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/ddd-eeee-fff',
        }),
        makeBooking(et60 || et30, 'Karen Lee', 'karen@bigcorp.com', 'Asia/Singapore', -3, 9, 'ACCEPTED', {
          meetingUrl: 'https://zoom.us/j/9876543210',
          notes: 'Discussed enterprise licensing and SSO integration.',
        }),
        makeBooking(et30, 'Leo Brown', 'leo@example.com', 'UTC', -5, 11, 'CANCELLED', {
          cancellationReason: 'Scheduling conflict — rescheduled for next week.',
        }),
        makeBooking(et15, 'Maya Patel', 'maya@startup.co', 'Asia/Kolkata', -7, 14, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/ggg-hhhh-iii',
        }),
        makeBooking(et30, 'Nathan Wright', 'nathan@agency.io', 'America/Los_Angeles', -10, 16, 'CANCELLED', {
          cancellationReason: 'Client postponed the project kickoff.',
        }),
        makeBooking(et15, 'Olivia Green', 'olivia@design.studio', 'Europe/Paris', -14, 10, 'ACCEPTED', {
          meetingUrl: 'https://meet.google.com/jjj-kkkk-lll',
        }),
        makeBooking(et60 || et30, 'Sam Wilson', 'sam@marvel.com', 'America/New_York', 1, 15, 'ACCEPTED', {
          notes: 'Discussing shield maintenance and flight schedules.',
        }),
        makeBooking(et30, 'Peter Parker', 'peter@dailybugle.com', 'America/New_York', 2, 11, 'PENDING', {
          notes: 'Need career advice on photography and science.',
        }),
        makeBooking(et15, 'Bruce Wayne', 'bruce@waynecorp.com', 'America/New_York', -1, 23, 'ACCEPTED', {
          notes: 'Nightly check-in regarding city planning.',
        }),

        // ── Unconfirmed (Pending) ──
        makeBooking(et30, 'Clark Kent', 'clark@dailyplanet.com', 'America/New_York', 3, 13, 'PENDING', {
          notes: 'Discussing interview questions for the upcoming profile.',
        }),

        // ── More Past Bookings ──
        makeBooking(et60 || et30, 'Tony Stark', 'tony@stark.id', 'America/New_York', -45, 10, 'ACCEPTED', {
          notes: 'Initial consulting session on arc reactor efficiency.',
          meetingUrl: 'https://meet.google.com/tony-stark-private',
        }),

        // ── Recurring (Simulated via multiple bookings) ──
        ...[1, 2, 3, 4].map(w => 
          makeBooking(et30, 'Wanda Maximoff', 'wanda@avengers.org', 'America/New_York', w * 7, 10, 'ACCEPTED', {
            title: `Weekly Sync: Wanda <> John Doe (Week ${w})`,
            notes: 'Regular check-in on project status.',
            metadata: { recurring: true, week: w }
          })
        ),
      ];

        ),
      ];
 
      await Booking.insertMany(bookings);
      console.log(`✅ Seed: Enforced ${bookings.length} sample bookings for John Doe`);
    } else {
      console.warn('⚠️ Seed: No event types found for John. Skipping booking seeding.');
    }
  }

  // ── 5. Sample Workflows ────────────────────────────────────────────────────
  const existingWF = await Workflow.countDocuments({ userId: john._id });
  if (existingWF === 0) {
    await Workflow.insertMany([
      {
        name:    'Booking Reminder',
        userId:  john._id,
        trigger: 'BEFORE_EVENT',
        time:    24,
        timeUnit:'HOUR',
        steps:   [{
          stepNumber:  1,
          action:      'EMAIL',
          trigger:     'BEFORE_EVENT',
          time:        24,
          timeUnit:    'HOUR',
          sendTo:      'ATTENDEE',
          emailSubject:'Reminder: Your meeting with John Doe is tomorrow',
          reminderBody:'Hi {ATTENDEE_NAME}, just a reminder that you have a meeting scheduled for tomorrow. See you then!',
          template:    'REMINDER',
        }],
      },
      {
        name:    'Thank You Follow-up',
        userId:  john._id,
        trigger: 'AFTER_EVENT',
        time:    1,
        timeUnit:'HOUR',
        steps:   [{
          stepNumber:  1,
          action:      'EMAIL',
          trigger:     'AFTER_EVENT',
          time:        1,
          timeUnit:    'HOUR',
          sendTo:      'ATTENDEE',
          emailSubject:'Thanks for meeting with John Doe!',
          reminderBody:'Hi {ATTENDEE_NAME}, thank you for taking the time to meet! If you have any follow-up questions, feel free to reply to this email.',
          template:    'CUSTOM',
        }],
      },
    ]);
    console.log('✅ Seed: Created 2 sample workflows');
  }

    // ── 6. Sample Teams ───────────────────────────────────────────────────────
    const existingTeams = await Team.countDocuments({ 'members.userId': john._id });
    if (existingTeams === 0) {
      await Team.insertMany([
        {
          name: 'Cal.com Design System',
          slug: 'design-system',
          bio:  'Building the foundation of our UI/UX patterns.',
          members: [{ userId: john._id, role: 'OWNER', accepted: true }]
        },
        {
          name: 'Growth & Marketing',
          slug: 'growth',
          bio:  'Scaling the platform to the next million users.',
          members: [{ userId: john._id, role: 'ADMIN', accepted: true }]
        }
      ]);
      console.log('✅ Seed: Created 2 sample teams for John');
    }

    console.log('🌱 Database seeding complete.');
  } catch (err) {
    console.error('⚠️ Seeding warning (non-fatal):', err.message);
  }
}

module.exports = seed;
