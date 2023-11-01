import { database, Query } from "@/libs/AppWriteClient"

export const useSearchProfilesByName = async (name: string) => {
    try {
        // データベースからプロファイルを取得
        const profileResult = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE),
            [   
                Query.limit(5),
                Query.equal("name", name)
            ]
        );
        
        // ドキュメントをマップして必要な情報のみのオブジェクトに変換
        const objPromises = profileResult.documents.map(async profile => {
            return {
                id: profile?.user_id,
                name: profile?.name,
                image: profile?.image
            }
        })

        // Promiseをまとめて実行し、結果の配列を取得 
        const result = await Promise.all(objPromises)
        return result
    } catch (error) {
        console.log(error)
    }
}

export default useSearchProfilesByName;