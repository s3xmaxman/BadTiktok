import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Like } from '../types';
import useGetLikesByPostId from '../hooks/useGetLikesByPostId';

// LikeStore インターフェースの定義
interface LikeStore {
    likesByPost: Like[]; // 投稿ごとのいいねリスト
    setLikesByPost: (postId: string) => void; // 投稿ごとのいいねリストを設定するメソッド
}

// useLikeStore の作成
export const useLikeStore = create<LikeStore>()(
    devtools(
        persist(
            (set) => ({
                likesByPost: [], // 初期状態では空のいいねリスト
                setLikesByPost: async (postId: string) => {
                    const result = await useGetLikesByPostId(postId); // useGetLikesByPostId フックを使って投稿IDに基づいていいねリストを取得
                    set({ likesByPost: result }); // 取得した結果をいいねリストとして設定
                },
            }),
            {
                name: 'store',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);