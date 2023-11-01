import { database, Query } from "@/libs/AppWriteClient"
import useGetProfileByUserId from "./useGetProfileByUserId"

// 指定した投稿のコメントを取得する非同期関数
const useGetCommentsByPostId = async (postId: string) => {

    try {
  
      // コメントコレクションからpost_idが一致し、作成日時順に並べたドキュメントを取得
      const commentsResult = await database.listDocuments(
        String(process.env.NEXT_PUBLIC_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT),  
        [
          Query.equal('post_id', postId),
          Query.orderDesc("$id")  
        ]
      );
  
      // 各コメントドキュメントに対してユーザー情報を取得するPromiseを生成
      const objPromises = commentsResult.documents.map(async comment => {
  
        // コメントしたユーザーのプロファイル情報を取得
        const profile = await useGetProfileByUserId(comment.user_id);
  
        // コメントオブジェクトを返す
        return {
          id: comment?.$id,
          user_id: comment?.user_id,
          post_id: comment?.post_id, 
          text: comment?.text,
          created_at: comment?.created_at,
          profile: {
            user_id: profile?.user_id,
            name: profile?.name,
            image: profile?.image
          }
        };
      });
      
      // Promiseをまとめて実行し、結果の配列を取得
      const result = await Promise.all(objPromises);
  
      return result;
  
    } catch (error) {
      throw error
    }
  }
export default useGetCommentsByPostId




