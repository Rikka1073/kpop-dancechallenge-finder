alter table groups
  add column if not exists youtube_channel_id text,
  add column if not exists youtube_channel_title text;

create unique index if not exists groups_youtube_channel_id_key
  on groups (youtube_channel_id)
  where youtube_channel_id is not null;
