import { database, Query } from "@/libs/AppWriteClient"

// ランダムユーザー取得フック
const useGetRandomUsers = async () => {
    try {
      // DataBaseからプロファイルを取得
      const profileResult = await database.listDocuments(
        String(process.env.NEXT_PUBLIC_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE),  
        [
          Query.limit(5) // 5件に限定  
        ]
      );
  
      const documents = profileResult.documents
  
      // 必要な情報のみマップ
      const objPromises = documents.map(profile => {
        return {
          id: profile?.user_id,
          name: profile?.name, 
          image: profile?.image,
        }
      })
      
      // Promiseをまとめて実行し、結果の配列を取得
      const result = await Promise.all(objPromises)
  
      return result;
  
    } catch (error) {
      console.log(error);
    }
}

export default useGetRandomUsers