import { database, Query, storage } from "@/libs/AppWriteClient"
import useDeleteComment from "./useDeleteComment";
import useDeleteLike from "./useDeleteLike";
import useGetCommentsByPostId from "./useGetCommentsByPostId";
import useGetLikesByPostId from "./useGetLikesByPostId";


// 投稿をIDで削除する非同期関数
const useDeletePostById = async (postId: string, currentImage: string) => {
    try {
        // 指定した投稿の「いいね!」を取得
        const likes = await useGetLikesByPostId(postId);
        // 「いいね!」を1つずつ削除
        likes.forEach(async like=> { await useDeleteLike(like?.id)});
        
        // 指定した投稿のコメントを取得  
        const comments = await useGetCommentsByPostId(postId);
        // コメントを1つずつ削除
        comments.forEach(async comment=> { await useDeleteComment(comment?.id)});
         
       
        // 投稿ドキュメントを削除
        await database.deleteDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST),
            postId
        )
        
         // 紐づくメディアファイルを削除 
        await storage.deleteFile(
            String(process.env.NEXT_PUBLIC_BUCKET_ID),
            currentImage
        )

        
    } catch (error) {
        throw error
    }
}

export default useDeletePostById