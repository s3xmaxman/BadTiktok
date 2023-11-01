import { database, Query } from "@/libs/AppWriteClient"


// 指定した投稿の「いいね!」を取得する非同期関数
const useGetLikesByPostId = async (postId: string) => {

    try {
  
      // 「いいね!」コレクションからpost_idが一致するドキュメントを検索
      const response = await database.listDocuments(
        String(process.env.NEXT_PUBLIC_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE),  
        [Query.equal('post_id', postId)] 
      )
      
      // ドキュメントの配列を取得
      const documents = response.documents;
  
      // ドキュメントをマップして必要なプロパティのみのオブジェクトに変換
      const result = documents.map(doc => {
        return {
          id: doc?.$id,
          user_id: doc?.user_id,
          post_id: doc?.post_id
        }
      })
      
      // 変換したオブジェクトを返す
      return result;
  
    } catch (error) {
      throw error
    }
  }
  
  export default useGetLikesByPostId