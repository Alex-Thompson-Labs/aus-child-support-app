-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- LEADS TABLE
-- =============================================================================

create table if not exists public.leads (
    id uuid not null default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    
    -- Parent Contact
    parent_name text not null,
    parent_email text not null,
    parent_phone text,
    location text,
    
    -- Calculation Data
    income_parent_a numeric not null default 0,
    income_parent_b numeric not null default 0,
    children_count integer not null default 0,
    annual_liability numeric not null default 0,
    payer_role text check (payer_role in ('you', 'other_parent')),
    
    -- Care Arrangement Data
    care_data jsonb,
    
    -- Complexity Data
    complexity_trigger text[],
    complexity_reasons text[] default '{}',
    financial_tags text[],
    
    -- Message
    parent_message text not null,
    
    -- Privacy Compliance
    consent_given boolean not null default false,
    
    -- Lead Management
    assigned_lawyer_id uuid,
    status text check (status in ('new', 'reviewing', 'sent', 'converted', 'lost')) default 'new',
    sent_at timestamptz,
    lawyer_response_at timestamptz,
    notes text,
    deleted_at timestamptz,
    submitted_at timestamptz default now(),
    
    -- Chatbot Lead Qualification
    parenting_plan_status text,
    inquiry_type text,
    referer_url text,
    
    -- Lead Scoring
    lead_score numeric,
    score_category text,
    scoring_factors text[],
    
    -- Special Circumstances
    special_circumstances_data jsonb,
    
    -- Enrichment (from updateLeadEnrichment)
    enrichment_annual_liability numeric,
    enrichment_payer_role text,

    -- Audit Logging
    status_changed_at timestamptz,
    status_changed_by uuid
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies

-- Public can submit leads
create policy "Enable insert for everyone"
    on public.leads for insert
    with check (true);

-- Only specific admin email can view/edit/delete
create policy "Enable full access for admin"
    on public.leads for all
    using (
        (select auth.jwt() ->> 'email') = 'alex@auschildsupport.com'
    );


-- =============================================================================
-- DECRYPTED VIEW
-- =============================================================================

drop view if exists public.leads_decrypted;
create view public.leads_decrypted as
select * from public.leads;


-- =============================================================================
-- PARTNERSHIP PROPOSALS TABLE
-- =============================================================================

create table if not exists public.partnership_proposals (
    id uuid not null default uuid_generate_v4() primary key,
    firm_name text not null,
    slug text not null unique,
    is_active boolean not null default true,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.partnership_proposals enable row level security;

-- Policies
create policy "Enable read access for everyone"
    on public.partnership_proposals for select
    using (true);

create policy "Enable write access for admin only"
    on public.partnership_proposals for insert
    with check (
        (select auth.jwt() ->> 'email') = 'alex@auschildsupport.com'
    );

create policy "Enable update access for admin only"
    on public.partnership_proposals for update
    using (
        (select auth.jwt() ->> 'email') = 'alex@auschildsupport.com'
    );

create policy "Enable delete access for admin only"
    on public.partnership_proposals for delete
    using (
        (select auth.jwt() ->> 'email') = 'alex@auschildsupport.com'
    );


-- =============================================================================
-- PROPOSAL VIEWS TABLE
-- =============================================================================

create table if not exists public.proposal_views (
    id uuid not null default uuid_generate_v4() primary key,
    proposal_id uuid not null references public.partnership_proposals(id) on delete cascade,
    viewed_at timestamptz default now(),
    last_heartbeat_at timestamptz default now(),
    device_info text
);

-- Enable RLS
alter table public.proposal_views enable row level security;

-- Policies
create policy "Enable insert for everyone"
    on public.proposal_views for insert
    with check (true);

create policy "Enable update for everyone (heartbeats)"
    on public.proposal_views for update
    using (true);

create policy "Enable read access for admin only"
    on public.proposal_views for select
    using (
        (select auth.jwt() ->> 'email') = 'alex@auschildsupport.com'
    );


-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to append complexity reasons without needing SELECT permissions
create or replace function public.append_complexity_reasons(lead_id uuid, new_reasons text[])
returns void as $$
begin
    update public.leads
    set complexity_reasons = array_cat(complexity_reasons, new_reasons)
    where id = lead_id;
end;
$$ language plpgsql security definer;

-- Trigger to update status_changed audit fields
create or replace function public.handle_leads_status_change()
returns trigger as $$
begin
    if new.status is distinct from old.status then
        new.status_changed_at = now();
        new.status_changed_by = auth.uid();
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger leads_status_change_trigger
    before update on public.leads
    for each row
    execute function public.handle_leads_status_change();
