alter table groups
  add column if not exists solo boolean not null default false;
