import { database, ID } from "@/libs/AppWriteClient"

// いいねを作成する関数
const useCreateLike = async (userId: string, postId: string) => {
    try {
        // データベースに新しいいいねドキュメントを作成
        await database.createDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID), 
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE), 
            ID.unique(), 
        {
            user_id: userId,
            post_id: postId,
        });
    } catch (error) {
        throw error
    }
}

export default useCreateLike