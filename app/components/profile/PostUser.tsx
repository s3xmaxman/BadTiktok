import { useEffect } from "react";
import { PostUserCompTypes } from "../../types";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SiSoundcharts } from "react-icons/si";
import { BiErrorCircle } from "react-icons/bi";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";

export default function PostUser({ post }: PostUserCompTypes) {
    
    useEffect(() => {
        const video = document.getElementById(`video${post.id}`) as HTMLVideoElement
        const handleMouseEnter = () => {
            video.play() // マウスが要素に入った時にビデオを再生する
        }
        const handleMouseLeave = () => {
            video.pause() // マウスが要素から出た時にビデオを一時停止する
            video.currentTime = 0 // ビデオの再生位置を初期化する
        }
        video.addEventListener('mouseenter', handleMouseEnter) // マウスが要素に入った時のイベントリスナーを追加する
        video.addEventListener('mouseleave', handleMouseLeave) // マウスが要素から出た時のイベントリスナーを追加する

        return () => {
            video.removeEventListener('mouseenter', handleMouseEnter) // クリーンアップ時にイベントリスナーを削除する
            video.removeEventListener('mouseleave', handleMouseLeave) // クリーンアップ時にイベントリスナーを削除する
        }
    }, [])

    return (
        <>
            <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
               {!post.video_url ? (
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                    <Link href={`/post/${post.id}/${post.user_id}`}>
                        <video 
                            id={`video${post.id}`}
                            muted
                            loop
                            className="aspect-[3/4] object-cover rounded-md" 
                            src={useCreateBucketUrl(post.video_url)}
                        />
                    </Link>
                )}
                <div className="px-1">
                    <p className="text-gray-700 text-[15px] pt-1 break-words">
                        {post.text}
                    </p>
                    <div className="flex items-center gap-1 -ml-1 text-gray-600 font-bold text-xs">
                        <SiSoundcharts size="15"/>
                        <BiErrorCircle  size="16"/>
                    </div>
                </div>
            </div>
        </>
    )
}