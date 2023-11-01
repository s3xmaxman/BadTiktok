"use client";

import { CommentsHeaderCompTypes } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiLoaderCircle } from 'react-icons/bi'
import { BsTrash3, BsChatDots } from 'react-icons/bs'
import { ImMusic } from 'react-icons/im'
import { AiFillHeart } from 'react-icons/ai'
import ClientOnly from "../ClientOnly";
import { useLikeStore } from "@/app/stores/like";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { useUser } from "@/app/context/user";
import userIsLiked from "@/app/hooks/useIsLiked";
import useCreateLike from "@/app/hooks/useCreateLike";
import useDeleteLike from "@/app/hooks/useDeleteLike";
import useDeletePostById from "@/app/hooks/useDeletePostById";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import moment from "moment";

export default function CommentsHeader({ post, params}: CommentsHeaderCompTypes) {

    let { setLikesByPost, likesByPost } = useLikeStore()
    let { commentsByPost, setCommentsByPost } = useCommentStore()
    let { setIsLoginOpen } = useGeneralStore()
    

    const contextUser = useUser();
    const router = useRouter();
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [userLiked, setUserLiked] = useState<boolean>(false)
    

    useEffect(() => {
        setLikesByPost(params?.postId) // 投稿に関連するいいねを取得する
        setCommentsByPost(params?.postId) // 投稿に関連するコメントを取得する
    }, [post])

    useEffect(() => { hasUserLikedPost() }, [likesByPost]) // ユーザーが投稿にいいねをしているかどうかを確認する

    const hasUserLikedPost = () => {
        if (likesByPost.length < 1 || !contextUser?.user?.id) { // いいねがないか、ユーザーが存在しない場合
            setUserLiked(false) // ユーザーがいいねをしていないと設定する
            return
        }
        let res = userIsLiked(contextUser.user.id, params.postId, likesByPost) // ユーザーが投稿にいいねをしているかどうかを確認する
        setUserLiked(res ? true : false) // ユーザーがいいねをしているかどうかを設定する
    }

    const like = async() => {
        try {
            setHasClickedLike(true) // いいねボタンがクリックされたフラグを立てる
            await useCreateLike(contextUser?.user?.id || '', params.postId) // ユーザーがいいねを作成する
            setLikesByPost(params.postId) // 投稿に関連するいいねを取得する
            setHasClickedLike(false) // いいねボタンがクリックされたフラグを解除する
        } catch (error) {
            console.log(error) // エラーログを出力する
            alert(error) // エラーメッセージを表示する
            setHasClickedLike(false) // いいねボタンがクリックされたフラグを解除する
        }
    }

    const unlike = async(id: string) => {
        try {
            setHasClickedLike(true) // いいね解除ボタンがクリックされたフラグを立てる
            await useDeleteLike(id) // 指定されたIDのいいねを削除する
            setLikesByPost(params.postId) // 投稿に関連するいいねを取得する
            setHasClickedLike(false) // いいね解除ボタンがクリックされたフラグを解除する
        } catch (error) {
            console.log(error) // エラーログを出力する
            alert(error) // エラーメッセージを表示する
            setHasClickedLike(false) // いいね解除ボタンがクリックされたフラグを解除する
        }
    }

    const likeOrUnlike = () => {
        if(!contextUser?.user) return setIsLoginOpen(true) // ユーザーが存在しない場合、ログイン画面を表示する

        let res = userIsLiked(contextUser.user.id, params.postId, likesByPost) // ユーザーが投稿にいいねをしているかどうかを確認する

        if(!res){
            like() // いいねを作成する
        } else {
            likesByPost.forEach(like => {
                if(contextUser?.user?.id && contextUser.user.id == like.user_id && like.post_id == params.postId) {
                    unlike(like.id) // いいねを解除する
                }
            })
        }
    }

    const deletePost = async() => {
        let res = confirm('本当に削除しますか？')
        if(!res) return

        try {
            await useDeletePostById(params?.postId, post?.video_url)
            router.push(`/profile/${params.userId}`)
            setIsDeleting(false)
        } catch (error) {
            console.log(error)
            setIsDeleting(false)
            alert(error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-8">
                <div className="flex items-center">
                    <Link href={`/profile/${post?.user_id}`}>
                        {post?.profile?.image ? (
                            <img src={useCreateBucketUrl(post.profile.image)} width="40" className="rounded-full lg:mx-0 mx-auto"/>
                        ) : (
                            <div className="w-[40px] h-[40px] rounded-full bg-gray-200" />
                        )}
                    </Link>
                    <div className="ml-3 pt-0.5">
                        <Link
                            href={`/profile/${post?.user_id}`}
                            className="relative z-10 text-[17px] font-semibold hover:underline"
                        >
                            {post?.profile?.name}
                        </Link>
                        <div className="relative z-0 text-[13px] -mt-5 font-light ">
                            {post?.profile.name}
                            <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5 ">.</span>
                            <span className="font-medium">{moment(post?.created_at).calendar()}</span>
                        </div>
                    </div>
                </div>
                {contextUser?.user?.id == post?.user_id ? (
                    <div>
                        {isDeleting ? (
                            <BiLoaderCircle className="animate-spin" size="25"/>
                        ) : (
                            <button disabled={isDeleting} onClick={() => deletePost()}>
                                <BsTrash3 className="cursor-pointer" size="25"/>
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
            <p className="px-8 mt-4 text-sm">{post?.text}</p>
            <p className="flex items-center px-8 gap-2 mt-4 text-sm font-bold">
                <ImMusic size="17"/>
                original sound - {post?.profile?.name}
            </p>
            <div className=" flex items-center px-8 mt-8">
                <ClientOnly>
                    <div className="pb-4 text-center flex items-center">
                        <button
                            disabled={hasClickedLike}
                            onClick={() => likeOrUnlike()}
                            className="rounded-full bg-gray-200 p-2 cursor-pointer"
                        >
                           {!hasClickedLike ? (
                               <AiFillHeart color={likesByPost?.length && userLiked ? "#ff2626" : ""} size="25"/>
                           ):(
                               <BiLoaderCircle className="animate-spin" size="25"/> 
                           )}
                        </button>
                        <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
                          { likesByPost?.length }
                        </span>
                    </div>
                </ClientOnly>
                <div className="pb-4 text-center flex items-center">
                    <div className=" rounded-full bg-gray-200 p-2 cursor-pointer">
                        <BsChatDots size={25} />
                    </div>
                    <span className="text-xs pl-2 text-gray-800 font-semibold">
                      { commentsByPost?.length }
                    </span>
                </div>
            </div>
        </>
    )
}