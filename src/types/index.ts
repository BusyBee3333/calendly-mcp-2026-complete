// Calendly API v2 TypeScript Types

export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  scheduling_url: string;
  timezone: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  current_organization: string;
  resource_type: 'User';
  locale?: string;
}

export interface CalendlyOrganization {
  uri: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  resource_type: 'Organization';
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: 'solo' | 'group' | 'collective' | 'round_robin';
  pooling_type?: 'round_robin' | 'collective' | null;
  type: 'StandardEventType' | 'CustomEventType';
  color: string;
  created_at: string;
  updated_at: string;
  internal_note?: string;
  description_plain?: string;
  description_html?: string;
  profile: {
    type: 'User' | 'Team';
    name: string;
    owner: string;
  };
  secret: boolean;
  booking_method: 'instant' | 'poll';
  custom_questions?: CustomQuestion[];
  deleted_at?: string;
  admin_managed?: boolean;
  resource_type: 'EventType';
}

export interface CustomQuestion {
  name: string;
  type: 'string' | 'text' | 'phone_number' | 'multiple_choice' | 'radio_buttons' | 'checkboxes';
  position: number;
  enabled: boolean;
  required: boolean;
  answer_choices?: string[];
  include_other?: boolean;
}

export interface CalendlyEvent {
  uri: string;
  name: string;
  meeting_notes_plain?: string;
  meeting_notes_html?: string;
  status: 'active' | 'canceled';
  start_time: string;
  end_time: string;
  event_type: string;
  location?: EventLocation;
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
  event_memberships: EventMembership[];
  event_guests: EventGuest[];
  calendar_event?: {
    kind: string;
    external_id: string;
  };
  cancellation?: {
    canceled_by: string;
    reason?: string;
    canceler_type: 'host' | 'invitee';
  };
  resource_type: 'Event';
}

export interface EventLocation {
  type: 'physical' | 'outbound_call' | 'inbound_call' | 'google_conference' | 'zoom' | 'gotomeeting' | 'microsoft_teams' | 'webex' | 'custom';
  location?: string;
  join_url?: string;
  status?: string;
  data?: Record<string, any>;
}

export interface EventMembership {
  user: string;
  user_email?: string;
  user_name?: string;
}

export interface EventGuest {
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'canceled';
  questions_and_answers?: QuestionAnswer[];
  timezone: string;
  event: string;
  created_at: string;
  updated_at: string;
  tracking?: {
    utm_campaign?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    salesforce_uuid?: string;
  };
  text_reminder_number?: string;
  rescheduled: boolean;
  old_invitee?: string;
  new_invitee?: string;
  cancel_url: string;
  reschedule_url: string;
  cancellation?: InviteeCancellation;
  payment?: {
    id: string;
    provider: string;
    amount: number;
    currency: string;
    terms: string;
    successful: boolean;
  };
  no_show?: NoShow;
  reconfirmation?: {
    created_at: string;
    confirmed_at?: string;
  };
  routing_form_submission?: string;
  resource_type: 'Invitee';
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  position: number;
}

export interface InviteeCancellation {
  canceled_by: string;
  reason?: string;
  canceler_type?: 'host' | 'invitee';
}

export interface NoShow {
  uri: string;
  created_at: string;
}

export interface CalendlyWebhook {
  uri: string;
  callback_url: string;
  created_at: string;
  updated_at: string;
  retry_started_at?: string;
  state: 'active' | 'disabled';
  events: WebhookEvent[];
  organization: string;
  user?: string;
  creator: string;
  signing_key: string;
  scope: 'organization' | 'user';
  resource_type: 'WebhookSubscription';
}

export type WebhookEvent =
  | 'invitee.created'
  | 'invitee.canceled'
  | 'routing_form_submission.created'
  | 'invitee_no_show.created'
  | 'invitee_no_show.deleted';

export interface CalendlySchedulingLink {
  booking_url: string;
  owner: string;
  owner_type: 'EventType' | 'User';
  resource_type: 'SchedulingLink';
}

export interface CalendlyRoutingForm {
  uri: string;
  name: string;
  organization: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  questions: RoutingFormQuestion[];
  resource_type: 'RoutingForm';
}

export interface RoutingFormQuestion {
  uuid: string;
  name: string;
  type: 'text' | 'phone' | 'textarea' | 'select' | 'radios' | 'checkboxes';
  required: boolean;
  answer_choices?: RoutingAnswerChoice[];
}

export interface RoutingAnswerChoice {
  uuid: string;
  label: string;
  routing_target: {
    type: 'event_type' | 'external_url' | 'custom_message';
    value: string;
  };
}

export interface CalendlyRoutingFormSubmission {
  uri: string;
  routing_form: string;
  submitter: {
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
  };
  submitter_type: 'Invitee' | 'Prospect';
  questions_and_answers: QuestionAnswer[];
  tracking?: {
    utm_campaign?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
  };
  result: {
    type: 'event_type' | 'external_url' | 'custom_message';
    value: string;
  };
  created_at: string;
  updated_at: string;
  resource_type: 'RoutingFormSubmission';
}

export interface OrganizationInvitation {
  uri: string;
  organization: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'revoked';
  created_at: string;
  updated_at: string;
  last_sent_at: string;
  resource_type: 'OrganizationInvitation';
}

export interface OrganizationMembership {
  uri: string;
  role: 'owner' | 'admin' | 'user';
  user: CalendlyUser;
  organization: string;
  created_at: string;
  updated_at: string;
  resource_type: 'OrganizationMembership';
}

export interface ActivityLogEntry {
  occurred_at: string;
  action: string;
  actor: string;
  namespace: string;
  details?: string;
  organization: string;
}

export interface DataComplianceRequest {
  uri: string;
  emails: string[];
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AvailabilityRule {
  type: 'wday' | 'date';
  wday?: string;
  date?: string;
  intervals: TimeInterval[];
}

export interface TimeInterval {
  from: string;
  to: string;
}

export interface UserAvailabilitySchedule {
  uri: string;
  name: string;
  user: string;
  timezone: string;
  rules: AvailabilityRule[];
  default: boolean;
  created_at: string;
  updated_at: string;
  resource_type: 'UserAvailabilitySchedule';
}

export interface PaginationParams {
  count?: number;
  page_token?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  collection: T[];
  pagination: {
    count: number;
    next_page?: string;
    previous_page?: string;
    next_page_token?: string;
    previous_page_token?: string;
  };
}

export interface CalendlyError {
  title: string;
  message: string;
  details?: Array<{
    parameter: string;
    message: string;
  }>;
}

export interface ShareOptions {
  invitee_email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  guests?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  salesforce_uuid?: string;
  a1?: string;
  a2?: string;
  a3?: string;
  a4?: string;
  a5?: string;
  a6?: string;
  a7?: string;
  a8?: string;
  a9?: string;
  a10?: string;
}

export interface CreateEventTypeParams {
  name: string;
  duration: number;
  type?: 'StandardEventType';
  kind?: 'solo' | 'group';
  description_plain?: string;
  description_html?: string;
  color?: string;
  internal_note?: string;
  secret?: boolean;
  custom_questions?: CustomQuestion[];
  profile: {
    type: 'User';
    owner: string;
  };
}

export interface UpdateEventTypeParams {
  name?: string;
  duration?: number;
  description_plain?: string;
  description_html?: string;
  color?: string;
  internal_note?: string;
  secret?: boolean;
  active?: boolean;
  custom_questions?: CustomQuestion[];
}
