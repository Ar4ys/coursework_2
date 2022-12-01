export enum EmployeeRole {
  DataAnalyst = 'Data Analyst',
  Designer = 'Designer',
  Developer = 'Developer',
  Manager = 'Manager',
  Marketeer = 'Marketeer',
  QA = 'QA',
}

export enum ReportType {
  Development = 'Development',
  Estimation = 'Estimation',
  Interview = 'Interview',
  Meeting = 'Meeting',
  SelfEducation = 'Self Education',
}

export enum VacationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export enum VacationType {
  SickLeave = 'Sick Leave',
  UnpaidLeave = 'Unpaid Leave',
  Vacation = 'Vacation',
  PaidLeave = 'Paid Leave',
  WorkOff = 'Work Off',
}

export interface NextPageProps {
  params: Record<string, string>
  // It is actually of type Record<string, string | string[]>,
  // but I am too lazy to handle it.
  searchParams: Record<string, string>
}

