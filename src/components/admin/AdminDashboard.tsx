"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Music, Plus, RefreshCw, Search, Trash2, Users, Youtube } from "lucide-react";
import { adminRequest } from "@/lib/admin/client";
import { isVideoMissingTags } from "@/lib/search/filterVideos";
import { GroupRecord, SongRecord } from "@/types";
import { RegisteredVideoRecord } from "@/lib/supabase/registerSupabaseFunction";
import formatViewCount from "@/lib/formatViewCount";
import type { YouTubeVideoSnapshot } from "@/lib/youtube/fetchYouTubeVideo";

type Tab = "register" | "videos" | "catalog";
type VideoFilter = "all" | "untagged" | "hidden";

const AdminDashboard = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("register");
  const [videos, setVideos] = useState<RegisteredVideoRecord[]>([]);
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [songs, setSongs] = useState<SongRecord[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [videoData, catalog] = await Promise.all([
        adminRequest<RegisteredVideoRecord[]>("/api/admin/videos"),
        adminRequest<{ groups: GroupRecord[]; songs: SongRecord[] }>("/api/admin/catalog"),
      ]);
      setVideos(videoData);
      setGroups(catalog.groups);
      setSongs(catalog.songs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const notify = (text: string) => {
    setError("");
    setMessage(text);
  };

  const fail = (err: unknown) => {
    setMessage("");
    setError(err instanceof Error ? err.message : "処理に失敗しました");
  };

  const logout = async () => {
    await adminRequest("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="text-black">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-600 md:text-4xl">データ管理</h1>
          <p className="text-gray-600">YouTube URLから動画を登録し、グループと楽曲をまとめて管理します</p>
        </div>
        <button type="button" onClick={logout} className="btn rounded-2xl bg-white">
          ログアウト
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-white p-2">
        <TabButton active={tab === "register"} onClick={() => setTab("register")}>
          動画を登録
        </TabButton>
        <TabButton active={tab === "videos"} onClick={() => setTab("videos")}>
          動画一覧（{videos.length}）
        </TabButton>
        <TabButton active={tab === "catalog"} onClick={() => setTab("catalog")}>
          グループ / 楽曲
        </TabButton>
      </div>

      {message && <p className="mb-4 rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-600">{error}</p>}
      {loading && (
        <div className="mb-4 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {tab === "register" && (
        <VideoRegisterPanel
          groups={groups}
          songs={songs}
          onGroupCreated={(group) => setGroups((prev) => [...prev, group])}
          onSongCreated={(song) => setSongs((prev) => [...prev, song])}
          onCreated={async (video) => {
            setVideos((prev) => [video, ...prev.filter((item) => item.id !== video.id)]);
            notify("動画を登録しました");
          }}
          onError={fail}
        />
      )}

      {tab === "videos" && (
        <VideoManagePanel
          videos={videos}
          groups={groups}
          songs={songs}
          onChange={(updated) => {
            setVideos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            notify("動画を更新しました");
          }}
          onDelete={(id) => {
            setVideos((prev) => prev.filter((item) => item.id !== id));
            notify("動画を削除しました");
          }}
          onError={fail}
        />
      )}

      {tab === "catalog" && (
        <CatalogPanel
          groups={groups}
          songs={songs}
          onGroupsChange={setGroups}
          onSongsChange={setSongs}
          onError={fail}
          onNotice={notify}
        />
      )}
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl px-4 py-2 font-bold ${
      active
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        : "bg-transparent text-gray-600 hover:bg-purple-50"
    }`}
  >
    {children}
  </button>
);

const VideoRegisterPanel = ({
  groups,
  songs,
  onCreated,
  onGroupCreated,
  onSongCreated,
  onError,
}: {
  groups: GroupRecord[];
  songs: SongRecord[];
  onCreated: (video: RegisteredVideoRecord) => Promise<void> | void;
  onGroupCreated: (group: GroupRecord) => void;
  onSongCreated: (song: SongRecord) => void;
  onError: (error: unknown) => void;
}) => {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<YouTubeVideoSnapshot | null>(null);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [songIds, setSongIds] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState("");
  const [newSong, setNewSong] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const previewVideo = async () => {
    try {
      const data = await adminRequest<YouTubeVideoSnapshot>(`/api/admin/youtube?url=${encodeURIComponent(url)}`);
      setPreview(data);
    } catch (error) {
      onError(error);
    }
  };

  const toggle = (id: string, list: string[], setter: (value: string[]) => void) => {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  const addGroup = async () => {
    const name = newGroup.trim();
    if (!name) return;
    try {
      const created = await adminRequest<GroupRecord>("/api/admin/catalog", {
        method: "POST",
        body: JSON.stringify({ type: "group", name, displayOrder: groups.length + 1 }),
      });
      setNewGroup("");
      setGroupIds((prev) => [...prev, created.id]);
      onGroupCreated(created);
    } catch (error) {
      onError(error);
    }
  };

  const addSong = async () => {
    const name = newSong.trim();
    if (!name) return;
    try {
      const created = await adminRequest<SongRecord>("/api/admin/catalog", {
        method: "POST",
        body: JSON.stringify({ type: "song", name }),
      });
      setNewSong("");
      setSongIds((prev) => [...prev, created.id]);
      onSongCreated(created);
    } catch (error) {
      onError(error);
    }
  };

  const submit = async () => {
    if (!preview) {
      onError(new Error("先に動画プレビューを取得してください"));
      return;
    }
    setSubmitting(true);
    try {
      const video = await adminRequest<RegisteredVideoRecord>("/api/admin/videos", {
        method: "POST",
        body: JSON.stringify({
          youtubeUrl: preview.youtubeId,
          groupIds,
          songIds,
        }),
      });
      setUrl("");
      setPreview(null);
      setGroupIds([]);
      setSongIds([]);
      await onCreated(video);
    } catch (error) {
      onError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">1. YouTube URLを入力</h2>
        <div className="flex flex-col gap-3">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/shorts/..."
            className="input input-lg w-full focus:outline-purple-600"
          />
          <button type="button" onClick={previewVideo} className="btn rounded-2xl bg-purple-50 text-purple-700">
            <Search className="h-4 w-4" />
            動画情報を取得
          </button>
        </div>
        {preview && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-purple-100">
            <Image
              src={preview.thumbnailUrl}
              alt={preview.title}
              width={360}
              height={640}
              className="aspect-[9/16] max-h-80 w-full object-cover"
            />
            <div className="p-4">
              <p className="font-bold">{preview.title}</p>
              <p className="text-sm text-gray-500">{formatViewCount(preview.viewCount)} views</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">2. グループと楽曲を選択</h2>
        <p className="mb-4 text-sm text-gray-600">1件以上のグループと楽曲を選ぶと、検索画面にすぐ表示されます。</p>
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Users className="h-4 w-4 text-purple-600" />
            グループ
          </div>
          <CheckboxList
            items={groups.map((group) => ({ id: group.id, name: group.group_name, hidden: group.display === false }))}
            selectedIds={groupIds}
            onToggle={(id) => toggle(id, groupIds, setGroupIds)}
          />
          <div className="mt-2 flex gap-2">
            <input
              value={newGroup}
              onChange={(event) => setNewGroup(event.target.value)}
              placeholder="新しいグループ名"
              className="input w-full"
            />
            <button type="button" onClick={addGroup} className="btn">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Music className="h-4 w-4 text-red-500" />
            楽曲
          </div>
          <CheckboxList
            items={songs.map((song) => ({ id: song.id, name: song.song_name, hidden: song.display === false }))}
            selectedIds={songIds}
            onToggle={(id) => toggle(id, songIds, setSongIds)}
          />
          <div className="mt-2 flex gap-2">
            <input
              value={newSong}
              onChange={(event) => setNewSong(event.target.value)}
              placeholder="新しい楽曲名"
              className="input w-full"
            />
            <button type="button" onClick={addSong} className="btn">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="btn-lg w-full rounded-2xl border-none bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-lg text-white disabled:opacity-60"
        >
          {submitting ? "登録中..." : "動画を登録"}
        </button>
      </div>
    </div>
  );
};

const VideoManagePanel = ({
  videos,
  groups,
  songs,
  onChange,
  onDelete,
  onError,
}: {
  videos: RegisteredVideoRecord[];
  groups: GroupRecord[];
  songs: SongRecord[];
  onChange: (video: RegisteredVideoRecord) => void;
  onDelete: (id: string) => void;
  onError: (error: unknown) => void;
}) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<VideoFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return videos.filter((video) => {
      const keyword = query.trim().toLowerCase();
      const matchesQuery =
        !keyword ||
        video.title.toLowerCase().includes(keyword) ||
        video.youtube_id.toLowerCase().includes(keyword) ||
        video.video_groups?.some((item) => item.groups?.group_name.toLowerCase().includes(keyword));
      if (!matchesQuery) return false;
      if (filter === "untagged") return isVideoMissingTags(video);
      if (filter === "hidden") return video.display === false;
      return true;
    });
  }, [videos, query, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="タイトル・グループで検索"
          className="input w-full md:flex-1"
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as VideoFilter)}
          className="select md:w-48"
        >
          <option value="all">すべて</option>
          <option value="untagged">未タグ付け</option>
          <option value="hidden">非公開</option>
        </select>
      </div>
      <div className="space-y-4">
        {filtered.map((video) => (
          <VideoManageCard
            key={video.id}
            video={video}
            groups={groups}
            songs={songs}
            editing={editingId === video.id}
            onToggleEdit={() => setEditingId((current) => (current === video.id ? null : video.id))}
            onChange={onChange}
            onDelete={onDelete}
            onError={onError}
          />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-gray-500">該当する動画はありません</p>
        )}
      </div>
    </div>
  );
};

const VideoManageCard = ({
  video,
  groups,
  songs,
  editing,
  onToggleEdit,
  onChange,
  onDelete,
  onError,
}: {
  video: RegisteredVideoRecord;
  groups: GroupRecord[];
  songs: SongRecord[];
  editing: boolean;
  onToggleEdit: () => void;
  onChange: (video: RegisteredVideoRecord) => void;
  onDelete: (id: string) => void;
  onError: (error: unknown) => void;
}) => {
  const [groupIds, setGroupIds] = useState(
    video.video_groups?.map((item) => item.groups?.id).filter((id): id is string => Boolean(id)) || []
  );
  const [songIds, setSongIds] = useState(
    video.video_songs?.map((item) => item.songs?.id).filter((id): id is string => Boolean(id)) || []
  );

  const patch = async (body: Record<string, unknown>) => {
    try {
      const updated = await adminRequest<RegisteredVideoRecord>("/api/admin/videos", {
        method: "PATCH",
        body: JSON.stringify({ id: video.id, ...body }),
      });
      onChange(updated);
    } catch (error) {
      onError(error);
    }
  };

  const saveTags = async () => {
    await patch({ groupIds, songIds });
    onToggleEdit();
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-md">
      <div className="flex flex-col gap-4 md:flex-row">
        <Image
          src={video.thumbnail_url}
          alt={video.title}
          width={96}
          height={144}
          className="h-36 w-24 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {isVideoMissingTags(video) && <span className="badge badge-warning">未タグ付け</span>}
            {video.display === false && <span className="badge">非公開</span>}
            <span className="text-sm text-gray-500">{formatViewCount(video.view_count)} views</span>
          </div>
          <h3 className="mb-2 font-bold">{video.title}</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {video.video_groups?.map((item) =>
              item.groups ? (
                <span key={item.groups.id} className="badge border-none bg-fuchsia-100 text-purple-600">
                  {item.groups.group_name}
                </span>
              ) : null
            )}
            {video.video_songs?.map((item) =>
              item.songs ? (
                <span key={item.songs.id} className="badge border-none bg-red-100 text-red-600">
                  #{item.songs.song_name}
                </span>
              ) : null
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.youtube.com/shorts/${video.youtube_id}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm rounded-xl"
            >
              <Youtube className="h-4 w-4" />
              YouTube
            </a>
            <button type="button" className="btn btn-sm rounded-xl" onClick={() => patch({ refreshStats: true })}>
              <RefreshCw className="h-4 w-4" />
              再生数更新
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-xl"
              onClick={() => patch({ display: video.display === false })}
            >
              {video.display === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {video.display === false ? "公開" : "非公開"}
            </button>
            <button type="button" className="btn btn-sm rounded-xl" onClick={onToggleEdit}>
              タグ編集
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-xl text-red-600"
              onClick={async () => {
                if (!window.confirm("この動画を削除しますか？")) return;
                try {
                  await adminRequest("/api/admin/videos", {
                    method: "DELETE",
                    body: JSON.stringify({ id: video.id }),
                  });
                  onDelete(video.id);
                } catch (error) {
                  onError(error);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              削除
            </button>
          </div>
        </div>
      </div>
      {editing && (
        <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
          <div>
            <p className="mb-2 font-bold">グループ</p>
            <CheckboxList
              items={groups.map((group) => ({ id: group.id, name: group.group_name, hidden: group.display === false }))}
              selectedIds={groupIds}
              onToggle={(id) =>
                setGroupIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
            />
          </div>
          <div>
            <p className="mb-2 font-bold">楽曲</p>
            <CheckboxList
              items={songs.map((song) => ({ id: song.id, name: song.song_name, hidden: song.display === false }))}
              selectedIds={songIds}
              onToggle={(id) =>
                setSongIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
            />
          </div>
          <button type="button" className="btn rounded-xl bg-purple-600 text-white md:col-span-2" onClick={saveTags}>
            タグを保存
          </button>
        </div>
      )}
    </div>
  );
};

const CatalogPanel = ({
  groups,
  songs,
  onGroupsChange,
  onSongsChange,
  onError,
  onNotice,
}: {
  groups: GroupRecord[];
  songs: SongRecord[];
  onGroupsChange: (groups: GroupRecord[]) => void;
  onSongsChange: (songs: SongRecord[]) => void;
  onError: (error: unknown) => void;
  onNotice: (message: string) => void;
}) => {
  const [groupName, setGroupName] = useState("");
  const [songName, setSongName] = useState("");

  const addGroup = async () => {
    try {
      const created = await adminRequest<GroupRecord>("/api/admin/catalog", {
        method: "POST",
        body: JSON.stringify({ type: "group", name: groupName, displayOrder: groups.length + 1 }),
      });
      setGroupName("");
      onGroupsChange([...groups, created]);
      onNotice("グループを追加しました");
    } catch (error) {
      onError(error);
    }
  };

  const addSong = async () => {
    try {
      const created = await adminRequest<SongRecord>("/api/admin/catalog", {
        method: "POST",
        body: JSON.stringify({ type: "song", name: songName }),
      });
      setSongName("");
      onSongsChange([...songs, created]);
      onNotice("楽曲を追加しました");
    } catch (error) {
      onError(error);
    }
  };

  const toggleGroup = async (group: GroupRecord) => {
    try {
      const updated = await adminRequest<GroupRecord>("/api/admin/catalog", {
        method: "PATCH",
        body: JSON.stringify({ type: "group", id: group.id, display: group.display === false }),
      });
      onGroupsChange(groups.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      onError(error);
    }
  };

  const toggleSong = async (song: SongRecord) => {
    try {
      const updated = await adminRequest<SongRecord>("/api/admin/catalog", {
        method: "PATCH",
        body: JSON.stringify({ type: "song", id: song.id, display: song.display === false }),
      });
      onSongsChange(songs.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">グループ</h2>
        <div className="mb-4 flex gap-2">
          <input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="グループ名"
            className="input w-full"
          />
          <button type="button" className="btn" onClick={addGroup}>
            追加
          </button>
        </div>
        <ul className="space-y-2">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between rounded-xl bg-purple-50 px-3 py-2">
              <span>
                {group.group_name}
                {group.display === false && <span className="ml-2 text-xs text-gray-500">非表示</span>}
              </span>
              <button type="button" className="btn btn-xs" onClick={() => toggleGroup(group)}>
                {group.display === false ? "表示" : "非表示"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">楽曲</h2>
        <div className="mb-4 flex gap-2">
          <input
            value={songName}
            onChange={(event) => setSongName(event.target.value)}
            placeholder="楽曲名"
            className="input w-full"
          />
          <button type="button" className="btn" onClick={addSong}>
            追加
          </button>
        </div>
        <ul className="space-y-2">
          {songs.map((song) => (
            <li key={song.id} className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2">
              <span>
                {song.song_name}
                {song.display === false && <span className="ml-2 text-xs text-gray-500">非表示</span>}
              </span>
              <button type="button" className="btn btn-xs" onClick={() => toggleSong(song)}>
                {song.display === false ? "表示" : "非表示"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CheckboxList = ({
  items,
  selectedIds,
  onToggle,
}: {
  items: { id: string; name: string; hidden?: boolean }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-gray-100 p-3">
    {items.map((item) => (
      <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={selectedIds.includes(item.id)}
          onChange={() => onToggle(item.id)}
        />
        <span className={item.hidden ? "text-gray-400" : ""}>
          {item.name}
          {item.hidden ? "（非表示）" : ""}
        </span>
      </label>
    ))}
  </div>
);

export default AdminDashboard;
