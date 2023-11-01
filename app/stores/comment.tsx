import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { CommentWithProfile } from '../types';
import useGetCommentsByPostId from '../hooks/useGetCommentsByPostId';
  
interface CommentStore {
    commentsByPost: CommentWithProfile[]
    setCommentsByPost: (postId: string) => void;
}

// コメント情報を管理するストア
export const useCommentStore = create<CommentStore>()( 
    devtools(
        persist(
            (set) => ({
                 // 投稿ごとのコメント情報
                commentsByPost: [],
                
                 // 投稿のコメント取得と状態の更新 
                setCommentsByPost: async (postId: string) => {
                    const result = await useGetCommentsByPostId(postId)
                    set({ commentsByPost: result });
                },
            }),
            // ストアの名前とlocalStorageへの保存
            { 
                name: 'store', 
                storage: createJSONStorage(() => localStorage) 
            }
        )
    )
)