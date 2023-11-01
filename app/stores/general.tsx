import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { RandomUsers } from '../types';
import useGetRandomUsers from '../hooks/useGetRondomUsers';


interface GeneralStore {
    isLoginOpen: boolean,
    isEditProfileOpen: boolean,
    randomUsers: RandomUsers[],
    setIsLoginOpen: (val: boolean) => void,
    setIsEditProfileOpen: (val: boolean) => void,
    setRandomUsers: () => void
}

export const useGeneralStore = create<GeneralStore>()(
    devtools(
        persist(
            (set) => ({
                isLoginOpen: false, // ログインウィンドウが開いているかどうかの状態
                isEditProfileOpen: false, // プロフィール編集ウィンドウが開いているかどうかの状態
                randomUsers: [], // ランダムなユーザーのリスト
                setIsLoginOpen: (val: boolean) => set({ isLoginOpen: val }), // ログインウィンドウの状態を設定する関数
                setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }), // プロフィール編集ウィンドウの状態を設定する関数
                setRandomUsers: async () => { // ランダムなユーザーを取得して設定する関数
                    const result = await useGetRandomUsers();
                    set({ randomUsers: result });
                },
            }),
            {
                name: 'store', // ストレージ名
                storage: createJSONStorage(() => localStorage) // ストレージの種類
            }
        )
    )
);