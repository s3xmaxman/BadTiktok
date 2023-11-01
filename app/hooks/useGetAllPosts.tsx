import { database, Query } from "@/libs/AppWriteClient"
import useGetProfileByUserId from "./useGetProfileByUserId";

// 全ての投稿を取得する非同期関数
const useGetAllPosts = async () => {
    // 投稿コレクションから作成日時の降順でドキュメントを取得
    try {
        const response = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST),
            [Query.orderDesc("$id")]
        );
        // ドキュメントの配列を取得 
        const documents = response.documents;
        // ドキュメントをマップして必要な情報のみのオブジェクトに変換
        const objPromises = documents.map(async doc => {
            // 投稿ユーザーのプロファイル情報を取得
            let profile = await useGetProfileByUserId(doc.user_id);
     
            return {
                id: doc?.$id,
                user_id: doc?.user_id,
                video_url: doc?.video_url,
                text: doc?.text,
                created_at: doc?.created_at,
                profile: {
                    user_id: profile?.user_id,
                    name: profile?.name,
                    image: profile?.image
                }
            }
        })
        
        // Promiseをまとめて実行し、結果の配列を取得 
        const result = await Promise.all(objPromises)
        return result;
    } catch (error) {
        throw error
    }
}


export default useGetAllPosts