import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Post, PostWithProfile } from '../types';
import useGetAllPosts from '../hooks/useGetAllPosts';
import useGetPostsByUser from '../hooks/useGetPostsByUserId';
import useGetPostById from '../hooks/useGetPostById';

interface PostStore {
    allPosts: PostWithProfile[];
    postsByUser: Post[];
    postById: PostWithProfile | null;
    setAllPosts: () => void;
    setPostsByUser: (userId: string) => void;
    setPostById: (postId: string) => void;
}

// 投稿情報を管理するストア
export const usePostStore = create<PostStore>()(
    devtools(
      persist(
        (set) => ({
          // 全ての投稿
          allPosts: [],   
          // ユーザーごとの投稿
          postsByUser: [],
          // ID指定の投稿
          postById: null,
          // 全投稿情報の取得と状態の更新
          setAllPosts: async () => {
            const result = await useGetAllPosts()
            set({ allPosts: result });
          },
          // ユーザーの投稿取得と状態の更新
          setPostsByUser: async (userId: string) => {
            const result = await useGetPostsByUser(userId)
            set({ postsByUser: result });
          },
          // ID指定投稿の取得と状態の更新
          setPostById: async (postId: string) => {
            const result = await useGetPostById(postId)
            set({ postById: result })
          },
        }),
    
        // ストアの名前  
        {
          name: 'store',
          // localStorageへの保存
          storage: createJSONStorage(() => localStorage) 
        }
      )
    )  
  )