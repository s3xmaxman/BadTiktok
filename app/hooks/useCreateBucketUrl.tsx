
// AppwriteストレージのバケットURLを作成する関数
const  useCreateBucketUrl = (fileId: string) => {
    
    const url = process.env.NEXT_PUBLIC_APPWRITE_URL // Appwrite URL 
    const id = process.env.NEXT_PUBLIC_BUCKET_ID // バケットID 
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT // エンドポイント

    if(!url || !id || !endpoint) return '' // URL、ID、エンドポイントが設定されていない場合は空の文字列を返す

    return  `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endpoint}`  // バケットURLを返す 
}
    

export default useCreateBucketUrl;