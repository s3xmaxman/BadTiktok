import { AiFillHeart } from "react-icons/ai"
import { FaShare, FaCommentDots } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useUser } from "../context/user"
import { BiLoaderCircle } from "react-icons/bi"
import { useGeneralStore } from "../stores/general"
import { useRouter } from "next/navigation"
import { Comment, Like, PostMainLikesCompTypes } from "../types"
import useGetCommentsByPostId from "../hooks/useGetCommentsByPostId"
import useGetLikesByPostId from "../hooks/useGetLikesByPostId"
import useIsLiked from "../hooks/useIsLiked"
import useCreateLike from "../hooks/useCreateLike"
import useDeleteLike from "../hooks/useDeleteLike"
import userIsLiked from "../hooks/useIsLiked"

export default function PostMainLikes({post} : PostMainLikesCompTypes) {

    let  { setIsLoginOpen } = useGeneralStore();

    const router = useRouter();
    const contextUser = useUser();
    
    const [hasClickedLike, setHasClickedLike] = useState<boolean>(false)
    const [userLiked, setUserLiked] = useState<boolean>(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [likes, setLikes] = useState<Like[]>([])

    useEffect(() => {
        getAllCommentsByPost();
        getAllLikesByPost();
    }, [post])

    useEffect(() => { hasUserLikedPost() }, [likes, contextUser])

    const getAllLikesByPost = async () => {
        let result = await useGetLikesByPostId(post?.id);
        setLikes(result);
    }

    const getAllCommentsByPost = async () => {
        let result = await useGetCommentsByPostId(post?.id)
        setComments(result);
    }

const hasUserLikedPost = () => {
    if(!contextUser) return; // コンテキストのユーザーが存在しない場合、処理を終了する
    if(likes?.length < 1 || !contextUser?.user?.id) {
        setUserLiked(false); // いいねが存在しないか、ユーザーが存在しない場合、ユーザーがいいねした状態をfalseに設定する
        return;
    }
    let res = userIsLiked(contextUser.user.id, post?.id, likes) // ユーザーが投稿にいいねをしているか確認する
    setUserLiked(res ? true : false); // ユーザーがいいねしている場合はtrue、していない場合はfalseを設定する
}

    // いいねをする
    const like = async () => {
        setHasClickedLike(true) // いいねボタンをクリック済みに設定
        await useCreateLike(contextUser?.user?.id || '', post?.id) // いいねを作成する
        await getAllLikesByPost() // 投稿に対する全てのいいねを取得する
        hasUserLikedPost() // ユーザーが投稿にいいねをしているか確認する
        setHasClickedLike(false) // いいねボタンのクリック状態をリセット
    }

    // いいねを取り消す
    const unlike = async (id: string) => {
        setHasClickedLike(true) // いいねボタンをクリック済みに設定
        await useDeleteLike(id) // いいねを削除する
        await getAllLikesByPost() // 投稿に対する全てのいいねを取得する
        hasUserLikedPost() // ユーザーが投稿にいいねをしているか確認する
        setHasClickedLike(false) // いいねボタンのクリック状態をリセット
    }

const likeOrUnlike = () => {
    if (!contextUser?.user?.id) {
        setIsLoginOpen(true) // ユーザーがログインしていない場合、ログインダイアログを表示して処理を終了する
        return
    }
    let res = useIsLiked(contextUser?.user?.id, post?.id, likes) // ユーザーが投稿にいいねをしているか確認する
    if (!res) {
        like() // いいねしていない場合は、いいねを実行する
    } else {
        likes.forEach((like: Like) => {
            if (contextUser?.user?.id == like?.user_id && like?.post_id == post?.id) {
                unlike(like?.id) // ユーザーが投稿にいいねをしている場合は、いいねを取り消す
            }
        })
    }
}

    return (
        <div id={`PostMainLikes-${post?.id}`} className="relative mr-[75px]">
            <div className="absolute bottom-0 pl-2">
                <div className="pb-4 text-center">
                    <button
                    disabled={hasClickedLike}
                    onClick={() => likeOrUnlike()}
                    className="rounded-full bg-gray-200 p-2 cursor-pointer"
                    >
                    {!hasClickedLike ? (
                        <AiFillHeart color={likes?.length > 0 && userLiked ? '#ff2626' : ''} size="25"/>
                    ): (
                        <BiLoaderCircle className="animate-spin" size="25"/> 
                    )}
                    </button>
                    <span className="text-xs text-gray-800 font-semibold">
                        {likes?.length}
                    </span>
                </div>
                <button
                 className="pb-4 text-center"
                 onClick={() => router.push(`/post/${post?.id}/${post?.profile?.user_id}`)}
                >
                <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                    <FaCommentDots size="25"/>
                </div>
                <span className="text-xs text-gray-800 font-semibold">
                  {comments?.length}
                </span>
                </button>
                 
                <button className="text-center">
                        <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                            <FaShare size="25"/>
                        </div>
                        <span className="text-xs text-gray-800 font-semibold">55</span>
                </button>
            </div>
        </div>
    )
}