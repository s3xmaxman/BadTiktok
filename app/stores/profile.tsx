import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { Profile } from '../types';
import useGetProfileByUserId from '../hooks/useGetProfileByUserId';


interface ProfileStore {
  currentProfile: Profile | null;
  setCurrentProfile: (userId: string) => void;
}

// プロファイル情報を管理するストア
export const useProfileStore = create<ProfileStore>()(
    devtools(
      persist(
        (set) => ({
          // 現在のプロファイル情報
          currentProfile: null,
          
          // ユーザーIDからプロファイルを取得し、currentProfileを更新
          setCurrentProfile: async (userId: string) => {
            const result = await useGetProfileByUserId(userId);
            set({ currentProfile: result }); 
          },
        }), 

        {
          // ストアの名前
          name: 'store',
          // localStorageに保存 
          storage: createJSONStorage(() => localStorage),  
        }
      )
    )
  )


