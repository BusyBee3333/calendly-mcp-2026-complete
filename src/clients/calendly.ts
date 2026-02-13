import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  CalendlyUser,
  CalendlyOrganization,
  CalendlyEventType,
  CalendlyEvent,
  CalendlyInvitee,
  CalendlyWebhook,
  CalendlySchedulingLink,
  CalendlyRoutingForm,
  CalendlyRoutingFormSubmission,
  OrganizationInvitation,
  OrganizationMembership,
  ActivityLogEntry,
  DataComplianceRequest,
  UserAvailabilitySchedule,
  PaginatedResponse,
  CalendlyError,
  NoShow,
} from '../types/index.js';

export interface CalendlyClientConfig {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
}

export class CalendlyClient {
  private client: AxiosInstance;
  private rateLimitRemaining: number = 1000;
  private rateLimitReset: number = Date.now();

  constructor(config: CalendlyClientConfig) {
    const authToken = config.accessToken || config.apiKey;
    if (!authToken) {
      throw new Error('Either apiKey or accessToken must be provided');
    }

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.calendly.com',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for rate limiting
    this.client.interceptors.response.use(
      (response) => {
        const remaining = response.headers['x-ratelimit-remaining'];
        const reset = response.headers['x-ratelimit-reset'];
        
        if (remaining) this.rateLimitRemaining = parseInt(remaining, 10);
        if (reset) this.rateLimitReset = parseInt(reset, 10) * 1000;

        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      const data = error.response.data as CalendlyError;
      const status = error.response.status;
      
      let message = `Calendly API error (${status}): ${data.title || error.message}`;
      if (data.message) {
        message += ` - ${data.message}`;
      }
      if (data.details && data.details.length > 0) {
        const detailsStr = data.details
          .map((d) => `${d.parameter}: ${d.message}`)
          .join(', ');
        message += ` | Details: ${detailsStr}`;
      }

      return new Error(message);
    }
    
    return new Error(`Network error: ${error.message}`);
  }

  private async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining < 10) {
      const waitTime = Math.max(0, this.rateLimitReset - Date.now());
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // Users
  async getCurrentUser(): Promise<CalendlyUser> {
    await this.checkRateLimit();
    const response = await this.client.get('/users/me');
    return response.data.resource;
  }

  async getUser(userUri: string): Promise<CalendlyUser> {
    await this.checkRateLimit();
    const response = await this.client.get(userUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  // Organizations
  async getOrganization(organizationUri: string): Promise<CalendlyOrganization> {
    await this.checkRateLimit();
    const response = await this.client.get(organizationUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async listOrganizationInvitations(
    organizationUri: string,
    params?: { count?: number; email?: string; page_token?: string; sort?: string; status?: string }
  ): Promise<PaginatedResponse<OrganizationInvitation>> {
    await this.checkRateLimit();
    const response = await this.client.get('/organization_invitations', {
      params: { organization: organizationUri, ...params },
    });
    return response.data;
  }

  async getOrganizationInvitation(invitationUri: string): Promise<OrganizationInvitation> {
    await this.checkRateLimit();
    const response = await this.client.get(invitationUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async createOrganizationInvitation(
    organizationUri: string,
    email: string
  ): Promise<OrganizationInvitation> {
    await this.checkRateLimit();
    const response = await this.client.post('/organization_invitations', {
      organization: organizationUri,
      email,
    });
    return response.data.resource;
  }

  async revokeOrganizationInvitation(invitationUri: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(invitationUri.replace('https://api.calendly.com', ''));
  }

  async listOrganizationMemberships(
    organizationUri: string,
    params?: { count?: number; email?: string; page_token?: string; role?: string }
  ): Promise<PaginatedResponse<OrganizationMembership>> {
    await this.checkRateLimit();
    const response = await this.client.get('/organization_memberships', {
      params: { organization: organizationUri, ...params },
    });
    return response.data;
  }

  async getOrganizationMembership(membershipUri: string): Promise<OrganizationMembership> {
    await this.checkRateLimit();
    const response = await this.client.get(membershipUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async removeOrganizationMembership(membershipUri: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(membershipUri.replace('https://api.calendly.com', ''));
  }

  // Event Types
  async listEventTypes(
    params: { user?: string; organization?: string; count?: number; page_token?: string; sort?: string; active?: boolean }
  ): Promise<PaginatedResponse<CalendlyEventType>> {
    await this.checkRateLimit();
    const response = await this.client.get('/event_types', { params });
    return response.data;
  }

  async getEventType(eventTypeUri: string): Promise<CalendlyEventType> {
    await this.checkRateLimit();
    const response = await this.client.get(eventTypeUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async createEventType(params: {
    name: string;
    duration: number;
    profile: { type: 'User'; owner: string };
    type?: string;
    kind?: string;
    description_plain?: string;
    description_html?: string;
    color?: string;
    internal_note?: string;
    secret?: boolean;
    custom_questions?: any[];
  }): Promise<CalendlyEventType> {
    await this.checkRateLimit();
    const response = await this.client.post('/event_types', params);
    return response.data.resource;
  }

  async updateEventType(
    eventTypeUri: string,
    params: {
      name?: string;
      duration?: number;
      description_plain?: string;
      description_html?: string;
      color?: string;
      internal_note?: string;
      secret?: boolean;
      active?: boolean;
      custom_questions?: any[];
    }
  ): Promise<CalendlyEventType> {
    await this.checkRateLimit();
    const response = await this.client.patch(
      eventTypeUri.replace('https://api.calendly.com', ''),
      params
    );
    return response.data.resource;
  }

  async deleteEventType(eventTypeUri: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(eventTypeUri.replace('https://api.calendly.com', ''));
  }

  // Scheduled Events
  async listEvents(params: {
    user?: string;
    organization?: string;
    invitee_email?: string;
    status?: string;
    min_start_time?: string;
    max_start_time?: string;
    count?: number;
    page_token?: string;
    sort?: string;
  }): Promise<PaginatedResponse<CalendlyEvent>> {
    await this.checkRateLimit();
    const response = await this.client.get('/scheduled_events', { params });
    return response.data;
  }

  async getEvent(eventUri: string): Promise<CalendlyEvent> {
    await this.checkRateLimit();
    const response = await this.client.get(eventUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async cancelEvent(eventUri: string, reason?: string): Promise<CalendlyEvent> {
    await this.checkRateLimit();
    const response = await this.client.post(
      `${eventUri.replace('https://api.calendly.com', '')}/cancellation`,
      { reason }
    );
    return response.data.resource;
  }

  // Invitees
  async listEventInvitees(
    eventUri: string,
    params?: { count?: number; email?: string; page_token?: string; sort?: string; status?: string }
  ): Promise<PaginatedResponse<CalendlyInvitee>> {
    await this.checkRateLimit();
    const response = await this.client.get(
      `${eventUri.replace('https://api.calendly.com', '')}/invitees`,
      { params }
    );
    return response.data;
  }

  async getInvitee(inviteeUri: string): Promise<CalendlyInvitee> {
    await this.checkRateLimit();
    const response = await this.client.get(inviteeUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  // No-shows
  async createNoShow(inviteeUri: string): Promise<NoShow> {
    await this.checkRateLimit();
    const response = await this.client.post('/invitee_no_shows', {
      invitee: inviteeUri,
    });
    return response.data.resource;
  }

  async getNoShow(noShowUri: string): Promise<NoShow> {
    await this.checkRateLimit();
    const response = await this.client.get(noShowUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async deleteNoShow(noShowUri: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(noShowUri.replace('https://api.calendly.com', ''));
  }

  // Webhooks
  async listWebhooks(
    params: { organization: string; scope: string; count?: number; page_token?: string }
  ): Promise<PaginatedResponse<CalendlyWebhook>> {
    await this.checkRateLimit();
    const response = await this.client.get('/webhook_subscriptions', { params });
    return response.data;
  }

  async getWebhook(webhookUri: string): Promise<CalendlyWebhook> {
    await this.checkRateLimit();
    const response = await this.client.get(webhookUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async createWebhook(params: {
    url: string;
    events: string[];
    organization: string;
    scope: string;
    signing_key?: string;
    user?: string;
  }): Promise<CalendlyWebhook> {
    await this.checkRateLimit();
    const response = await this.client.post('/webhook_subscriptions', params);
    return response.data.resource;
  }

  async deleteWebhook(webhookUri: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(webhookUri.replace('https://api.calendly.com', ''));
  }

  // Scheduling Links
  async createSchedulingLink(params: {
    max_event_count: number;
    owner: string;
    owner_type: string;
  }): Promise<CalendlySchedulingLink> {
    await this.checkRateLimit();
    const response = await this.client.post('/scheduling_links', params);
    return response.data.resource;
  }

  // Routing Forms
  async listRoutingForms(
    organizationUri: string,
    params?: { count?: number; page_token?: string; sort?: string }
  ): Promise<PaginatedResponse<CalendlyRoutingForm>> {
    await this.checkRateLimit();
    const response = await this.client.get('/routing_forms', {
      params: { organization: organizationUri, ...params },
    });
    return response.data;
  }

  async getRoutingForm(routingFormUri: string): Promise<CalendlyRoutingForm> {
    await this.checkRateLimit();
    const response = await this.client.get(routingFormUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  async listRoutingFormSubmissions(
    routingFormUri: string,
    params?: { count?: number; page_token?: string; sort?: string }
  ): Promise<PaginatedResponse<CalendlyRoutingFormSubmission>> {
    await this.checkRateLimit();
    const response = await this.client.get(
      `${routingFormUri.replace('https://api.calendly.com', '')}/submissions`,
      { params }
    );
    return response.data;
  }

  async getRoutingFormSubmission(submissionUri: string): Promise<CalendlyRoutingFormSubmission> {
    await this.checkRateLimit();
    const response = await this.client.get(submissionUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  // User Availability Schedules
  async listUserAvailabilitySchedules(
    userUri: string
  ): Promise<PaginatedResponse<UserAvailabilitySchedule>> {
    await this.checkRateLimit();
    const response = await this.client.get('/user_availability_schedules', {
      params: { user: userUri },
    });
    return response.data;
  }

  async getUserAvailabilitySchedule(scheduleUri: string): Promise<UserAvailabilitySchedule> {
    await this.checkRateLimit();
    const response = await this.client.get(scheduleUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }

  // Activity Log
  async getActivityLog(
    organizationUri: string,
    params?: {
      action?: string;
      actor?: string;
      max_occurred_at?: string;
      min_occurred_at?: string;
      namespace?: string;
      search_term?: string;
      sort?: string;
      count?: number;
      page_token?: string;
    }
  ): Promise<PaginatedResponse<ActivityLogEntry>> {
    await this.checkRateLimit();
    const response = await this.client.get('/activity_log_entries', {
      params: { organization: organizationUri, ...params },
    });
    return response.data;
  }

  // Data Compliance
  async createDataComplianceDeletion(emails: string[]): Promise<DataComplianceRequest> {
    await this.checkRateLimit();
    const response = await this.client.post('/data_compliance/deletion/invitees', {
      emails,
    });
    return response.data.resource;
  }

  async getDataComplianceDeletion(requestUri: string): Promise<DataComplianceRequest> {
    await this.checkRateLimit();
    const response = await this.client.get(requestUri.replace('https://api.calendly.com', ''));
    return response.data.resource;
  }
}
