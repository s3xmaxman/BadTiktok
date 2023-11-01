import { database, ID } from "@/libs/AppWriteClient" 

// コメントを作成する関数
const useCreateComment = async (userId: string, postId: string, comment: string) => {

  
  try {

    // データベースに新しいコメントドキュメントを作成
    // コレクションID、一意のID、ユーザーID、投稿ID、テキスト、作成日時を設定
    await database.createDocument(
      String(process.env.NEXT_PUBLIC_DATABASE_ID), 
      String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT),
      ID.unique(),
      {
        user_id: userId, 
        post_id: postId,
        text: comment,
        created_at: new Date().toISOString()  
      }
    )

  // エラーが発生した場合はキャッチしてスロー
  } catch (error) {
    throw error 
  }

}

export default useCreateComment;