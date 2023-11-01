import { database, Query } from "@/libs/AppWriteClient"
// ユーザーIDから投稿を取得する非同期関数
const useGetPostsByUserId = async (userId: string) => {
    try {
        // 指定ユーザーの投稿を作成日時の降順で取得
        const response = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID), 
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST), 
            [
                Query.equal('user_id', userId),
                Query.orderDesc("$id")
            ]
        );
        // ドキュメントの配列を取得
        const documents = response.documents;
        // ドキュメントをマップして必要なプロパティのみのオブジェクトに変換
        const result = documents.map(doc => {
            return { 
                id: doc?.$id, 
                user_id: doc?.user_id,
                video_url: doc?.video_url,
                text: doc?.text,
                created_at: doc?.created_at,
            }
        })
        
        return result
    } catch (error) {
        throw error
    }
}

export default useGetPostsByUserId