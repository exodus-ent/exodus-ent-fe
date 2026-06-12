'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase';

export interface Idol {
  id: string;
  name: string;
  group_name: string | null;
  profile_image_url: string | null;
  description: string | null;
}

interface Props {
  idol?: Idol | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function IdolForm({ idol, onSave, onCancel }: Props) {
  const [name, setName] = useState(idol?.name ?? '');
  const [groupName, setGroupName] = useState(idol?.group_name ?? '');
  const [description, setDescription] = useState(idol?.description ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(idol?.profile_image_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      let profileImageUrl = idol?.profile_image_url ?? null;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('idol-profiles')
          .upload(path, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('idol-profiles').getPublicUrl(path);
        profileImageUrl = urlData.publicUrl;
      }

      const payload = {
        name: name.trim(),
        group_name: groupName.trim() || null,
        description: description.trim() || null,
        profile_image_url: profileImageUrl,
      };

      if (idol) {
        const { error: updateError } = await supabase.from('idols').update(payload).eq('id', idol.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('idols').insert(payload);
        if (insertError) throw insertError;
      }

      onSave();
    } catch (err) {
      setError((err as Error).message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]";
  const labelClass = "mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>이름 *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            placeholder="아이돌 이름" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>그룹명</label>
          <input value={groupName} onChange={(e) => setGroupName(e.target.value)}
            placeholder="그룹명 (선택)" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>설명</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} placeholder="아이돌 소개 (선택)"
            className={`${inputClass} resize-none`} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>프로필 이미지</label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setImageFile(file);
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border border-white/15 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              이미지 선택
            </button>
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="미리보기"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-white/20" />
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 text-sm text-white/40 transition-colors hover:text-white/70">
          취소
        </button>
        <button type="submit" disabled={loading}
          className="bg-[#CCFF00] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60">
          {loading ? '저장 중...' : idol ? '수정 완료' : '등록'}
        </button>
      </div>
    </form>
  );
}
