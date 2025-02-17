export const SemesterRegistrationStatus = {
    upcoming: 'upcoming',
    ongoing: 'ongoing',
    ended: 'ended'
} as const;

const { upcoming, ongoing, ended } = SemesterRegistrationStatus

export const SemesterRegistrationStatusArray = [upcoming, ongoing, ended]