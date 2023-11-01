import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Like } from '../types';
import useGetLikesByPostId from '../hooks/useGetLikesByPostId';

interface LikeStore {
    likesByPost: Like[];
    setLikesByPost: (postId: string) => void;
}

// 「いいね!」情報を管理するストア
export const useLikeStore = create<LikeStore>()(
    devtools(
      persist(
        (set) => ({
          // 投稿ごとの「いいね!」情報
          likesByPost: [],
          // 投稿の「いいね!」取得と状態の更新
          setLikesByPost: async (postId: string) => {
            const result = await useGetLikesByPostId(postId)
            set({ likesByPost: result });
          },
        }),
        // ストアの名前とlocalStorageへの保存  
        {
          name: 'store',
          storage: createJSONStorage(() => localStorage)  
        }
      )
    )
);