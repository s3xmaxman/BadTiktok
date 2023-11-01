import { storage } from "@/libs/AppWriteClient"
import Image from "image-js";


const useChangeUserImage = async (file: File, cropper: any, currentImage: string ) => {
    
    let videoId = Math.random().toString(36).slice(2, 22); // ランダムなビデオIDを生成する

    const x = cropper.left;
    const y = cropper.top;
    const width = cropper.width;
    const height = cropper.height; 

    
    try {
        const response = await fetch(URL.createObjectURL(file)); // ファイルのURLを取得してリクエストを送信する
        const imageBuffer = await response.arrayBuffer(); // レスポンスのバッファーを取得する
        const image = await Image.load(imageBuffer); // バッファーから画像を読み込む
        const croppedImage = image.crop({x, y, width, height}); // 画像を指定された座標とサイズで切り抜く
        const resizedImage = croppedImage.resize({width: 200, height: 200}); // 切り抜いた画像を指定されたサイズにリサイズする
        const blob = await resizedImage.toBlob(); // 画像をBlobオブジェクトに変換する
        const arrayBuffer = await blob.arrayBuffer(); // Blobオブジェクトをバッファーに変換する
        const finalFile = new File([arrayBuffer], file.name, {type: blob.type}); // バッファーから新しいファイルを作成する
        const result = await storage.createFile(
            String(process.env.NEXT_PUBLIC_BUCKET_ID),
            videoId,
            finalFile
        ); // ファイルをストレージにアップロードする
           
        // 現在の画像がデフォルトの画像IDと異なる場合、ストレージから画像を削除する
        if (currentImage != String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID)) {
            await storage.deleteFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), currentImage);
           
        }
        
        return result?.$id // アップロードされたファイルのIDを返す
    } catch (error) {
        throw error // エラーをスローする
    }

}

export default useChangeUserImage