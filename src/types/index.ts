export type Videos = {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  view_count: number;
  video_groups: {
    groups: {
      id: string;
      group_name: string;
    };
  }[];
  video_songs: {
    songs: {
      id: string;
      song_name: string;
    };
  }[];
};

export type VideoCardProps = {
  video: Videos;
};

export type ChildrenProps = {
  children: React.ReactNode;
};

export type ButtonProps = {
  id?: string;
  name?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
};

export type CarouselButtonProps = {
  emblaApi?: { scrollPrev: () => void; scrollNext: () => void };
};

export type Record = {
  id: string;
  name: string;
};

export type GroupDetail = {
  groups: {
    id: string;
    group_name: string;
  };
};

export type SongDetail = {
  songs: {
    id: string;
    song_name: string;
  };
};

export type RegisterInputs = {
  videoId: {
    id: string;
  };
  songId: string;
  firstGroupId: string;
  secondGroupId: string;
};

export type VideoData = {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
};

export type VideoGroupData = {
  videoId: string;

  firstGroupId: string;
  secondGroupId: string;
};

export type VideoSongData = {
  videoId: string;
  songId: string;
};
